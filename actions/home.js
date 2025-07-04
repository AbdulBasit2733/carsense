"use server";

import aj from "@/lib/arcjet";
import { serializedCarData } from "@/lib/helper";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { GoogleGenerativeAI } from "@google/generative-ai";

const fileToBase64 = async (file) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
};

export async function getFeaturedCars(limit = 3) {
  try {
    const cars = await db.car.findMany({
      where: {
        featured: true,
        status: "AVAILABLE",
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: "Fetch Successfully",
      data: cars.map((car) => serializedCarData(car)),
    };
  } catch (error) {
    console.log(error);
    // throw new Error(":" + error?.message);
    return {
      success: false,
      message: "Error fetching featured cars",
    };
  }
}

export async function processImageSearch(file) {
  try {
    // Rate limiting with arcjet
    const req = await request();
    const decision = await aj.protect(req, {
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.log({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });
        return {
          success: false,
          error: "Too Many Requests, Please try again later",
        };
      }
      return {
        success: false,
        error: "Request Blocked",
      };
    }

    if (!process.env.GEMINI_API_KEY) {
      return {
        success: false,
        error: "Gemini API key is not configured",
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const base64Image = await fileToBase64(file);

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: file.type,
      },
    };

    const prompt = `
      Analyze this car image and extract the following information for a search query:
      1. Make (manufacturer)
      2. Body type (SUV, Sedan, Hatchback, etc.)
      3. Color

      Format your response as a clean JSON object with these fields:
      {
        "make": "",
        "bodyType": "",
        "color": "",
        "confidence": 0.0
      }

      For confidence, provide a value between 0 and 1 representing how confident you are in your overall identification.
      Only respond with the JSON object, nothing else.
    `;

    const result = await model.generateContent([imagePart, prompt]);
    const response = await result.response;
    const text = await response.text(); // Ensure it's text before processing
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const carDetails = JSON.parse(cleanedText);
      return {
        success: true,
        data: carDetails,
        message:"Fetch successfully"
      };
    } catch (error) {
      console.error("Failed to parse AI response ", error);
      return {
        success: false,
        error: "Failed to parse AI response",
      };
    }
  } catch (error) {
    console.error("AI search error:", error);
    return {
      success: false,
      error: "AI search error: " + (error?.message || "Unknown error"),
    };
  }
}

