import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Indoor Booking</h3>
            <p className="text-gray-300">
              Book your indoor sports facilities with ease. Choose from a variety of venues and time slots.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-300 hover:text-white">
                  Book Now
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="text-gray-300">
              Email: info@indoorbooking.com<br />
              Phone: +1 (123) 456-7890<br />
              Address: 123 Sports Avenue, City
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-300">
            &copy; {new Date().getFullYear()} Indoor Booking. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;