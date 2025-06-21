import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-950">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-gray-700">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href={"/"}>
        <div className="mt-6 text-blue-500 hover:text-blue-700 underline">Return Home</div>
      </Link>
    </div>
  );
};

export default NotFound;
