import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  // Mock data for popular venues
  const popularVenues = [
    { id: 1, name: 'Basketball Court 1', type: 'Basketball', image: '🏀' },
    { id: 2, name: 'Tennis Court 1', type: 'Tennis', image: '🎾' },
    { id: 3, name: 'Badminton Court 1', type: 'Badminton', image: '🏸' },
    { id: 4, name: 'Volleyball Court', type: 'Volleyball', image: '🏐' }
  ];

  // Mock data for features
  const features = [
    {
      title: 'Easy Booking',
      description: 'Book your favorite sports venue in just a few clicks',
      icon: '📱'
    },
    {
      title: 'Real-time Availability',
      description: 'Check venue availability instantly',
      icon: '⚡'
    },
    {
      title: 'Flexible Scheduling',
      description: 'Choose from various time slots that suit you',
      icon: '📅'
    },
    {
      title: 'Instant Confirmation',
      description: 'Receive immediate booking confirmation',
      icon: '✅'
    }
  ];

  // Mock testimonials
  const testimonials = [
    {
      id: 1,
      name: 'John Smith',
      role: 'Basketball Player',
      content: 'The booking process is incredibly smooth. I love how easy it is to find and reserve courts.',
      avatar: '👨'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Tennis Enthusiast',
      content: 'Great platform for booking sports venues. The real-time availability feature is a game-changer!',
      avatar: '👩'
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-6 bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-6 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Book Your</span>
                  <span className="block text-primary-600">Indoor Sports Venue</span>
                </h1>
                <p className="mt-3 text-sm text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Find and book the perfect indoor sports venue for your next game. Easy booking, instant confirmation, and flexible scheduling.
                </p>
                <div className="mt-5 sm:mt-8 flex justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/booking"
                      className="w-full flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 sm:px-8 sm:py-3 md:py-4 md:text-lg md:px-10"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Popular Venues Section */}
      <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white sm:text-4xl">
            Popular Venues
          </h2>
          <p className="mt-2 sm:mt-4 text-base sm:text-xl text-gray-400">
            Choose from our selection of premium indoor sports facilities
          </p>
        </div>

        <div className="mt-6 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {popularVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 sm:p-6 text-center">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">{venue.image}</div>
                <h3 className="text-sm sm:text-lg font-medium text-white">{venue.name}</h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-base text-gray-400">{venue.type}</p>
                <Link
                  to="/booking"
                  className="mt-2 sm:mt-4 inline-block text-primary-600 hover:text-primary-500 text-sm sm:text-base"
                >
                  Book Now →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white sm:text-4xl">
              Why Choose Us
            </h2>
            <p className="mt-2 sm:mt-4 text-base sm:text-xl text-gray-400">
              Everything you need to book your perfect sports venue
            </p>
          </div>

          <div className="mt-6 sm:mt-10 grid grid-cols-2 gap-4 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">{feature.icon}</div>
                <h3 className="text-sm sm:text-lg font-medium text-white">{feature.title}</h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-base text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="mt-2 sm:mt-4 text-base sm:text-xl text-gray-400">
            Don't just take our word for it
          </p>
        </div>

        <div className="mt-6 sm:mt-10 grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg"
            >
              <div className="flex items-center">
                <div className="text-3xl sm:text-4xl">{testimonial.avatar}</div>
                <div className="ml-3 sm:ml-4">
                  <h4 className="text-base sm:text-lg font-medium text-white">{testimonial.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-300">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white sm:text-4xl text-center lg:text-left">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary-600">Book your venue today.</span>
          </h2>
          <div className="mt-6 sm:mt-8 flex justify-center lg:justify-start lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/booking"
                className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;