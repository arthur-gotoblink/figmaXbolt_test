import React, { useState } from 'react';
import './styles/globals.css';
import { Login } from '../components/Login';
import { BookingList } from '../components/BookingList';
import { BookingDetails } from '../components/BookingDetails';
import { QuickAllocate } from '../components/QuickAllocate';
import { JobReply } from '../components/booking/JobReply';
import { SettingsProvider } from '../components/SettingsContext';
import { Toaster } from '../components/ui/sonner';
import type { Booking, AllocationRequest } from './types/booking';

// Mock data for testing
const mockBookings: Booking[] = [
  {
    id: '1',
    reservationId: 'RES-001',
    customer: 'John Smith',
    from: { location: 'London, UK' },
    to: { location: 'Manchester, UK' },
    collectionDate: '2024-01-15T10:00:00Z',
    deliveryDate: '2024-01-16T14:00:00Z',
    status: 'pending',
    items: [
      { id: '1', vehicleId: '1', status: 'pending' }
    ],
    vehicles: [
      {
        id: '1',
        plate: 'ABC123',
        make: 'BMW',
        model: 'X5',
        colour: 'Black',
        year: 2022,
        services: [
          { name: 'Transport', price: 500 }
        ]
      }
    ],
    comments: []
  },
  {
    id: '2',
    reservationId: 'RES-002',
    customer: 'Sarah Johnson',
    from: { location: 'Birmingham, UK' },
    to: { location: 'Liverpool, UK' },
    collectionDate: '2024-01-17T09:00:00Z',
    deliveryDate: '2024-01-18T16:00:00Z',
    status: 'booked',
    items: [
      { id: '2', vehicleId: '2', status: 'booked' }
    ],
    vehicles: [
      {
        id: '2',
        plate: 'XYZ789',
        make: 'Mercedes',
        model: 'C-Class',
        colour: 'White',
        year: 2021,
        services: [
          { name: 'Transport', price: 450 }
        ]
      }
    ],
    comments: []
  }
];

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'bookings' | 'booking-details'>('login');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [bookings] = useState<Booking[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showQuickAllocate, setShowQuickAllocate] = useState(false);
  const [showJobReply, setShowJobReply] = useState(false);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    setCurrentView('bookings');
  };

  const handleLogout = () => {
    setCurrentUser('');
    setCurrentView('login');
    setSelectedBooking(null);
  };

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setCurrentView('booking-details');
  };

  const handleBackToBookings = () => {
    setCurrentView('bookings');
    setSelectedBooking(null);
  };

  const handleQuickAllocate = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowQuickAllocate(true);
  };

  const handleReplyToJob = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowJobReply(true);
  };

  const handleAllocate = (allocation: AllocationRequest) => {
    console.log('Allocation:', allocation);
    setShowQuickAllocate(false);
  };

  const handleAcceptJob = (bookingId: string) => {
    console.log('Accept job:', bookingId);
    setShowJobReply(false);
  };

  const handleRejectJob = (bookingId: string, reason: string) => {
    console.log('Reject job:', bookingId, reason);
    setShowJobReply(false);
  };

  const handleNegotiateJob = (bookingId: string, negotiation: any) => {
    console.log('Negotiate job:', bookingId, negotiation);
    setShowJobReply(false);
  };

  const handleAddComment = (bookingId: string, comment: string) => {
    console.log('Add comment:', bookingId, comment);
  };

  const handleEditComment = (bookingId: string, commentId: string, newMessage: string) => {
    console.log('Edit comment:', bookingId, commentId, newMessage);
  };

  const handleRemoveComment = (bookingId: string, commentId: string) => {
    console.log('Remove comment:', bookingId, commentId);
  };

  return (
    <SettingsProvider>
      <div className="App">
        {currentView === 'login' && (
          <Login onLogin={handleLogin} />
        )}
        
        {currentView === 'bookings' && (
          <BookingList 
            bookings={bookings}
            onSelectBooking={handleSelectBooking}
            username={currentUser}
            onLogout={handleLogout}
          />
        )}
        
        {currentView === 'booking-details' && selectedBooking && (
          <BookingDetails 
            booking={selectedBooking}
            onBack={handleBackToBookings}
            onQuickAllocate={handleQuickAllocate}
            onReplyToJob={handleReplyToJob}
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
            onRemoveComment={handleRemoveComment}
            username={currentUser}
            onLogout={handleLogout}
          />
        )}

        <QuickAllocate
          isOpen={showQuickAllocate}
          onClose={() => setShowQuickAllocate(false)}
          booking={selectedBooking}
          onAllocate={handleAllocate}
        />

        <JobReply
          isOpen={showJobReply}
          onClose={() => setShowJobReply(false)}
          booking={selectedBooking}
          onAccept={handleAcceptJob}
          onReject={handleRejectJob}
          onNegotiate={handleNegotiateJob}
        />
        
        <Toaster />
      </div>
    </SettingsProvider>
  );
}

export default App;