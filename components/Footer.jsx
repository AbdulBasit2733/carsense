import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = ({ isAdminPage = false }) => {
  return (
    <footer className="bg-slate-100 text-slate-800 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Side: Logo + Nav Links */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Logo */}
            <div>
              <Link
                href={isAdminPage ? "/admin" : "/"}
                className="inline-flex items-center space-x-3"
              >
                <Image
                  src="/logos/logo.png"
                  alt="Carsense Logo"
                  width={160}
                  height={48}
                  className="h-12 w-auto object-contain"
                />
                {isAdminPage && (
                  <span className="text-xs text-slate-500 font-light tracking-wide">
                    Admin
                  </span>
                )}
              </Link>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base font-semibold text-slate-900 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/cars"
                    className="flex items-center text-slate-700 hover:text-red-500 transition"
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Cars
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reservations"
                    className="flex items-center text-slate-700 hover:text-red-500 transition"
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Reservations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/saved-cars"
                    className="flex items-center text-slate-700 hover:text-red-500 transition"
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Saved Cars
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Company Info */}
          <div className="lg:col-span-3">
            <h4 className="text-base font-semibold text-slate-900 mb-4">
              About Us
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              Award-winning, family-owned dealership of new and pre-owned
              vehicles with several locations across the city. Best prices and
              top customer service guaranteed.
            </p>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h4 className="text-base font-semibold text-slate-900 mb-4">
              Contact
            </h4>
            <div className="text-sm text-slate-700 space-y-2">
              <p>
                <span className="font-medium text-slate-900">(123)</span>{" "}
                <span className="text-red-500 font-semibold">456-78901</span>
              </p>
              <p>support@carsense.com</p>
              <p>West 12th Street</p>
              <p>New York, NY, USA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>&copy; 2021 Carsense. All rights reserved.</p>
          <Link
            href="#"
            className="hover:text-red-500 transition underline mt-2 md:mt-0"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
