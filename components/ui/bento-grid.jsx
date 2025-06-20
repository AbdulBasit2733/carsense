"use client"
import { toggleSavedCars } from "@/actions/car-listing";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const BentoGrid = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[200px] md:grid-cols-3 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  id,
  description,
  header,
  icon,
  price,
  year,
  transmission,
  fuelType,
  isLarge = false,
}) => {
  const handleSaveCar = async (carId) => {
    await toggleSavedCars(carId)
  };
  return (
    <div
      className={cn(
        "group/bento relative overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 transition duration-300 hover:scale-[1.02]",
        isLarge ? "row-span-2" : "row-span-1",
        className
      )}
    >
      {/* Car Image */}
      {typeof icon === "string" && (
        <Link href={`/cars/${id}`}>
          <div className="relative h-full w-full">
            <Image
              src={icon}
              alt={typeof title === "string" ? title : "Car image"}
              fill
              className="object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>
        </Link>
      )}

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
        {/* Top badges */}
        <div className="flex items-start justify-between">
          <div className="flex gap-2">
            {year && (
              <span className="rounded bg-orange-600 px-2 py-1 text-xs font-semibold">
                {year}
              </span>
            )}
            {transmission && (
              <span className="rounded bg-neutral-600/80 px-2 py-1 text-xs">
                {transmission}
              </span>
            )}
            {fuelType && (
              <span className="rounded bg-neutral-600/80 px-2 py-1 text-xs">
                {fuelType}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSaveCar(id)}
              className="rounded-full cursor-pointer bg-white/20 p-1.5 backdrop-blur-sm transition hover:bg-white/30"
            >
             <Heart className={`w-4 h-4`} />
            </button>
            <span className="flex items-center gap-1 text-sm">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              7
            </span>
          </div>
        </div>

        {/* Bottom content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
          {price && (
            <p className="text-2xl font-bold">${price.toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  );
};
