"use client";

import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { CarIcon, Heart, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import { toggleSavedCars } from "@/actions/car-listing";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { CarProps } from "@/types/types";

const CarCard = ({ car }: { car: CarProps }) => {
  const [isSaved, setSaved] = useState(car.featured);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const { mutate: toggleSavedCar, isPending: isToggling } = useMutation({
    mutationFn: toggleSavedCars,
    onSuccess: (data) => {
      if (data.success) {
        setSaved(data.saved ?? false);
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update favourites");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Error toggling favourites");
    },
  });

  const handleToggleSaved = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error("Please sign in to save cars");
      router.push("/sign-in");
      return;
    }
    if (isToggling) return;

    toggleSavedCar(car.id);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition group py-0">
      <div className="relative h-48">
        {car.images && car.images.length > 0 ? (
          <Image
            src={car.images[0]}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <CarIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <Button
          onClick={handleToggleSaved}
          variant={"ghost"}
          size={"icon"}
          className={`absolute top-2 right-2 bg-white/90 rounded-full p-1.5 ${
            isSaved
              ? "text-red-500 hover:text-red-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {isToggling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className={isSaved ? "fill-current" : ""} size={24} />
          )}
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="flex flex-col mb-2">
          <h3 className="text-lg font-bold line-clamp-1">
            {car.make} {car.model}
          </h3>
          <span className="text-xl font-bold text-blue-600">
            Rs {car.price.toString()}
          </span>
        </div>
        <div className="text-gray-600 mb-2 flex items-center">
          <span>{car.year}</span>
          <span className="mx-2">.</span>
          <span>{car.transmission}</span>
          <span className="mx-2">.</span>
          <span>{car.fuelType}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          <Badge variant={"outline"} className="bg-gray-50">
            {car.bodyType}
          </Badge>
          <Badge variant={"outline"} className="bg-gray-50">
            {car.mileage.toLocaleString()}
          </Badge>
          <Badge variant={"outline"} className="bg-gray-50">
            {car.color}
          </Badge>
        </div>
        <div className="flex justify-between">
          <Button
            onClick={() => router.push(`/cars/${car.id}`)}
            className="flex-1"
          >
            View Car
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;
