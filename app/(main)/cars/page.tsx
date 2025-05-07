import { getCarFilters } from "@/actions/car-listing";
import React from "react";
import CarFilters from "./components/cars-filters";
import CarListing from "./components/car-listing";

export const metaData = {
  title: "Cars | Carsense",
  description: "Browse and search for your dream car",
};

const CarsPage = async () => {
  const filtersData = await getCarFilters();
  console.log("Filters Data",filtersData);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-6xl mb-4 gradient-title">Browse cars</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-80 flex shrink-0">
          {/* Filters */}
          <CarFilters filters={filtersData.data} />
        </div>
        <div>
          <CarListing />
        </div>
      </div>
    </div>
  );
};

export default CarsPage;
