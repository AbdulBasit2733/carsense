"use client";

import { getCars } from "@/actions/car-listing";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CarListingsLoading from "./car-listings-loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CarCard from "@/components/CarCard";
import { CarProps } from "@/types/types";

export interface Pagination {
  limit: number;
  page: number;
  pages: number;
  total: number;
}

export interface GetCarsResponse {
  success: boolean;
  data: CarProps[];
  pagination?: Pagination;
}



const CarListing = () => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  const search = searchParams.get("search") || "";
  const make = searchParams.get("make") || "";
  const bodyType = searchParams.get("bodyType") || "";
  const fuelType = searchParams.get("fuelType") || "";
  const transmission = searchParams.get("transmission") || "";
  const minPrice = parseInt(searchParams.get("minPrice") || "0");
  const maxPrice = parseInt(
    searchParams.get("maxPrice") || `${Number.MAX_SAFE_INTEGER}`
  );
  const sortBy = searchParams.get("sortBy") || "newest";
  const page = parseInt(searchParams.get("page") || "1");

  const {
    mutate,
    data: result,
    error,
    isPending,
  } = useMutation<GetCarsResponse, Error, void, unknown>({
    mutationFn: async () => {
      const res = await getCars({
        search,
        make,
        bodyType,
        fuelType,
        transmission,
        minPrice,
        maxPrice,
        sortBy,
        page,
        limit,
      });
      // Normalize the response to always have data and pagination
      if (res.success && res.data && res.pagination) {
        return res as GetCarsResponse;
      }
      return {
        success: false,
        data: [],
        pagination: { total: 0, page: 1, limit, pages: 1 },
      };
    },
  });

  useEffect(() => {
    mutate();
  }, [
    search,
    make,
    bodyType,
    fuelType,
    transmission,
    minPrice,
    maxPrice,
    sortBy,
    page,
  ]);

  if (isPending && !result) {
    return <CarListingsLoading />;
  }

  if (error || !result || !result.success) {
    return (
      <Alert variant={"destructive"}>
        <Info className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load cars, please try again later!
        </AlertDescription>
      </Alert>
    );
  }

  if (!result || !result?.data) {
    return null;
  }

  const { data: cars, pagination: rawPagination } = result;
  const pagination = rawPagination || { total: 0, page: 1, limit, pages: 1 };

  if (cars && cars.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Info className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">No cars found</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          We couldn't find any cars matching your search criteria. Try adjusting
          your filters or search term.
        </p>
        <Button variant="outline" asChild>
          <Link href="/cars">Clear all filters</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Showing{" "}
          <span className="font-medium">
            {(page - 1) * limit + 1}-{Math.min(page * limit, pagination.total)}
          </span>{" "}
          of <span className="font-medium">{pagination.total}</span> cars
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default CarListing;
