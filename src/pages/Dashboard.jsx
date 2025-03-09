import React, { useState } from 'react';

// Mock data for user bookings
const mockBookings = [
  {
    id: 1,
    fieldName: 'Basketball Court 1',
    date: '2024-01-15',
    time: '10:00 - 11:00',
    status: 'Confirmed',
  },
  {
    id: 2,
    fieldName: 'Tennis Court 1',
    date: '2024-01-16',
    time: '14:00 - 15:00',
    status: 'Confirmed',
  },
  {
    id: 3,
    fieldName: 'Badminton Court 2',
    date: '2024-01-18',
    time: '18:00 - 19:00',
    status: 'Pending',
  },
  {
    id: 4,
    fieldName: 'Volleyball Court',
    date: '2024-01-20',
    time: '16:00 - 17:00',
    status: 'Confirmed',
  },
];

const Dashboard = () => {
  const [bookings, setBookings] = useState(mockBookings);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') {
      return new Date(booking.date) >= new Date();
    } else {
      return new Date(booking.date) < new Date();
    }
  });

  // Handle booking cancellation
  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="text-center mb-6 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
          My Bookings
        </h1>
        <p className="mt-2 sm:mt-4 text-base sm:text-xl text-gray-400">
          Manage your indoor sports venue bookings.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-4 sm:mb-8">
        <nav className="-mb-px flex justify-around sm:justify-start sm:space-x-8">
          <button
            className={`${
              activeTab === 'upcoming'
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            } whitespace-nowrap py-2 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex-1 sm:flex-none text-center sm:text-left`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Bookings
          </button>
          <button
            className={`${
              activeTab === 'past'
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            } whitespace-nowrap py-2 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex-1 sm:flex-none text-center sm:text-left`}
            onClick={() => setActiveTab('past')}
          >
            Past Bookings
          </button>
        </nav>
      </div>

      {/* Bookings table */}
      <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        {filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Venue
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Time
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  {activeTab === 'upcoming' && (
                    <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-white">
                      {booking.fieldName}
                      {/* Mobile only date/time display */}
                      <div className="text-xs text-gray-400 mt-1 sm:hidden">
                        {booking.date}<br/>{booking.time}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300 hidden sm:table-cell">
                      {booking.date}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300 hidden sm:table-cell">
                      {booking.time}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'Confirmed' 
                          ? 'bg-green-900 text-green-200' 
                          : 'bg-yellow-900 text-yellow-200'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    {activeTab === 'upcoming' && (
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300">
                        <button 
                          className="text-red-400 hover:text-red-300 px-2 py-1 bg-red-900/30 rounded sm:bg-transparent sm:px-0 sm:py-0 sm:rounded-none"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-300">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-400">
              {activeTab === 'upcoming' 
                ? 'You don\'t have any upcoming bookings.' 
                : 'You don\'t have any past bookings.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;