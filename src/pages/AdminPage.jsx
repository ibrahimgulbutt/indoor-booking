import React, { useState, useEffect } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { FaUsers, FaMoneyBillWave, FaCalendarCheck, FaChartLine } from 'react-icons/fa';
import BookingStatusIndicator from '../components/BookingStatusIndicator';
import AdminControlPanel from '../components/AdminControlPanel';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for all bookings
const mockBookings = [
  {
    id: 1,
    userId: 'user123',
    userName: 'John Doe',
    phoneNumber: '+923001234567',
    fieldName: 'Basketball Court 1',
    date: '2024-01-15',
    time: '10:00 - 11:00',
    status: 'Confirmed',
    paymentStatus: 'Advance Paid',
    amount: 500,
    createdAt: '2024-01-10',
  },
  {
    id: 2,
    userId: 'user456',
    userName: 'Jane Smith',
    phoneNumber: '+923001234568',
    fieldName: 'Tennis Court 1',
    date: '2024-01-16',
    time: '14:00 - 15:00',
    status: 'Pending',
    paymentStatus: 'Advance Paid',
    amount: 600,
    createdAt: '2024-01-11',
  },
  {
    id: 3,
    userId: 'user789',
    userName: 'Mike Johnson',
    phoneNumber: '+923001234569',
    fieldName: 'Badminton Court 2',
    date: '2024-01-18',
    time: '18:00 - 19:00',
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    amount: 400,
    createdAt: '2024-01-12',
  },
  {
    id: 4,
    userId: 'user101',
    userName: 'Sarah Williams',
    phoneNumber: '+923001234570',
    fieldName: 'Basketball Court 1',
    date: '2024-01-20',
    time: '16:00 - 17:00',
    status: 'Confirmed',
    paymentStatus: 'Fully Paid',
    amount: 500,
    createdAt: '2024-01-13',
  },
  {
    id: 5,
    userId: 'user202',
    userName: 'David Brown',
    phoneNumber: '+923001234571',
    fieldName: 'Tennis Court 1',
    date: '2024-01-22',
    time: '09:00 - 10:00',
    status: 'Confirmed',
    paymentStatus: 'Advance Paid',
    amount: 600,
    createdAt: '2024-01-14',
  },
];

// Mock data for venues
const mockVenues = [
  { id: 1, name: 'Basketball Court 1', type: 'Basketball', bookings: 15, revenue: 7500 },
  { id: 2, name: 'Tennis Court 1', type: 'Tennis', bookings: 12, revenue: 7200 },
  { id: 3, name: 'Badminton Court 1', type: 'Badminton', bookings: 8, revenue: 3200 },
  { id: 4, name: 'Volleyball Court', type: 'Volleyball', bookings: 5, revenue: 2250 },
];

const AdminPage = () => {
  const [bookings, setBookings] = useState(mockBookings);
  const [venues] = useState(mockVenues);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');
  const [dateRange, setDateRange] = useState('month');
  const [peakHours, setPeakHours] = useState([]);

  // Cleanup function for charts
  useEffect(() => {
    return () => {
      // Destroy all chart instances when component unmounts
      const chartInstances = Object.values(ChartJS.instances);
      chartInstances.forEach(instance => instance.destroy());
    };
  }, []);

  // Calculate peak booking hours
  useEffect(() => {
    const hourCounts = {};
    bookings.forEach(booking => {
      const hour = parseInt(booking.time.split(':')[0]);
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const sortedHours = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour, count]) => ({
        hour: `${hour}:00`,
        count
      }));

    setPeakHours(sortedHours);
  }, [bookings]);

  // Calculate analytics data
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.amount, 0);
  const uniqueCustomers = [...new Set(bookings.map(b => b.userId))].length;

  // Filter bookings based on status and search query
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'all' || booking.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = 
      booking.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.fieldName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phoneNumber.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // Handle booking status update
  const handleStatusUpdate = (bookingId, newStatus) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ));

    // Send WhatsApp notification when booking is confirmed
    if (newStatus === 'Confirmed') {
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        // In a real app, this would call the WhatsApp service
        console.log(`Sending WhatsApp confirmation to ${booking.phoneNumber} for booking ${bookingId}`);
      }
    }
  };

  // Prepare data for revenue chart
  const prepareRevenueData = () => {
    const today = new Date();
    let dates = [];
    let data = [];

    if (dateRange === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(format(date, 'MMM dd'));
        
        // Sum revenue for this date
        const dayRevenue = bookings
          .filter(b => b.date === format(date, 'yyyy-MM-dd'))
          .reduce((sum, b) => sum + b.amount, 0);
        data.push(dayRevenue);
      }
    } else {
      // Current month
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);
      const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      dates = daysInMonth.map(date => format(date, 'dd'));
      data = daysInMonth.map(date => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        return bookings
          .filter(b => b.date === formattedDate)
          .reduce((sum, b) => sum + b.amount, 0);
      });
    }

    return { dates, data };
  };

  // Prepare data for venue popularity chart
  const prepareVenueData = () => {
    const venueNames = venues.map(v => v.name);
    const venueBookings = venues.map(v => v.bookings);
    const venueRevenue = venues.map(v => v.revenue);

    return { venueNames, venueBookings, venueRevenue };
  };

  // Prepare data for booking status chart
  const prepareStatusData = () => {
    const confirmed = bookings.filter(b => b.status === 'Confirmed').length;
    const pending = bookings.filter(b => b.status === 'Pending').length;
    const cancelled = bookings.filter(b => b.status === 'Cancelled').length;

    return {
      labels: ['Confirmed', 'Pending', 'Cancelled'],
      data: [confirmed, pending, cancelled],
      backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(234, 179, 8, 0.6)', 'rgba(239, 68, 68, 0.6)'],
    };
  };

  const revenueData = prepareRevenueData();
  const venueData = prepareVenueData();
  const statusData = prepareStatusData();

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="text-center mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
          Admin Dashboard
        </h1>
        <p className="mt-2 sm:mt-4 text-base sm:text-xl text-gray-400">
          Manage bookings and view business analytics
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-primary-900 text-primary-300">
              <FaCalendarCheck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-gray-400 text-xs sm:text-sm">Total Bookings</p>
              <p className="text-white text-lg sm:text-2xl font-bold">{totalBookings}</p>
            </div>
          </div>
          <div className="mt-1 sm:mt-2 text-xs text-gray-400">
            <span className="text-green-400">{confirmedBookings} confirmed</span>, {pendingBookings} pending
          </div>
        </div>

        <div className="bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-green-900 text-green-300">
              <FaMoneyBillWave className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-gray-400 text-xs sm:text-sm">Total Revenue</p>
              <p className="text-white text-lg sm:text-2xl font-bold">PKR {totalRevenue}</p>
            </div>
          </div>
          <div className="mt-1 sm:mt-2 text-xs text-gray-400">
            <span className="text-green-400">PKR {Math.round(totalRevenue / totalBookings)} avg</span> per booking
          </div>
        </div>

        <div className="bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-blue-900 text-blue-300">
              <FaUsers className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-gray-400 text-xs sm:text-sm">Customers</p>
              <p className="text-white text-lg sm:text-2xl font-bold">{uniqueCustomers}</p>
            </div>
          </div>
          <div className="mt-1 sm:mt-2 text-xs text-gray-400">
            <span className="text-blue-400">{(totalBookings / uniqueCustomers).toFixed(1)}</span> bookings per customer
          </div>
        </div>

        <div className="bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-purple-900 text-purple-300">
              <FaChartLine className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-gray-400 text-xs sm:text-sm">Conversion Rate</p>
              <p className="text-white text-lg sm:text-2xl font-bold">{Math.round((confirmedBookings / totalBookings) * 100)}%</p>
            </div>
          </div>
          <div className="mt-1 sm:mt-2 text-xs text-gray-400">
            <span className="text-purple-400">{confirmedBookings}</span> of {totalBookings} bookings confirmed
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-4 sm:mb-6">
        <nav className="-mb-px flex justify-between sm:justify-start sm:space-x-8 overflow-x-auto">
          <button
            className={`${activeTab === 'bookings' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'} whitespace-nowrap py-2 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm flex-1 sm:flex-none`}
            onClick={() => setActiveTab('bookings')}
          >
            <span className="block sm:hidden">Bookings</span>
            <span className="hidden sm:block">Bookings Management</span>
          </button>
          <button
            className={`${activeTab === 'analytics' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'} whitespace-nowrap py-2 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm flex-1 sm:flex-none`}
            onClick={() => setActiveTab('analytics')}
          >
            <span className="block sm:hidden">Analytics</span>
            <span className="hidden sm:block">Business Analytics</span>
          </button>
          <button
            className={`${activeTab === 'settings' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'} whitespace-nowrap py-2 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm flex-1 sm:flex-none`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="block sm:hidden">Settings</span>
            <span className="hidden sm:block">Settings & Controls</span>
          </button>
        </nav>
      </div>

      {activeTab === 'bookings' ? (
        <>
          {/* Filters and Search */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
            <div className="flex gap-3 sm:gap-4 items-center w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white rounded-md px-2 sm:px-3 py-1 sm:py-2 text-sm w-full sm:w-auto"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search by name, venue or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white rounded-md px-2 sm:px-3 py-1 sm:py-2 w-full text-sm"
              />
            </div>
          </div>

          {/* Bookings table */}
          <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Venue
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                      Date & Time
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                      Payment
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{booking.userName}</div>
                        <div className="text-xs sm:text-sm text-gray-400">{booking.phoneNumber}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300">
                        {booking.fieldName}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300 hidden sm:table-cell">
                        <div>{booking.date}</div>
                        <div className="text-gray-400">{booking.time}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300">
                        <BookingStatusIndicator status={booking.status} />
                        {/* Mobile only date display */}
                        <div className="text-xs text-gray-400 mt-1 sm:hidden">{booking.date}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300 hidden sm:table-cell">
                        <div>PKR {booking.amount}</div>
                        <div className="text-gray-400">{booking.paymentStatus}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(booking.id, 'Confirmed')}
                            className="text-green-400 hover:text-green-300 text-xs sm:text-sm px-2 py-1 sm:px-0 sm:py-0 bg-green-900/30 sm:bg-transparent rounded sm:rounded-none"
                            disabled={booking.status === 'Confirmed'}
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(booking.id, 'Cancelled')}
                            className="text-red-400 hover:text-red-300 text-xs sm:text-sm px-2 py-1 sm:px-0 sm:py-0 bg-red-900/30 sm:bg-transparent rounded sm:rounded-none"
                            disabled={booking.status === 'Cancelled'}
                          >
                            Cancel
                          </button>
                        </div>
                        {/* Mobile only payment display */}
                        <div className="text-xs text-gray-400 mt-1 sm:hidden">PKR {booking.amount}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : activeTab === 'analytics' ? (
        <>
          {/* Analytics View */}
          <div className="mb-6 flex justify-end">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setDateRange('week')}
                className={`px-4 py-2 text-sm font-medium ${dateRange === 'week' ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-300'} rounded-l-md`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setDateRange('month')}
                className={`px-4 py-2 text-sm font-medium ${dateRange === 'month' ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-300'} rounded-r-md`}
              >
                This Month
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="bg-gray-800 p-3 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-white mb-2 sm:mb-4">Revenue Trend</h3>
              <div className="h-60 sm:h-80">
                <Line
                  data={{
                    labels: revenueData.dates,
                    datasets: [
                      {
                        label: 'Revenue (PKR)',
                        data: revenueData.data,
                        borderColor: 'rgba(59, 130, 246, 0.8)',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        fill: true,
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: {
                          boxWidth: window.innerWidth < 768 ? 10 : 40,
                          font: {
                            size: window.innerWidth < 768 ? 10 : 12
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(75, 85, 99, 0.2)',
                        },
                        ticks: {
                          color: 'rgba(156, 163, 175, 1)',
                          font: {
                            size: window.innerWidth < 768 ? 8 : 12
                          }
                        },
                      },
                      x: {
                        grid: {
                          color: 'rgba(75, 85, 99, 0.2)',
                        },
                        ticks: {
                          color: 'rgba(156, 163, 175, 1)',
                          font: {
                            size: window.innerWidth < 768 ? 8 : 12
                          },
                          maxRotation: 45,
                          minRotation: 45
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        labels: {
                          color: 'rgba(156, 163, 175, 1)',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Booking Status Chart */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-white mb-4">Booking Status Distribution</h3>
              <div className="h-80 flex items-center justify-center">
                <Pie
                  data={{
                    labels: statusData.labels,
                    datasets: [
                      {
                        data: statusData.data,
                        backgroundColor: statusData.backgroundColor,
                        borderWidth: 1,
                        borderColor: '#374151',
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: 'rgba(156, 163, 175, 1)',
                          padding: 20,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Venue Popularity Chart */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md lg:col-span-2">
              <h3 className="text-lg font-medium text-white mb-4">Venue Performance</h3>
              <div className="h-80">
                <Bar
                  data={{
                    labels: venueData.venueNames,
                    datasets: [
                      {
                        label: 'Number of Bookings',
                        data: venueData.venueBookings,
                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1,
                      },
                      {
                        label: 'Revenue (PKR)',
                        data: venueData.venueRevenue,
                        backgroundColor: 'rgba(16, 185, 129, 0.6)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(75, 85, 99, 0.2)',
                        },
                        ticks: {
                          color: 'rgba(156, 163, 175, 1)',
                        },
                      },
                      x: {
                        grid: {
                          color: 'rgba(75, 85, 99, 0.2)',
                        },
                        ticks: {
                          color: 'rgba(156, 163, 175, 1)',
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        labels: {
                          color: 'rgba(156, 163, 175, 1)',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Settings & Controls Tab */
        <AdminControlPanel />
      )}
    </div>
  );
};

export default AdminPage;