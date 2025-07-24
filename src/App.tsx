import React, { useEffect, useState } from 'react';
import './styles/globals.css';
import { Login } from '../components/Login';
import { BookingList } from '../components/BookingList';
import { BookingDetails } from '../components/BookingDetails';
import { QuickAllocate } from '../components/QuickAllocate';
import { JobReply } from '../components/booking/JobReply';
import { SettingsProvider } from '../components/SettingsContext';
import { Toaster } from '../components/ui/sonner';
import type { Booking, AllocationRequest } from './types/booking';
import { mockBookings } from './mockBookings';
import { fetchAllBookings } from './api/blinkApi';
import { useAuth } from '../src/lib/authToken';
import { BookingPage } from '../components/BookingPage'; // adapte selon ton arb




function App() {
  const [currentView, setCurrentView] = useState<'login' | 'bookings' | 'booking-details'>('login');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showQuickAllocate, setShowQuickAllocate] = useState(false);
  const [showJobReply, setShowJobReply] = useState(false);
  const { token, setToken } = useAuth();



  useEffect(() => {
    const loadBookings = async () => {
      if (!token) return;

      try {
        const res = await fetchAllBookings(token);
        const data = res?.data || [];
        setBookings(data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setBookings(mockBookings); // fallback si erreur
      } finally {
        setLoadingBookings(false);
      }
    };
    loadBookings();
  }, [token]);

  const onLogin = (username: string, token: string) => {
    setCurrentUser(username);
    setToken(token);
    setCurrentView('bookings');
    console.log(token);
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
  if (currentView === 'bookings' && loadingBookings) {
    return <div className="p-10 text-center text-gray-500">Loading bookings...</div>;
  }


  return (
    <SettingsProvider>
      <div className="App">
        {currentView === 'login' && (
          <Login onLogin={onLogin} />
        )}
        {currentView === 'bookings' && (
          <BookingPage />
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