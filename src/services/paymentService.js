import axios from 'axios';

// Pakistani Payment Gateway Service
export const paymentService = {
  // Initialize payment with JazzCash (popular Pakistani payment method)
  initializeJazzCashPayment: async (bookingDetails) => {
    try {
      // This would be replaced with actual JazzCash API integration
      // For now, we'll simulate the payment process
      const response = await axios.post('/api/payments/jazzcash/init', {
        amount: bookingDetails.totalAmount,
        bookingId: bookingDetails.id,
        customerPhone: bookingDetails.phoneNumber,
        customerEmail: bookingDetails.email,
        description: `Booking for ${bookingDetails.fieldName} on ${bookingDetails.date}`,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: 'Payment initialization failed' } };
    }
  },

  // Initialize payment with EasyPaisa (another popular Pakistani payment method)
  initializeEasyPaisaPayment: async (bookingDetails) => {
    try {
      // This would be replaced with actual EasyPaisa API integration
      const response = await axios.post('/api/payments/easypaisa/init', {
        amount: bookingDetails.totalAmount,
        bookingId: bookingDetails.id,
        customerPhone: bookingDetails.phoneNumber,
        customerEmail: bookingDetails.email,
        description: `Booking for ${bookingDetails.fieldName} on ${bookingDetails.date}`,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: 'Payment initialization failed' } };
    }
  },

  // Verify payment status
  verifyPayment: async (paymentId, paymentMethod) => {
    try {
      const response = await axios.get(`/api/payments/${paymentMethod}/verify/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: 'Payment verification failed' } };
    }
  },

  // Calculate advance payment amount (e.g., 20% of total)
  calculateAdvanceAmount: (totalAmount) => {
    const advancePercentage = 0.20; // 20% advance payment
    return Math.round(totalAmount * advancePercentage);
  },

  // Check if payment timeout has occurred (10 seconds for testing)
  checkPaymentTimeout: (paymentInitTime) => {
    const timeoutDuration = 10 * 1000; // 10 seconds in milliseconds
    const currentTime = new Date().getTime();
    return (currentTime - paymentInitTime) > timeoutDuration;
  }
};

// WhatsApp Messaging Service
export const whatsappService = {
  // Send booking confirmation via WhatsApp
  sendBookingConfirmation: async (bookingDetails) => {
    try {
      // This would be replaced with actual Twilio WhatsApp API integration
      const response = await axios.post('/api/whatsapp/send', {
        to: bookingDetails.phoneNumber,
        message: `Your booking for ${bookingDetails.fieldName} on ${bookingDetails.date} at ${bookingDetails.time} has been confirmed. Thank you for your booking!`,
      });
      return response.data;
    } catch (error) {
      console.error('WhatsApp message sending failed:', error);
      throw error.response?.data || { success: false, error: { message: 'WhatsApp message sending failed' } };
    }
  },

  // Send payment receipt via WhatsApp
  sendPaymentReceipt: async (bookingDetails, paymentDetails) => {
    try {
      const message = `
*PAYMENT RECEIPT*

Booking ID: ${bookingDetails.id}
Venue: ${bookingDetails.fieldName}
Date: ${bookingDetails.date}
Time: ${bookingDetails.time}

Amount Paid: PKR ${paymentDetails.amountPaid}
Payment Method: ${paymentDetails.method}
Payment Status: ${paymentDetails.status}

Thank you for your payment!
      `;

      const response = await axios.post('/api/whatsapp/send', {
        to: bookingDetails.phoneNumber,
        message: message,
      });
      return response.data;
    } catch (error) {
      console.error('WhatsApp receipt sending failed:', error);
      throw error.response?.data || { success: false, error: { message: 'WhatsApp receipt sending failed' } };
    }
  },

  // Send advance payment reminder via WhatsApp
  sendAdvancePaymentReminder: async (bookingDetails, advanceAmount) => {
    try {
      const message = `
*ADVANCE PAYMENT REMINDER*

Your booking for ${bookingDetails.fieldName} on ${bookingDetails.date} at ${bookingDetails.time} requires an advance payment of PKR ${advanceAmount}.

Please complete your payment within 10 seconds to confirm your booking.
      `;

      const response = await axios.post('/api/whatsapp/send', {
        to: bookingDetails.phoneNumber,
        message: message,
      });
      return response.data;
    } catch (error) {
      console.error('WhatsApp reminder sending failed:', error);
      throw error.response?.data || { success: false, error: { message: 'WhatsApp reminder sending failed' } };
    }
  },

  // Send booking cancellation due to payment timeout
  sendPaymentTimeoutNotification: async (bookingDetails) => {
    try {
      const message = `
*BOOKING CANCELLED*

Your booking for ${bookingDetails.fieldName} on ${bookingDetails.date} at ${bookingDetails.time} has been cancelled due to payment timeout.

Please try booking again.
      `;

      const response = await axios.post('/api/whatsapp/send', {
        to: bookingDetails.phoneNumber,
        message: message,
      });
      return response.data;
    } catch (error) {
      console.error('WhatsApp notification sending failed:', error);
      throw error.response?.data || { success: false, error: { message: 'WhatsApp notification sending failed' } };
    }
  },

  // Format admin WhatsApp number with country code
  formatAdminWhatsAppNumber: (number = '+923004264363') => {
    // Ensure the number starts with '+'
    if (!number.startsWith('+')) {
      return `+${number}`;
    }
    return number;
  },

  // Send notification to admin about new booking
  sendAdminBookingNotification: async (bookingDetails) => {
    try {
      const adminNumber = whatsappService.formatAdminWhatsAppNumber();
      
      const message = `
*NEW BOOKING ALERT*

Booking ID: ${bookingDetails.id}
Customer: ${bookingDetails.userName}
Phone: ${bookingDetails.phoneNumber}
Venue: ${bookingDetails.fieldName}
Date: ${bookingDetails.date}
Time: ${bookingDetails.time}
Status: ${bookingDetails.paymentStatus}
      `;

      const response = await axios.post('/api/whatsapp/send', {
        to: adminNumber,
        message: message,
      });
      return response.data;
    } catch (error) {
      console.error('Admin WhatsApp notification failed:', error);
      throw error.response?.data || { success: false, error: { message: 'Admin notification failed' } };
    }
  }
};