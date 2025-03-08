import React, { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { whatsappService } from '../services/paymentService';
import { toast } from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, bookingDetails, onPaymentComplete }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidNumber, setIsValidNumber] = useState(false);

  // Calculate advance payment amount (20% of total)
  const advanceAmount = bookingDetails?.totalAmount 
    ? Math.round(bookingDetails.totalAmount * 0.20)
    : 0;

  // Handle phone number change with improved validation
  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
    // Enhanced validation for Pakistani numbers
    const pkNumberPattern = /^\+92[3456789]\d{9}$/;
    const isValid = value && pkNumberPattern.test(value);
    setIsValidNumber(isValid);
    
    if (!value) {
      setError('Phone number is required');
    } else if (!value.startsWith('+92')) {
      setError('Number must start with +92 (Pakistan)');
    } else if (!isValid) {
      setError('Please enter a valid Pakistani mobile number');
    } else {
      setError('');
    }
  };

  // Handle booking confirmation
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    
    if (!isValidNumber) {
      setError('Please enter a valid Pakistani phone number');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Update booking details with phone number
      const updatedBookingDetails = {
        ...bookingDetails,
        phoneNumber,
      };
      
      // Notify parent component about successful booking
      if (onPaymentComplete) {
        onPaymentComplete({
          phoneNumber,
          amountPaid: 0,
          status: 'advance_pending'
        });
      }
      
      // Close modal
      onClose();

      // Clear existing toasts
      toast.dismiss();
      
      // Show success toast
      toast.success('Booking request received!');
      
    } catch (err) {
      setError('Failed to confirm booking. Please try again.');
      console.error('Booking confirmation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-gray-800 border-gray-700 my-8">
        <div className="mt-3 max-h-[80vh] overflow-y-auto">
          <h3 className="text-lg font-medium text-white text-center sticky top-0 bg-gray-800 py-2 z-10">
            Confirm Your Booking
          </h3>
          
          <form onSubmit={handleConfirmBooking} className="mt-4">
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Your Phone Number (for WhatsApp notifications)
              </label>
              <PhoneInput
                international
                defaultCountry="PK"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                className={`bg-gray-700 text-white rounded-md w-full ${!isValidNumber && phoneNumber ? 'border-red-500' : 'border-gray-600'}`}
                required
                error={error}
                placeholder="Enter your WhatsApp number"
                numberInputProps={{
                  className: 'bg-gray-700 text-white w-full outline-none',
                  style: { backgroundColor: 'transparent' }
                }}
              />
              {error && (
                <p className="text-xs text-red-400 mt-1">{error}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Please enter your Pakistani WhatsApp number (+92XXXXXXXXXX)
              </p>
            </div>
            
            <div className="mt-6 p-4 bg-gray-700 rounded-md">
              <h4 className="text-white font-medium">Booking Summary</h4>
              <div className="mt-2 space-y-1 text-sm">
                {bookingDetails?.slots?.map((slot, index) => (
                  <div key={index} className="border-b border-gray-600 pb-2 mb-2 last:border-0">
                    <p className="text-gray-300">Venue: <span className="text-white">{slot.fieldName}</span></p>
                    <p className="text-gray-300">Date: <span className="text-white">{slot.date}</span></p>
                    <p className="text-gray-300">Time: <span className="text-white">{slot.time}</span></p>
                    <p className="text-gray-300">Price: <span className="text-white">PKR {slot.price}</span></p>
                  </div>
                ))}
                <div className="mt-4 pt-2 border-t border-gray-600">
                  <p className="text-gray-300">Total Amount: <span className="text-white">PKR {bookingDetails?.totalAmount || 0}</span></p>
                  <p className="text-gray-300">Minimum Advance (20%): <span className="text-white font-medium">PKR {advanceAmount}</span></p>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-900 text-red-200 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
                disabled={loading}
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;