import { useState } from 'react';
import { bookingApi } from '../services/api';

export default function BookingForm({ venueId }) {
  const [date, setDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    setError(null);

    try {
      setLoading(true);
      const slots = await bookingApi.checkAvailability(venueId, selectedDate);
      setAvailableSlots(slots);
    } catch (err) {
      setError('Failed to fetch available slots. Please try again.');
      console.error('Error checking availability:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotToggle = (startTime) => {
    setSelectedSlots(prev => {
      if (prev.includes(startTime)) {
        return prev.filter(slot => slot !== startTime);
      } else {
        return [...prev, startTime];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || selectedSlots.length === 0) {
      setError('Please select a date and at least one time slot');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await bookingApi.createBooking({
        venueId,
        date,
        timeSlots: selectedSlots
      });
      
      // Reset form
      setDate('');
      setSelectedSlots([]);
      setAvailableSlots([]);
      
      // Show success message or redirect
      alert('Booking created successfully!');
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      console.error('Error creating booking:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Select Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={handleDateChange}
          className="input"
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      {loading && <p className="text-gray-500">Loading available slots...</p>}

      {availableSlots.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Available Time Slots
          </label>
          <div className="grid grid-cols-3 gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot.startTime}
                type="button"
                onClick={() => handleSlotToggle(slot.startTime)}
                className={`btn ${selectedSlots.includes(slot.startTime) ? 'btn-primary' : 'btn-outline'}`}
              >
                {slot.startTime}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading || !date || selectedSlots.length === 0}
      >
        {loading ? 'Creating Booking...' : 'Create Booking'}
      </button>
    </form>
  );
}