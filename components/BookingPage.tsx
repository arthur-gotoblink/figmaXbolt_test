import React, { useEffect, useState } from 'react';
import { BookingList } from './BookingList';
import { mockBookings } from '../src/mockBookings';
import { Booking } from '../types/booking';
import { useAuth } from '../src/lib/authToken';
import { formatRawBooking } from '../utils/formatBooking';

export function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const username = 'admin@example.com';
  const { token, clearToken } = useAuth();

  const onLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.reload();
  };

  useEffect(() => {
    if (!token) {
      console.warn('[BookingPage] No token, redirecting to login');
      clearToken();
      window.location.href = '/login';
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/bookings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          console.warn('[BookingPage] Unauthorized, clearing token');
          clearToken();
          window.location.href = '/login';
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiData = await response.json();
        console.log("API response:", apiData);
        console.log("== DEBUG BookingPage ==");
        console.log("Full API response:", apiData);
        console.log("apiData.data type:", typeof apiData.data);
        console.log("Is Array?", Array.isArray(apiData.data));
        console.log("Length:", apiData.data?.length);
        const rawBookings = apiData.bookings ?? [];
        const formattedBookings: Booking[] = rawBookings.map((raw, i) => {
          try {
            const formatted = formatRawBooking(raw);
            if (!formatted) console.warn("Formatted booking is empty", raw);
            return formatted;
          } catch (err) {
            console.error("Error formatting booking at index", i, err);
            return null;
          }
        }).filter(Boolean);


        console.log(formattedBookings);
        setBookings(formattedBookings);
      } catch (error) {
        console.error('Failed to fetch bookings, using mock data', error);
        setBookings(mockBookings);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) {
    return <div className="p-10 text-center text-gray-600">Loading bookings...</div>;
  }
  
  return (
    <BookingList 
      bookings={bookings} 
      onSelectBooking={(b) => console.log('Booking selected', b)}
      username={username}
      onLogout={onLogout}
    />
  );
}
