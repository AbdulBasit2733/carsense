import { getCarById } from "@/actions/car-listing";
import NotFound from "@/app/not-found";
import React from "react";
import CarDetails from "./components/car-details";

export async function generateMetadata({
  params,
}: {
  params: {
    id: string | number;
  };
}) {
  const { id } = params;
  const result = await getCarById(id);
  if (!result.success) {
    return {
      title: "Car not found | Carsense",
      description: "The requested car could not be found",
    };
  }

  const car = result.data;
  return {
    title: `${car.year} ${car.make} ${car.model} | Carsense`,
    description: car.description.substring(0, 160),
    openGraph: {
      images: car.images?.[0] ? [car.images[0]] : [],
    },
  };
}

const CarPage = async ({ params }:{
  params:{
    id:string| number
  }
}) => {
  // console.log("carspage",params);

  const { id } = params;
  const result = await getCarById(id);
  if (!result.success) {
    NotFound();
  }
  return (
    <div className="container mx-auto px-4 py-12">
      <CarDetails car={result.data} testDriveInfo={result.data.testDriveInfo} />
    </div>
  );
};

export default CarPage;
