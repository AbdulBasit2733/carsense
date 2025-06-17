import { getUserTestDrive } from "@/actions/test-drive";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import ReservationsList from "./components/reservations-list";
import { Metadata } from "next";
import { BookingStatusProps, CarProps } from "@/types/types";

export const metadata: Metadata = {
  title: "My Reservations | Carsense",
  description: "Manage your test drive reservations",
};

export interface ReservationDataProps {
  id: string;
  bookingDate: string; // ISO date string
  startTime: string;
  endTime: string;
  notes: string | null;
  status: BookingStatusProps;
  carId: string;
  car: CarProps;
  user?: {
    name: string;
    email: string;
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface ReservationResultProps {
  success: boolean;
  data: ReservationDataProps[];
}

const Reservations = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect=/reservations");
  }
  const reservationsResult = await getUserTestDrive();

  const initialData: ReservationResultProps = {
    success: reservationsResult.success,
    data: reservationsResult.data ?? [],
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-6xl mb-6 gradient-title">Your Reservations</h1>
      <ReservationsList initialData={initialData} />
    </div>
  );
};

export default Reservations;
