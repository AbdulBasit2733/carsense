"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { serializedCarData } from "../lib/helper";


export async function getCarFilters() {
  try {
    const makes = await db.car.findMany({
      where: {
        status: "AVAILABLE",
      },
      select: { make: true },
      distinct: ["make"],
      orderBy: {
        make: "asc",
      },
    });

    const bodyTypes = await db.car.findMany({
      where: {
        status: "AVAILABLE",
      },
      select: { bodyType: true },
      distinct: ["bodyType"],
      orderBy: {
        bodyType: "asc",
      },
    });

    const fuelTypes = await db.car.findMany({
      where: {
        status: "AVAILABLE",
      },
      select: { fuelType: true },
      distinct: ["fuelType"],
      orderBy: {
        fuelType: "asc",
      },
    });
    const transmissions = await db.car.findMany({
      where: {
        status: "AVAILABLE",
      },
      select: {
        transmission: true,
      },
      distinct: ["transmission"],
      orderBy: {
        transmission: "asc",
      },
    });

    const priceAggregations = await db.car.aggregate({
      where: {
        status: "AVAILABLE",
      },
      _min: { price: true },
      _max: { price: true },
    });

    return {
      success: true,
      data: {
        makes: makes.map((item) => item.make),
        bodyTypes: bodyTypes.map((item) => item.bodyType),
        fuelTypes: fuelTypes.map((item) => item.fuelType),
        transmissions: transmissions.map((item) => item.transmission),
        priceRange: {
          min: priceAggregations._min.price
            ? parseFloat(priceAggregations._min.price.toString())
            : 0,
          max: priceAggregations._max.price
            ? parseFloat(priceAggregations._max.price.toString())
            : 1000000,
        },
      },
    };
  } catch (error) {
     return {
      success: false,
      message: "Error toggling saved car: " + error.message,
    };
  }
}

export async function getCars({
  search = "",
  make = "",
  bodyType = "",
  fuelType = "",
  transmission = "",
  minPrice = 0,
  maxPrice = Number.MAX_SAFE_INTEGER,
  sortBy = "newest",
  page = 1,
  limit = 6,
}) {
  try {
    const { userId } = await auth();
    let dbUser = null;

    if (userId) {
      dbUser = await db.user.findUnique({
        where: {
          clerkUserId: userId,
        },
      });
    }

    let where = {
      status: "AVAILABLE",
    };

    const safeSearch = typeof search === "string" ? search.trim() : "";

    if (safeSearch) {
      where.OR = [
        { make: { contains: safeSearch, mode: "insensitive" } },
        { model: { contains: safeSearch, mode: "insensitive" } },
        { description: { contains: safeSearch, mode: "insensitive" } },
      ];
    }

    if (make) where.make = { equals: make, mode: "insensitive" };
    if (bodyType) where.bodyType = { equals: bodyType, mode: "insensitive" };
    if (fuelType) where.fuelType = { equals: fuelType, mode: "insensitive" };
    if (transmission)
      where.transmission = { equals: transmission, mode: "insensitive" };

    where.price = {
      gte:
        typeof minPrice === "string"
          ? parseFloat(minPrice) || 0
          : minPrice || 0,
    };

    if (maxPrice && maxPrice < Number.MAX_SAFE_INTEGER) {
      where.price.lte = maxPrice;
    }

    const skip = (page - 1) * limit;

    let orderBy = {};
    switch (sortBy) {
      case "priceAsc":
        orderBy = { price: "asc" };
        break;
      case "priceDesc":
        orderBy = { price: "desc" };
        break;

      case "newest":

      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const totalCars = await db.car.count({
      where: where,
    });

    const cars = await db.car.findMany({
      where: where,
      take: limit,
      skip: skip,
      orderBy,
    });

    let featured = new Set();

    if (dbUser) {
      const savedCars = await db.userSavedCars.findMany({
        where: { userId: dbUser.id },
        select: { carId: true },
      });

      featured = new Set(savedCars.map((saved) => saved.carId));
    }

    const serializedCars = cars.map((car) =>
      serializedCarData(car, featured.has(car.id))
    );

    return {
      success: true,
      data: serializedCars,
      pagination: {
        total: totalCars,
        page,
        limit,
        pages: Math.ceil(totalCars / limit),
      },
    };
  } catch (error) {
     return {
      success: false,
      message: "Error toggling saved car: " + error.message,
    };
  }
}

export async function toggleSavedCars(carId) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "User not authenticated" };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const car = await db.car.findUnique({
      where: { id: carId },
    });
    if (!car) {
      return { success: false, message: "Car not found" };
    }

    const existingSave = await db.userSavedCars.findUnique({
      where: { userId_carId: { userId: user.id, carId } },
    });

    if (existingSave) {
      await db.userSavedCars.delete({
        where: { userId_carId: { userId: user.id, carId } },
      });
      revalidatePath("/saved-cars");
      return {
        success: true,
        saved: false,
        message: "Car removed from favourites",
      };
    }

    await db.userSavedCars.create({
      data: { userId: user.id, carId },
    });
    revalidatePath("/saved-cars");
    return {
      success: true,
      saved: true,
      message: "Car added to favourites",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error toggling saved car: " + error.message,
    };
  }
}


export async function getSavedCars() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const savedCars = await db.userSavedCars.findMany({
      where: {
        userId: user.id,
      },
      include: {
        car: true,
      },
      orderBy: {
        savedAt: "desc",
      },
    });
    const cars = savedCars.map((saved) => serializedCarData(saved.car));

    return {
      success: true,
      data: cars,
      message:"Fetch Successfully"
    };
  } catch (error) {
    console.log("Error fetching saved cars", error);
     return {
      success: false,
      message: "Error toggling saved car: " + error.message,
    };
  }
}

export async function getCarById(carId) {
  try {
    const { userId } = await auth();
    let dbUser = null;

    if (userId) {
      dbUser = await db.user.findUnique({
        where: {
          clerkUserId: userId,
        },
      });
    }
    const car = await db.car.findUnique({
      where: {
        id: carId,
      },
    });

    if (!car) {
      return {
        success: false,
        error: "Car not found !",
      };
    }
    let isWhishlisted = false;
    if (dbUser) {
      const savedCar = await db.userSavedCars.findUnique({
        where: {
          userId_carId: {
            userId: dbUser.id,
            carId,
          },
        },
      });
      isWhishlisted = !!savedCar;
    }
    const existingTestDrive = await db.testDriveBooking.findFirst({
      where: {
        carId,
        userId: dbUser?.id,
        status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    let userTestDrive = null;

    if (existingTestDrive) {
      userTestDrive = {
        id: existingTestDrive.id,
        status: existingTestDrive.status,
        bookingDate: existingTestDrive.bookingDate.toString(),
      };
    }
    const dealership = await db.dealerShipInfo.findFirst({
      include: {
        workingHours: true,
      },
    });

    return {
      success: true,
      data: {
        ...serializedCarData(car, isWhishlisted),
        testDriveInfo: {
          userTestDrive,
          dealership: dealership
            ? {
                ...dealership,
                createdAt: dealership.createdAt.toISOString(),
                updatedAt: dealership.updatedAt.toISOString(),
                workingHours: dealership.workingHours.map((hour) => ({
                  ...hour,
                  createdAt: hour.createdAt.toISOString(),
                  updatedAt: hour.updatedAt.toISOString(),
                })),
              }
            : null,
        },
      },
    };
  } catch (error) {
     return {
      success: false,
      message: "Error toggling saved car: " + error.message,
    };
  }
}
