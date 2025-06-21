import { getUserTestDrive } from "@/actions/test-drive";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import ReservationsList from "./components/reservations-list";

export const metadata = {
  title: "My Reservations | Carsense",
  description: "Manage your test drive reservations",
};

const Reservations = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect=/reservations");
  }
  const reservationsResult = await getUserTestDrive();

  const initialData = {
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
