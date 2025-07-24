import React, { useEffect, useState } from 'react';
import { BookingList } from './BookingList';
import { Booking } from '../types/booking';

interface BookingPageProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  username: string;
  onLogout: () => void;
}

export function BookingPage({ bookings, onSelectBooking, username, onLogout }: BookingPageProps) {
  
  return (
    <BookingList 
      bookings={bookings}
      onSelectBooking={onSelectBooking}
      username={username}
      onLogout={onLogout}
    />
  );
}
