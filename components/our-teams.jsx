"use client";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Star,
  Award,
} from "lucide-react";
import profile1 from "@/public/images/profile-1.jpg";
import profile2 from "@/public/images/profile-2.jpg";
import profile3 from "@/public/images/profile-3.jpg";
import Image from "next/image";

const OurTeamSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const teamMembers = [
    {
      id: 1,
      name: "Emily Rees",
      position: "Customer Advisor",
      email: "emily@vehica.com",
      phone: "(123) 345-6789",
      image: profile1,
      rating: 4.9,
      specialties: ["Luxury Cars", "Customer Service"],
    },
    {
      id: 2,
      name: "George Brown",
      position: "Customer Advisor",
      email: "george@vehica.com",
      phone: "(123) 345-6789",
      image: profile3,
      rating: 4.8,
      specialties: ["Sports Cars", "Finance"],
    },
    {
      id: 3,
      name: "Isabella Evans",
      position: "Customer Advisor",
      email: "isabella@vehica.com",
      phone: "(123) 345-6789",
      image: profile2,
      rating: 4.9,
      specialties: ["SUVs", "Trade-ins"],
    },
    {
      id: 4,
      name: "Michael Johnson",
      position: "Senior Advisor",
      email: "michael@vehica.com",
      phone: "(123) 345-6789",
      image: profile1,
      rating: 5.0,
      specialties: ["Commercial", "Fleet Sales"],
    },
  ];

  const features = [
    "Expert automotive consultation",
    "Personalized vehicle matching",
    "Comprehensive financing options",
    "Award-winning customer service",
    "Professional after-sales support",
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + teamMembers.length) % teamMembers.length
    );
  };

  const getVisibleMembers = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentSlide + i) % teamMembers.length;
      visible.push(teamMembers[index]);
    }
    return visible;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Left Content */}
        <div className="space-y-10 col-span-2 flex flex-col justify-center items-center text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-red-500/20 px-4 py-2 rounded-full">
              <Award className="w-5 h-5 text-red-400" />
              <span className="text-red-300 font-medium">Meet Our Experts</span>
            </div>

            <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
              Our Professional
              <span className="block text-red-400">Team</span>
            </h2>

            <p className="text-xl text-gray-300 leading-relaxed">
              Dedicated professionals committed to finding your perfect vehicle
              match with unparalleled expertise and service.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-red-300 mb-4">
              Why Choose Our Team?
            </h3>
            <div className=" flex justify-center items-center flex-wrap gap-x-10 gap-y-5">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300 text-lg">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">500+</div>
              <div className="text-gray-400">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">15+</div>
              <div className="text-gray-400">Years Experience</div>
            </div>
          </div>
        </div>
        <div className="relative col-span-3 flex flex-col justify-center items-center mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
            {getVisibleMembers().map((member, index) => (
              <div
                key={member.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-red-500/25 transition-all duration-500 transform hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={500}
                    height={80}
                    className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Contact buttons */}
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button className="bg-red-500 hover:bg-red-600 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110">
                      <Phone className="w-4 h-4 text-white" />
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110">
                      <Mail className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Rating badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-800">
                      {member.rating}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 text-gray-800">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-red-600 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-red-500 font-semibold mb-3">
                      {member.position}
                    </p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <a
                      href={`mailto:${member.email}`}
                      className="text-red-500 hover:text-red-600 font-medium transition-colors duration-300 flex items-center space-x-2 group/link"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="group-hover/link:underline">
                        {member.email}
                      </span>
                    </a>
                    <a
                      href={`tel:${member.phone}`}
                      className="text-gray-500 hover:text-gray-700 transition-colors duration-300 flex items-center space-x-2 group/link"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="group-hover/link:underline">
                        {member.phone}
                      </span>
                    </a>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center space-x-4 mt-12">
            <button
              onClick={prevSlide}
              className="group bg-white/10 hover:bg-red-600 backdrop-blur-sm text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </button>
            <button
              onClick={nextSlide}
              className="group bg-white/10 hover:bg-red-600 backdrop-blur-sm text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center space-x-2 mt-12">
            {teamMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-red-500 scale-125"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default OurTeamSection;
