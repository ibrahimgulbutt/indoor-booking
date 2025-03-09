import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import AuthModals from '../components/AuthModals';
import PaymentModal from '../components/PaymentModal';
import BookingStatusIndicator from '../components/BookingStatusIndicator';
import VenueMediaModal from '../components/VenueMediaModal';
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
      const date = addDays(startDate, i);
      dates.push(date);
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
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="text-center mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
          Book Your Indoor Sports Venue
        </h1>
        <p className="mt-2 sm:mt-4 text-base sm:text-xl text-gray-400">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Left column - Calendar */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Select Date</h2>
            <div className="text-sm font-medium text-primary-400 bg-gray-700 px-3 py-1 rounded-full">
              {format(selectedDate, 'MMMM d, yyyy')}
            </div>
          </div>
          
          {/* Calendar navigation */}
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="text-base sm:text-lg font-semibold text-gray-300">
              {format(calendarMonth, 'MMMM yyyy')}
            </div>
            <button 
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Horizontal scrollable calendar for mobile */}
          <div className="sm:hidden overflow-x-auto pb-2 mb-3 hide-scrollbar">
            <div className="flex space-x-2 min-w-max">
              {calendarDates.slice(0, 14).map((date, index) => {
                const isToday = isSameDay(date, new Date());
                const isSelected = isSameDay(date, selectedDate);
                const dayName = format(date, 'EEE');
                const dayNumber = format(date, 'd');
                
                return (
                  <button
                    key={index}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg w-14 transition-all ${isSelected ? 'bg-primary-600 text-white scale-110' : isToday ? 'bg-gray-700 text-primary-300' : 'hover:bg-gray-700 text-gray-300'}`}
                    onClick={() => {
                      // Create a new Date object to avoid reference issues
                      const newSelectedDate = new Date(date);
                      setSelectedDate(newSelectedDate);
                      setCalendarMonth(newSelectedDate);
                    }}
                  >
                    <span className="text-xs font-medium mb-1">{dayName}</span>
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${isSelected ? 'bg-primary-500' : isToday ? 'border border-primary-400' : ''}`}>{dayNumber}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Calendar grid for larger screens */}
          <div className="hidden sm:block">
            {/* Calendar header */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={index} className="text-xs font-medium text-gray-400">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDates.map((date, index) => {
                const isToday = isSameDay(date, new Date());
                const isSelected = isSameDay(date, selectedDate);
                
                return (
                  <button
                    key={index}
                    className={`p-2 rounded-md text-center ${isSelected ? 'bg-primary-600 text-white' : isToday ? 'bg-gray-700 text-primary-300' : 'hover:bg-gray-700 text-gray-300'}`}
                    onClick={() => {
                      // Create a new Date object to avoid reference issues
                      const newSelectedDate = new Date(date);
                      setSelectedDate(newSelectedDate);
                      setCalendarMonth(newSelectedDate);
                    }}
                  >
                    <span className="text-sm">{format(date, 'd')}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Custom styles for hiding scrollbar */}
          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>

        {/* Middle column - Fields */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Select Field</h2>
          <div className="grid grid-cols-1 gap-3">
            {fields.map((field) => {
              const venue = venues.find(v => v.id === field.id);
              return (
                <div key={field.id} className="relative overflow-hidden rounded-lg group">
                  <button
                    className={`w-full p-4 text-left rounded-lg border transition-all duration-300 ${selectedField === field.id ? 'border-primary-500 bg-primary-900/50 shadow-lg shadow-primary-900/20' : 'border-gray-600 hover:bg-gray-700/70'}`}
                    onClick={() => setSelectedField(field.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-white text-base sm:text-lg">{field.name}</div>
                        <div className="text-xs sm:text-sm text-gray-400 mt-1">{field.type}</div>
                        <div className="flex items-center mt-2">
                          <span className="text-primary-400 font-semibold text-sm sm:text-base">{venue?.pricePerHour} PKR</span>
                          <span className="text-xs text-gray-500 ml-1">/hour</span>
                        </div>
                      </div>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${selectedField === field.id ? 'bg-primary-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                        {selectedField === field.id ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVenueMedia(venue);
                      setShowMediaModal(true);
                    }}
                    className="absolute right-3 bottom-3 p-2 text-white bg-primary-600 hover:bg-primary-700 rounded-full transition-all duration-300"
                    aria-label="View media"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {selectedField ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2 mt-4">
              {timeSlots.map((slot) => {
                const slotStatus = getSlotStatus(slot.id);
                
                return (
                  <button
                    key={slot.id}
                    className={`w-full p-2 sm:p-3 text-left rounded-md border relative ${
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
                      <div className="text-sm sm:text-base text-white">{slot.time}</div>
                      {slotStatus.booked && (
                        <BookingStatusIndicator status={slotStatus.status} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 px-4 bg-gray-700/50 rounded-lg flex flex-col items-center justify-center mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400">Please select a field first</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Summary */}
      {selectedSlots.length > 0 && (
        <div className="mt-6 sm:mt-8 bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Booking Summary</h2>
          <div className="space-y-3 sm:space-y-4">
            {selectedSlots.map((slot, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-700 rounded-md">
                <div className="mb-2 sm:mb-0">
                  <div className="font-medium text-white text-sm sm:text-base">{slot.fieldName}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{slot.date} | {slot.time}</div>
                </div>
                <div className="flex items-center justify-between sm:justify-end">
                  <div className="text-white text-sm sm:text-base sm:mr-4">PKR {slot.price}</div>
                  <button 
                    onClick={() => setSelectedSlots(selectedSlots.filter((_, i) => i !== index))}
                    className="text-red-400 hover:text-red-300 text-xs sm:text-sm px-2 py-1 bg-red-900/30 rounded sm:bg-transparent sm:px-0 sm:py-0 sm:rounded-none"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between pt-3 sm:pt-4 border-t border-gray-700">
              <div className="text-base sm:text-lg font-medium text-white">Total</div>
              <div className="text-base sm:text-lg font-medium text-white">
                PKR {calculateTotalAmount()}
              </div>
            </div>
            
            <button 
              onClick={handleBooking}
              className="w-full mt-3 sm:mt-4 bg-primary-600 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-primary-700 transition-colors text-sm sm:text-base flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
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

      {/* Venue Media Modal */}
      <VenueMediaModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        venue={selectedVenueMedia}
      />

      {/* Toast Container */}
      <Toaster position="top-center" />
    </div>
  );
};


export default BookingPage;