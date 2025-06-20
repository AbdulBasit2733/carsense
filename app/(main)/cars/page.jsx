import { getCarFilters } from "@/actions/car-listing";
import React from "react";
import CarFilters from "./components/cars-filters";
import CarListing from "./components/car-listing";
export const metadata = {
  title: "Cars | Carsense",
  description: "Browse and search for your dream car",
};


const CarsPage = async () => {
  const filtersData = await getCarFilters();

  if (!filtersData.success || !filtersData.data) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-6xl mb-4 gradient-title">Browse cars</h1>
        <div className="text-red-500">Failed to load car filters. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-6xl mb-4 gradient-title">Browse cars</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-80 flex shrink-0">
          {/* Filters */}
          <CarFilters filters={filtersData.success && filtersData.data} />
        </div>
        <div>
          <CarListing />
        </div>
      </div>
    </div>
  );
};

export default CarsPage;
