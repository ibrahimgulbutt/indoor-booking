import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import AuthModals from '../components/AuthModals';
import PaymentModal from '../components/PaymentModal';
import BookingStatusIndicator from '../components/BookingStatusIndicator';
import { toast, Toaster } from 'react-hot-toast';

const BookingPage = () => {
  // Mock venues data
  const mockVenues = [
    { 
      id: 1, 
      name: 'Basketball Court 1', 
      type: 'Basketball', 
      pricePerHour: 500,
      images: [
        '/images/basketball-court-1.jpg',
        '/images/basketball-court-2.jpg'
      ],
      videos: [
        '/videos/basketball-court-preview.mp4'
      ]
    },
    { 
      id: 2, 
      name: 'Tennis Court 1', 
      type: 'Tennis', 
      pricePerHour: 600,
      images: [
        '/images/tennis-court-1.jpg',
        '/images/tennis-court-2.jpg'
      ],
      videos: [
        '/videos/tennis-court-preview.mp4'
      ]
    },
    { 
      id: 3, 
      name: 'Badminton Court 1', 
      type: 'Badminton', 
      pricePerHour: 400,
      images: [
        '/images/badminton-court-1.jpg',
        '/images/badminton-court-2.jpg'
      ],
      videos: [
        '/videos/badminton-court-preview.mp4'
      ]
    },
    { 
      id: 4, 
      name: 'Volleyball Court', 
      type: 'Volleyball', 
      pricePerHour: 450,
      images: [
        '/images/volleyball-court-1.jpg',
        '/images/volleyball-court-2.jpg'
      ],
      videos: [
        '/videos/volleyball-court-preview.mp4'
      ]
    }
  ];

  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedVenueMedia, setSelectedVenueMedia] = useState(null);

  const [venues] = useState(mockVenues);
  const [loading] = useState(false);
  const [error] = useState(null);
  
  // Mock booked slots data
  const [bookedSlots, setBookedSlots] = useState([
    { fieldId: 1, date: format(new Date(), 'yyyy-MM-dd'), slotId: 2, status: 'confirmed' },
    { fieldId: 2, date: format(new Date(), 'yyyy-MM-dd'), slotId: 5, status: 'advance_paid' },
    { fieldId: 3, date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), slotId: 3, status: 'advance_pending' }
  ]);

  if (loading) return <div className="text-center py-8">Loading venues...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  // Transform venues data into fields format
  const fields = venues.map(venue => ({
    id: venue.id,
    name: venue.name,
    type: venue.type || 'Sports Venue'
  }));

  // Generate time slots from 8 AM to 8 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 8; i < 20; i++) {
      slots.push({
        id: i - 8,
        time: `${i}:00 - ${i + 1}:00`,
        hour: i,
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedField, setSelectedField] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const { currentUser } = useAuth();

  // Generate dates for the calendar (entire month)
  const generateCalendarDates = () => {
    const startDate = startOfWeek(calendarMonth, { weekStartsOn: 1 });
    const dates = [];
    
    // Generate 4 weeks of dates
    for (let i = 0; i < 28; i++) {
      dates.push(addDays(startDate, i));
    }
    
    return dates;
  };

  const calendarDates = generateCalendarDates();

  // Handle month navigation
  const handlePrevMonth = () => {
    setCalendarMonth(addDays(calendarMonth, -28));
  };

  const handleNextMonth = () => {
    setCalendarMonth(addDays(calendarMonth, 28));
  };

  // Handle slot selection
  const handleSlotSelect = (slotId) => {
    if (selectedField === null) {
      toast.error('Please select a field first');
      return;
    }
    
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    
    // Check if slot is already booked
    const isBooked = bookedSlots.some(
      slot => slot.fieldId === selectedField && 
              slot.date === selectedDateStr && 
              slot.slotId === slotId
    );
    
    if (isBooked) {
      toast.error('This slot is already booked');
      return;
    }

    // Check if slot is already selected
    const isSelected = selectedSlots.some(
      slot => slot.slotId === slotId && slot.fieldId === selectedField
    );

    if (isSelected) {
      // Remove slot if already selected
      setSelectedSlots(selectedSlots.filter(
        slot => !(slot.slotId === slotId && slot.fieldId === selectedField)
      ));
    } else {
      // Add slot if not selected
      const selectedVenue = venues.find(v => v.id === selectedField);
      setSelectedSlots([
        ...selectedSlots,
        {
          slotId,
          fieldId: selectedField,
          fieldName: fields.find(f => f.id === selectedField).name,
          time: timeSlots.find(t => t.id === slotId).time,
          date: selectedDateStr,
          price: selectedVenue.pricePerHour
        }
      ]);
    }
  };

  // Check if a slot is selected or booked
  const getSlotStatus = (slotId) => {
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    
    // Check if slot is booked
    const bookedSlot = bookedSlots.find(
      slot => slot.fieldId === selectedField && 
              slot.date === selectedDateStr && 
              slot.slotId === slotId
    );
    
    if (bookedSlot) {
      return { booked: true, status: bookedSlot.status };
    }
    
    // Check if slot is selected
    const isSelected = selectedSlots.some(
      slot => slot.slotId === slotId && slot.fieldId === selectedField
    );
    
    return { booked: false, selected: isSelected };
  };

  // Calculate total booking amount
  const calculateTotalAmount = () => {
    return selectedSlots.reduce((total, slot) => total + slot.price, 0);
  };
  
  // Handle booking submission
  const handleBooking = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (selectedSlots.length === 0) {
      toast.error('Please select at least one time slot');
      return;
    }
    
    // Create booking object
    const booking = {
      id: `booking-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.email.split('@')[0],
      slots: selectedSlots,
      totalAmount: calculateTotalAmount(),
      createdAt: new Date().toISOString(),
      fieldName: selectedSlots[0].fieldName,
      date: selectedSlots[0].date,
      time: selectedSlots.map(slot => slot.time).join(', ')
    };
    
    // Set current booking and show payment modal
    setCurrentBooking(booking);
    setShowPaymentModal(true);
  };
  
  // Handle payment completion
  const handlePaymentComplete = (paymentDetails) => {
    // Add booked slots with advance_paid status
    const newBookedSlots = [
      ...bookedSlots,
      ...selectedSlots.map(slot => ({
        fieldId: slot.fieldId,
        date: slot.date,
        slotId: slot.slotId,
        status: 'advance_paid'
      }))
    ];
    
    setBookedSlots(newBookedSlots);
    
    // Show success message
    setBookingSuccess(true);
    
    // Reset selections
    setTimeout(() => {
      setSelectedSlots([]);
      setBookingSuccess(false);
    }, 3000);
  };
  
  // Handle payment timeout
  const handlePaymentTimeout = () => {
    toast.error('Payment timed out. Please try again.');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
          Book Your Indoor Sports Venue
        </h1>
        <p className="mt-4 text-xl text-gray-400">
          Select your preferred date, venue, and time slots.
        </p>
      </div>

      {/* Booking success message */}
      {bookingSuccess && (
        <div className="mb-8 bg-green-900 border border-green-600 text-green-200 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Your booking has been confirmed.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Calendar */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-white">Select Date</h2>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              {/* Calendar navigation */}
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-700 rounded-md"
                >
                  <span className="text-gray-400">←</span>
                </button>
                <div className="text-lg font-semibold text-gray-300">
                  {format(calendarMonth, 'MMMM yyyy')}
                </div>
                <button 
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-700 rounded-md"
                >
                  <span className="text-gray-400">→</span>
                </button>
              </div>

              {/* Calendar header */}
              <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={index} className="text-sm font-medium text-gray-400">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className="h-64 overflow-y-auto">
                <div className="grid grid-cols-7 gap-1">
                  {calendarDates.map((date, index) => (
                    <button
                      key={index}
                      className={`p-2 rounded-md text-center ${
                        isSameDay(date, selectedDate)
                          ? 'bg-primary-600 text-white'
                          : 'hover:bg-gray-700 text-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedDate(date);
                        setCalendarMonth(date);
                      }}
                    >
                      <span className="text-sm">{format(date, 'd')}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="w-1/3 bg-gray-700 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-gray-300">
                {format(selectedDate, 'MMMM')}
              </h2>
              <div className="text-3xl font-bold text-primary-500 mt-2">
                {format(selectedDate, 'yyyy')}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2 text-white">Selected Date</h3>
            <div className="bg-gray-700 p-3 rounded-md text-gray-300">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </div>
          </div>
        </div>

        {/* Middle column - Fields */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-white">Select Field</h2>
          <div className="space-y-2">
            {fields.map((field) => (
              <div key={field.id} className="relative">
                <button
                  className={`w-full p-3 text-left rounded-md border ${
                    selectedField === field.id
                      ? 'border-primary-600 bg-primary-900 ring-2 ring-primary-600'
                      : 'border-gray-600 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedField(field.id)}
                >
                  <div className="font-medium text-white">{field.name}</div>
                  <div className="text-sm text-gray-400">{field.type}</div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const venue = venues.find(v => v.id === field.id);
                    setSelectedVenueMedia(venue);
                    setShowMediaModal(true);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Media Modal */}
          {showMediaModal && selectedVenueMedia && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h3 className="text-xl font-medium text-white">{selectedVenueMedia.name}</h3>
                  <button
                    onClick={() => {
                      setShowMediaModal(false);
                      setSelectedVenueMedia(null);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  {selectedVenueMedia.images && selectedVenueMedia.images.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Images</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedVenueMedia.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${selectedVenueMedia.name} - Image ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedVenueMedia.videos && selectedVenueMedia.videos.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Videos</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {selectedVenueMedia.videos.map((video, index) => (
                          <video
                            key={index}
                            src={video}
                            controls
                            className="w-full rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column - Time slots */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-white">Select Time Slot</h2>
          
          {selectedField ? (
            <div className="space-y-2">
              {timeSlots.map((slot) => {
                const slotStatus = getSlotStatus(slot.id);
                
                return (
                  <button
                    key={slot.id}
                    className={`w-full p-3 text-left rounded-md border relative ${
                      slotStatus.booked
                        ? 'border-gray-600 bg-gray-700 opacity-75 cursor-not-allowed'
                        : slotStatus.selected
                        ? 'border-primary-600 bg-primary-900 ring-2 ring-primary-600'
                        : 'border-gray-600 hover:bg-gray-700'
                    }`}
                    onClick={() => handleSlotSelect(slot.id)}
                    disabled={slotStatus.booked}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-white">{slot.time}</div>
                      {slotStatus.booked && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <BookingStatusIndicator status={slotStatus.status} size="sm" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              Please select a field first
            </div>
          )}
        </div>
      </div>

      {/* Selected slots summary */}
      {selectedSlots.length > 0 && (
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-white">Your Selected Slots</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Field
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {selectedSlots.map((slot, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {slot.fieldName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {slot.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {slot.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      PKR {slot.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button 
                        className="text-red-400 hover:text-red-300"
                        onClick={() => setSelectedSlots(selectedSlots.filter((_, i) => i !== index))}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div className="text-white">
              <span className="text-gray-400">Total Price:</span> 
              <span className="text-xl font-bold ml-2">PKR {calculateTotalAmount()}</span>
            </div>
            <button 
              className="btn btn-primary px-8 py-3"
              onClick={handleBooking}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModals 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        bookingDetails={currentBooking}
        onPaymentComplete={handlePaymentComplete}
        onPaymentTimeout={handlePaymentTimeout}
      />

      {/* Toast Container */}
      <Toaster position="top-center" />
    </div>
  );
};


export default BookingPage;