"use server";

import { Car } from "@/lib/data";
import { serializedCarData } from "@/lib/helper";
import { db } from "@/lib/prisma";
import { createClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

type Result = { success: true; data?: Car } | { success: false; error: string };

const fileToBase64 = async (file) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
};

export async function processCarImageWithAI(file) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
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
    Analyze this car image and extract the following information:
    1. Make (manufacturer)
    2. Model
    3. Year (approximately)
    4. Color
    5. Body type (SUV, Sedan, Hatchback, etc.)
    6. Mileage (approximate in km or miles) dont add any unit between 5 to 30
    7. Number of seats (your best guess)
    7. Fuel type (your best guess)
    8. Transmission type (your best guess)
    9. Price (your best indian price guess) in string only dont add any currency symbol
    9. Short Description as to be added to a car listing

    Format your response as a clean JSON object with these fields:
    {
      "make": "",
      "model": "",
      "year": 0000,
      "color": "",
      "price": "",
      "mileage": "",
      "bodyType": "",
      "fuelType": "",
      seats:"",
      "transmission": "",
      "description": "",
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

      const requiredFields = [
        "make",
        "model",
        "year",
        "color",
        "price",
        "mileage",
        "seats",
        "bodyType",
        "fuelType",
        "transmission",
        "description",
        "confidence",
      ];

      const missingFields = requiredFields.filter(
        (field) => !(field in carDetails)
      );

      if (missingFields.length > 0) {
        throw new Error(
          `AI response Missing fields: ${missingFields.join(", ")}`
        );
      }

      return {
        success: true,
        data: carDetails,
      };
    } catch (error) {
      console.log("Failed to parse AI response:", error);
      return {
        success: false,
        error: "Failed to parse AI response",
      };
    }
  } catch (error) {
    console.log("Gemini API error:", error);
    throw new Error("Gemini API error: " + error?.message);
  }
}

export async function addCar({ carData, images }): Promise<Result> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const carId = uuidv4();

    const folderPath = `cars/${carId}`;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const imageUrls = [];
    for (let i = 0; i < images.length; i++) {
      const base64Data = images[i];
      if (!base64Data || !base64Data.startsWith("data:image/")) {
        console.warn("Invalid image data:", base64Data);
        continue;
      }
      const base64 = base64Data.split(",")[1];
      const imageBuffer = Buffer.from(base64, "base64");
      const mimeMatch = base64Data.match(/data:image\/([a-zA-Z0-9]+);/);
      const fileExtension = mimeMatch ? mimeMatch[1] : "jpeg";

      const fileName = `carsense-image-${Date.now()}-${i}.${fileExtension}`;
      const filePath = `${folderPath}/${fileName}`;
      const { data, error } = await supabase.storage
        .from("car-images")
        .upload(filePath, imageBuffer, {
          contentType: `image/${fileExtension}`,
        });
      if (error) {
        console.error("Error uploading image:", error);
        throw new Error("Error uploading image: " + error.message);
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/car-images/${filePath}`;
      imageUrls.push(publicUrl);
    }
    if (imageUrls.length === 0) {
      throw new Error("No images uploaded successfully");
    }

    const car = await db.car.create({
      data: {
        id: carId,
        make: carData.make,
        model: carData.model,
        year: carData.year,
        color: carData.color,
        price: parseFloat(carData.price),
        mileage: parseFloat(carData.mileage),
        bodyType: carData.bodyType,
        fuelType: carData.fuelType,
        transmission: carData.transmission,
        description: carData.description,
        images: imageUrls,
        seats: carData.seats,
        featured: carData.featured,
        status: carData.status,
      },
    });
    revalidatePath("/admin/cars");
    return {
      success: true,
    };
  } catch (error) {
    throw new Error("Error adding car: " + error?.message);
  }
}

export async function getCars({ search }: { search?: string }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }
    const trimmed = typeof search === "string" ? search.trim() : "";
    const isSearch = trimmed.length > 0;

    const cars = await db.car.findMany({
      where: isSearch
        ? {
            OR: [
              { make: { contains: trimmed, mode: "insensitive" } },
              { model: { contains: trimmed, mode: "insensitive" } },
              { color: { contains: trimmed, mode: "insensitive" } },
              ...(isNaN(Number(trimmed)) ? [] : [{ year: Number(trimmed) }]),
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: cars.map(serializedCarData) || [],
    };
  } catch (error: any) {
    console.error("Error fetching cars:", error.message || error);
    return {
      success: false,
      error: error.message || "Something went wrong",
    };
  }
}

export const deleteCar = async (carId: any): Promise<Result> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const car = await db.car.findUnique({
      where: {
        id: carId,
      },
      select: { images: true },
    });

    if (!car) {
      return {
        success: false,
        error: "Car not found",
      };
    }

    await db.car.delete({
      where: { id: carId },
    });
    try {
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);
      const filePath = car.images
        .map((imageUrl) => {
          const url = new URL(imageUrl);
          const pathMatch = url.pathname.match(/\/car-images\/(.*)/);
          return pathMatch ? pathMatch[1] : null;
        })
        .filter(Boolean);

      if (filePath.length > 0) {
        const { error } = await supabase.storage
          .from("car-images")
          .remove(filePath);
        if (error) {
          console.log("Error deleting images from Supabase:", error);
        }
      }
    } catch (storageError) {
      console.log("Error deleting images from Supabase:", storageError);
    }
    revalidatePath("/admin/cars");
    return {
      success: true,
    };
  } catch (error) {
    console.log("Error deleting car:", error);
    return {
      success: false,
      error: error?.message || "Error deleting car",
    };
  }
};

export const updateCarStatus = async (
  carId: string,
  { status, featured }: { status?: string; featured?: boolean }
): Promise<Result> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const car = await db.car.findUnique({
      where: { id: carId },
      select: { id: true },
    });
    if (!car) {
      throw new Error("Car not found");
    }

    const updateData: { status?: string; featured?: boolean } = {};
    if (status !== undefined) updateData.status = status;
    if (featured !== undefined) updateData.featured = featured;

    const updatedCar = await db.car.update({
      where: { id: carId },
      data: updateData,
    });

    revalidatePath("/admin/cars");

    // Ensure success and data are always returned
    return {
      success: true,
      data: updatedCar,
    };
  } catch (error) {
    console.error("Error updating car status:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred while updating car status",
    };
  }
};
