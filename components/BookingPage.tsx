import React, { useEffect, useState } from 'react';
import { BookingList } from './BookingList';
import { Booking } from '../types/booking';

interface BookingPageProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onBookingCreated: () => void;
  username: string;
  onLogout: () => void;
}

export function BookingPage({ bookings, onSelectBooking, onBookingCreated, username, onLogout }: BookingPageProps) {
  
  return (
    <BookingList 
      bookings={bookings}
      onSelectBooking={onSelectBooking}
      onBookingCreated={onBookingCreated}
      username={username}
      onLogout={onLogout}
    />
  );
}
