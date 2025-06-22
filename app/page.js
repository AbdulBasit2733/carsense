import { getFeaturedCars } from "@/actions/home";
import HomeSearch from "@/components/home-search";
import OurTeamsSection from "@/components/our-teams";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import { carMakes } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Home = async () => {
  const result = await getFeaturedCars();
  const featuredCars = result.success ? result.data : [];

  return (
    <div className="pt-20 flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 md:py-32 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 opacity-90">
          <div className="absolute inset-0 bg-[url(/images/bg-1920.jpg)] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/90"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-7xl lg:text-8xl mb-6 font-bold">
            <span className="text-white">Find Your </span>
            <span className="bg-gradient-to-r from-red-500 to-sky-500 bg-clip-text text-transparent">
              Perfect
            </span>
            <span className="text-white"> Car</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Advanced AI car search and test drive from thousands of vehicles
          </p>

          <div className="max-w-4xl mx-auto">
            <HomeSearch />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Cars</h2>

            <Link
              href="/cars"
              className="group inline-flex w-fit items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <span className="mr-2">View All</span>
              <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            {/**
             * 
             <Button variant="ghost" className="flex items-center" asChild>
             <Link href="/cars">
             View All <ChevronRight className="ml-1 h-4 w-4" />
             </Link>
             </Button>}
             */}
          </div>

          <BentoGrid className="max-w-7xl mx-auto">
            {featuredCars && featuredCars.length === 0 ? (
              <div className=" bg-gray-300 flex justify-center items-center py-20">
                <h1>No Cars Found</h1>
              </div>
            ) : (
              featuredCars.map((item, i) => (
                <BentoGridItem
                  id={item.id}
                  // saved={savedCars && savedCars.success && savedCars?.data[i].car.id}
                  key={item.id || i}
                  title={`${item.make} ${item.model}`}
                  price={item.price}
                  year={item.year}
                  featured={item.featured}
                  transmission={item.transmission || "Automatic"}
                  fuelType={item.fuelType || "Petrol"}
                  icon={item.images?.[0]}
                  isLarge={i === 0}
                  className={cn(
                    i === 0
                      ? "md:col-span-2 md:row-span-2"
                      : "md:col-span-1 md:row-span-1"
                  )}
                />
              ))
            )}
          </BentoGrid>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12 text-center md:text-left">
            <div className="mb-6 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Browse By Make
              </h2>
              <p className="text-lg text-gray-600 max-w-md">
                Discover your perfect vehicle from our extensive collection of
                premium car brands
              </p>
            </div>

            <Link
              href="/cars"
              className="group inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <span className="mr-2">View All Cars</span>
              <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Car Makes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {carMakes.map((make, index) => (
              <div
                key={make.name}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Card content */}
                <div className="relative p-6 text-center">
                  {/* Logo container */}
                  <div className="h-16 w-16 mx-auto mb-4 relative bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-red-50 transition-colors duration-300">
                    <img
                      src={make.image}
                      alt={make.name}
                      className="h-24 w-24 object-contain filter group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Brand name */}
                  <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-300 text-sm md:text-base">
                    {make.name}
                  </h3>

                  {/* Hover indicator */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-red-500 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-600">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-red-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-red-300 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
              <span className="text-sm font-medium">
                Trusted by thousands of car enthusiasts
              </span>
            </div>
          </div>
        </div>
      </section>
      <OurTeamsSection />
    </div>
  );
};

export default Home;
