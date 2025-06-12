import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.crackoffcampus.com';

export interface SlotAvailabilityParams {
  serviceId: string;
  date: string;
  time: string;
}

export interface BookingInfo {
  id: string;
  userId: string;
  service_id: string;
  service_name: string;
  date: string;
  time: string;
  cancelled: boolean;
}

/**
 * Check if a specific slot is available for booking
 * Uses the dedicated availability check endpoint for more accurate results
 * @param params - Service ID, date, and time to check
 * @returns Promise<boolean> - true if slot is available, false if already booked
 */
export const checkSlotAvailability = async (params: SlotAvailabilityParams): Promise<boolean> => {
  try {
    const { serviceId, date, time } = params;
    
    // Call the dedicated availability check endpoint for more accurate results
    const response = await axios.get(`${BACKEND_URL}/api/v1/session/booking/checkAvailability`, {
      params: {
        serviceId: serviceId,
        date: date,
        time: time
      }
    });

    if (response.data.success) {
      return response.data.available;
    }
    
    // If API call failed, return false for safety
    return false;
  } catch (error) {
    console.error('Error checking slot availability:', error);
    // Return false on error for safety - better to prevent booking than allow conflicts
    return false;
  }
};

/**
 * Get all booked slots for a service on a specific date
 * @param serviceId - Service ID to check
 * @param date - Date to check (YYYY-MM-DD format)
 * @returns Promise<string[]> - Array of booked time slots
 */
export const getBookedSlots = async (serviceId: string, date: string): Promise<string[]> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/v1/session/booking/bookingsForService`, {
      params: {
        service_id: serviceId,
        date: date
      }
    });

    if (response.data.success) {
      const bookings: BookingInfo[] = response.data.bookings;
      
      // Extract time slots from active (non-cancelled) bookings
      return bookings
        .filter(booking => !booking.cancelled)
        .map(booking => booking.time);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    return [];
  }
};
