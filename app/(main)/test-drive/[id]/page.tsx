import { getCarById } from "@/actions/car-listing";
import { notFound } from "next/navigation";
import React from "react";
import TestDriveForm from "./components/test-drive-form";

export async function generateMetadata() {
  return {
    title: `Book Test Drive | Carsense`,
    description: `Schedule a test drive in few seconds`,
  };
}

//@ts-ignore
const TestDrivePage = async ({ params }) => {
  // console.log("params",params);
  const { id } = await params;
  // console.log("test drive car id",id);
  
  const result = await getCarById(id);
  if (!result.success) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-6xl mb-6 gradient-title">Book a test drive</h1>
      <TestDriveForm car={result.data} testDriveInfo={result.data.testDriveInfo}/>
    </div>
  );
};

export default TestDrivePage;
