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
import React from "react";

const Home = async () => {
  const featuredCars = await getFeaturedCars();
  return (
    <div className="pt-20 flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 md:py-32 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        {/* Background overlay with car images */}
        <div className="absolute inset-0 opacity-90">
          <div className="absolute inset-0 bg-[url(/images/bg-1920.jpg)] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/90"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center px-4">
          <div className="mb-12">
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
          </div>

          {/* Search */}
          <div className="max-w-4xl mx-auto">
            <HomeSearch />
          </div>

          {/* Category Tabs */}
          {/* <div className="flex justify-center mt-8 space-x-8">
            <button className="text-orange-500 border-b-2 border-orange-500 pb-2 px-4 font-semibold">
              All
            </button>
            <button className="text-gray-400 hover:text-white pb-2 px-4 font-semibold transition-colors">
              New
            </button>
            <button className="text-gray-400 hover:text-white pb-2 px-4 font-semibold transition-colors">
              Used
            </button>
          </div> */}
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Cars</h2>
            <Button variant="ghost" className="flex items-center" asChild>
              <Link href="/cars">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Car grid with mixed layout like the image */}
          <BentoGrid className="max-w-7xl mx-auto">
            {featuredCars.map((item, i) => (
              <BentoGridItem
                key={item.id || i}
                title={`${item.make} ${item.model}`}
                price={item.price}
                year={item.year}
                transmission={item.transmission || "Automatic"}
                fuelType={item.fuelType || "Petrol"}
                icon={item.images?.[0]}
                isLarge={i === 0} // Make first item large like in your image
                className={cn(
                  i === 0
                    ? "md:col-span-2 md:row-span-2"
                    : "md:col-span-1 md:row-span-1"
                )}
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Browse By Make Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Browse By Make</h2>
            <Button variant="ghost" className="flex items-center" asChild>
              <Link href="/cars">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {carMakes.map((make) => (
              <Link
                key={make.name}
                href={`/cars?make=${make.name}`}
                className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition cursor-pointer"
              >
                <div className="h-16 w-auto mx-auto mb-2 relative">
                  <Image
                    src={make.image}
                    alt={make.name}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <h3 className="font-medium">{make.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <OurTeamsSection />
    </div>
  );
};

export default Home;
