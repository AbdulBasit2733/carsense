"use client";
import { ChevronLeft, ChevronRight, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OurTeamsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const teamMembers = [
    {
      id: 1,
      name: "Emily Rees",
      position: "Customer Advisor",
      email: "emily@vehica.com",
      phone: "(123) 345-6789",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b2fd?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "George Brown",
      position: "Customer Advisor",
      email: "george@vehica.com",
      phone: "(123) 345-6789",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Isabella Evans",
      position: "Customer Advisor",
      email: "isabella@vehica.com",
      phone: "(123) 345-6789",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Michael Johnson",
      position: "Senior Advisor",
      email: "michael@vehica.com",
      phone: "(123) 345-6789",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
    }
  ];

  const features = [
    "Praesent nibh luctus viverra",
    "Adipiscing elit",
    "Tempor incididunt ut labore",
    "Quis ipsum suspendisseviverra",
    "Maecenas ac"
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
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
    <div className="bg-slate-800 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 grid-cols-1 gap-5 items-start">
          {/* Left Content */}
          <div className="space-y-8 col-span-1">
            <h2 className="text-5xl font-bold">Our Team</h2>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Team Cards with Animation */}
          <div className="relative col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {getVisibleMembers().map((member) => (
                  <div key={member.id} className="bg-white rounded-lg overflow-hidden shadow-lg w-full h-full">
                    <div className="relative">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button className="bg-orange-500 hover:bg-orange-600 p-2 rounded-md">
                          <Phone className="w-4 h-4 text-white" />
                        </button>
                        <button className="bg-orange-500 hover:bg-orange-600 p-2 rounded-md">
                          <Mail className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6 text-gray-800">
                      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                      <p className="text-gray-500 mb-4">{member.position}</p>
                      <div className="space-y-2">
                        <a href={`mailto:${member.email}`} className="text-orange-500 hover:text-orange-600 block">
                          {member.email}
                        </a>
                        <a href={`tel:${member.phone}`} className="text-gray-400 block">
                          {member.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex space-x-4 mt-8">
              <button
                onClick={prevSlide}
                className="bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeamsSection;
