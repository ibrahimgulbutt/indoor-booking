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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
          My Bookings
        </h1>
        <p className="mt-4 text-xl text-gray-400">
          Manage your indoor sports venue bookings.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${
              activeTab === 'upcoming'
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Bookings
          </button>
          <button
            className={`${
              activeTab === 'past'
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Venue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  {activeTab === 'upcoming' && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {booking.fieldName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {booking.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {booking.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'Confirmed' 
                          ? 'bg-green-900 text-green-200' 
                          : 'bg-yellow-900 text-yellow-200'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    {activeTab === 'upcoming' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <button 
                          className="text-red-400 hover:text-red-300"
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