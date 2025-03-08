import axios from 'axios';

// Create axios instance with base URL and default headers
const API = axios.create({
  baseURL: 'https://api.indoorbooking.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: 'Network error' } };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await API.post('/auth/login', credentials);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: 'Network error' } };
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await API.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: 'Network error' } };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
  },
};

// Booking services
export const bookingApi = {
  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      const response = await API.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: 'Network error' } };
    }
  },

  // Get user bookings
  getUserBookings: async (filters = {}) => {
    try {
      const response = await API.get('/bookings/user', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: 'Network error' } };
    }
  },

  // Get booking by ID
  getBookingById: async (id) => {
    try {
      const response = await API.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: 'Network error' } };
    }
  },

  // Cancel booking
  cancelBooking: async (id, reason) => {
    try {
      const response = await API.put(`/bookings/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: 'Network error' } };
    }
  },

  // Check venue availability
  checkAvailability: async (venueId, date) => {
    try {
      const response = await API.get(`/venues/${venueId}/availability`, {
        params: { date },
      });
      return response.data.data.timeSlots;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: 'Network error' } };
    }
  },
};

// Admin services
export const adminApi = {
  // Get all bookings (admin only)
  getAllBookings: async (filters = {}) => {
    try {
      const response = await API.get('/admin/bookings', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: 'Network error' } };
    }
  },

  // Update booking status (admin only)
  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await API.put(`/admin/bookings/${bookingId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: 'Network error' } };
    }
  },
};

// Venue services
export const venueApi = {
  // Get all venues with optional filters
  getAllVenues: async (filters = {}) => {
    try {
      const response = await API.get('/venues', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: 'Network error' } };
    }
  },

  // Get venue by ID
  getVenueById: async (id) => {
    try {
      const response = await API.get(`/venues/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: 'Network error' } };
    }
  },
};

export default API;