"use server";

import { serializedCarData } from "@/lib/helper";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function bookTestDrive({
  carId,
  bookingDate,
  startTime,
  endTime,
  notes,
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to book a test drive",
      };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      return { success: false, error: "User not found in database" };
    }

    const car = await db.car.findUnique({
      where: {
        id: carId,
        status: "AVAILABLE",
      },
    });
    if (!car) {
      return { success: false, error: "Car not available for test drive" };
    }

    const existingBooking = await db.testDriveBooking.findFirst({
      where: {
        carId,
        bookingDate: new Date(bookingDate),
        startTime,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    if (existingBooking) {
      return {
        success: false,
        error: "This time slot is already booked. Please select another time",
      };
    }

    const booking = await db.testDriveBooking.create({
      data: {
        carId,
        userId: user.id,
        bookingDate: new Date(bookingDate),
        startTime,
        endTime,
        status: "PENDING",
        notes: notes || null,
      },
    });

    revalidatePath(`/test-drive/${carId}`);
    revalidatePath(`/cars/${carId}`);

    return { success: true, data: booking };
  } catch (error) {
    console.error("Error booking test drive", error);
    return {
      success: false,
      error: error?.message || "Failed to book test drive",
    };
  }
}

export async function getUserTestDrive() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to view your test drives",
      };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      return { success: false, error: "User not found in database" };
    }

    const bookings = await db.testDriveBooking.findMany({
      where: { userId: user.id },
      include: { car: true },
      orderBy: { bookingDate: "desc" },
    });

    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      carId: booking.carId,
      car: serializedCarData(booking.car),
      bookingDate: booking.bookingDate.toISOString(),
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      notes: booking.notes,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }));

    return { success: true, data: formattedBookings };
  } catch (error) {
    console.error("Error fetching test drive", error);
    return {
      success: false,
      error: error?.message || "Failed to fetch test drives",
    };
  }
}

export async function cancelTestDrive(bookingId) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to cancel a test drive",
      };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      return { success: false, error: "User not found in database" };
    }

    const booking = await db.testDriveBooking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    if (booking.userId !== user.id && user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized to cancel this booking" };
    }

    if (booking.status === "CANCELLED") {
      return { success: false, error: "Booking is already cancelled" };
    }

    if (booking.status === "COMPLETED") {
      return { success: false, error: "Cannot cancel a completed booking" };
    }

    await db.testDriveBooking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    revalidatePath("/reservations");
    revalidatePath("/admin/test-drives");

    return { success: true, message: "Test drive cancelled successfully" };
  } catch (error) {
    console.error("Error in canceling test drive", error);
    return {
      success: false,
      error: error?.message || "Failed to cancel test drive",
    };
  }
}
