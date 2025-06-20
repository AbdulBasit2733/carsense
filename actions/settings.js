"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getDealershipInfo() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

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
              { dayOfWeek: "MONDAY", openTime: "09:00", closeTime: "18:00", isOpen: true },
              { dayOfWeek: "TUESDAY", openTime: "09:00", closeTime: "18:00", isOpen: true },
              { dayOfWeek: "WEDNESDAY", openTime: "09:00", closeTime: "18:00", isOpen: true },
              { dayOfWeek: "THURSDAY", openTime: "09:00", closeTime: "18:00", isOpen: true },
              { dayOfWeek: "FRIDAY", openTime: "09:00", closeTime: "18:00", isOpen: true },
              { dayOfWeek: "SATURDAY", openTime: "10:00", closeTime: "16:00", isOpen: true },
              { dayOfWeek: "SUNDAY", openTime: "10:00", closeTime: "16:00", isOpen: false },
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
    console.error("Error fetching dealership info:", error);
    return { success: false, error: "Error fetching dealership info: " + error.message };
  }
}

export async function saveWorkingHours(workingHours) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized: Admin access is required" };
    }

    const dealership = await db.dealerShipInfo.findFirst();
    if (!dealership) {
      return { success: false, error: "Dealership info not found" };
    }

    await db.workingHour.deleteMany({
      where: { dealershipId: dealership.id },
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

    return { success: true };
  } catch (error) {
    console.error("Error saving working hours:", error);
    return { success: false, error: "Error saving working hours: " + error.message };
  }
}

export async function getUsers() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized: Admin access is required" };
    }

    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
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
    console.error("Error fetching users:", error);
    return { success: false, error: "Error fetching users: " + error.message };
  }
}

export async function updateUserRole(userId, role) {
  try {
    const { userId: adminId } = await auth();
    if (!adminId) {
      return { success: false, error: "Unauthorized" };
    }

    const admin = await db.user.findUnique({
      where: { clerkUserId: adminId },
    });

    if (!admin || admin.role !== "ADMIN") {
      return { success: false, error: "Unauthorized: Admin access required" };
    }

    await db.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/admin/settings");

    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "Error updating user role: " + error.message };
  }
}
