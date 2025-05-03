"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getDealerShipInfo() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error("User not found");

    let dealership = await db.dealerShipInfo.findFirst({
      include: {
        workingHours: {
          orderBy: {
            dayOfWeek: "asc",
          },
        },
      },
    });

    if (!dealership) {
      dealership = await db.dealerShipInfo.create({
        data: {
          workingHours: {
            create: [
              {
                dayOfWeek: "MONDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "TUESDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "WEDNESDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "THURSDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "FRIDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "SATURDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: false,
              },
              {
                dayOfWeek: "SUNDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: false,
              },
            ],
          },
        },
        include: {
          workingHours: {
            orderBy: {
              dayOfWeek: "asc",
            },
          },
        },
      });
    }
    return {
      success: true,
      data: {
        ...dealership,
        createdAt: dealership.createdAt.toISOString(),
        updatedAt: dealership.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    throw new Error("Error fetching dealership info" + error?.message);
  }
}

export async function saveWorkingHours(workingHours) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user || user.role !== "ADMIN")
      throw new Error("Unauthorized: Admin access is required");

    const dealership = await db.dealerShipInfo.findFirst();
    if (!dealership) {
      throw new Error("Dealership info not found");
    }

    await db.workingHour.deleteMany({
      where: {
        dealershipId: dealership.id,
      },
    });

    for (const hour of workingHours) {
      await db.workingHour.create({
        data: {
          dayOfWeek: hour.dayOfWeek,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isOpen: hour.isOpen,
          dealershipId: dealership.id,
        },
      });
    }
    revalidatePath("/admin/settings");
    revalidatePath("/");
  } catch (error) {
    throw new Error("Error saving working hours:" + error?.message);
  }
}

export async function getUsers() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user || user.role !== "ADMIN")
      throw new Error("Unauthorized: Admin access is required");
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    throw new Error("Error fetching users" + error?.message);
  }
}

export async function updateUserRole(userId, role) {
  try {
    const { userId:adminId } = await auth();
    if (!adminId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: {
        clerkUserId: adminId,
      },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized: Admin access required");
    }
    await db.user.update({
      where: {
        id: adminId,
      },
      data: {
        role,
      },
    });
    revalidatePath("/admin/settings");
    return {
      success: true,
    };
  } catch (error) {
    throw new Error("Error updating user role:" + error?.message);
  }
}
