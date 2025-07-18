import React, { useState } from 'react';
import './styles/globals.css'; // tout en haut
import { Login } from './components/Login';
import { BookingList } from './components/BookingList';
import { BookingDetails } from './components/BookingDetails';
import { QuickAllocate } from './components/QuickAllocate';
import { JobReply } from './components/booking/JobReply';
import { SettingsProvider } from './components/SettingsContext';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import type { Booking, AllocationRequest, Service } from './types/booking';


type View = 'login' | 'bookings' | 'booking-details';

interface NegotiationData {
  collectionDate: string;
  collectionTime: string;
  deliveryDate: string;
  deliveryTime: string;
  vehicles: Array<{
    id: string;
    services: Service[];
  }>;
}

// Helper function to calculate booking status based on item statuses
function calculateBookingStatus(items: Array<{status: string}>, currentBookingStatus?: string): 'pending' | 'pending customer' | 'booked' | 'allocated' | 'in progress' | 'completed' | 'cancelled' | 'rejected' | 'invoiced' {
  const itemStatuses = items.map(item => item.status);
  
  if (itemStatuses.every(status => status === 'delivered')) {
    return 'completed';
  } else if (itemStatuses.some(status => ['collected', 'delivered'].includes(status))) {
    return 'in progress';
  } else if (itemStatuses.some(status => status === 'allocated')) {
    return 'allocated';
  } else if (itemStatuses.every(status => status === 'booked')) {
    return 'booked';
  } else if (itemStatuses.every(status => status === 'cancelled')) {
    return 'cancelled';
  }
  
  // For other cases, return current booking status if provided, otherwise default
  return (currentBookingStatus as any) || 'pending';
}


function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showQuickAllocate, setShowQuickAllocate] = useState(false);
  const [showJobReply, setShowJobReply] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      reservationId: 'RES-2025-001',
      customer: 'ACME Transport Co.',
      from: {
        location: 'Cairns, QLD, Australia'
      },
      to: {
        location: 'Brisbane, QLD, Australia'
      },
      collectionDate: '2025-07-12T09:00:00.000Z',
      deliveryDate: '2025-07-14T15:00:00.000Z',
      vehicles: [
        {
          id: 'v1',
          plate: 'QLD-390',
          make: 'Toyota',
          model: 'Camry',
          colour: 'Silver',
          year: 2023,
          notes: 'Vehicle requires careful handling due to recent paint work. Please ensure protective covers are used.',
          services: [
            { name: 'Standard Transport', price: 850.00 },
            { name: 'Insurance Coverage', price: 120.00 }
          ]
        }
      ],
      items: [
        { id: 'i1', vehicleId: 'v1', status: 'pending' }
      ],
      status: 'pending',
      comments: [
        {
          id: '1',
          user: 'System',
          message: 'Booking created automatically from customer portal',
          timestamp: '2025-07-09T12:47:18.000Z'
        },
        {
          id: '2',
          user: 'admin',
          message: 'Customer confirmation pending - awaiting final approval',
          timestamp: '2025-07-10T09:15:30.000Z'
        }
      ]
    },
    {
      id: '2',
      reservationId: 'RES-2025-002',
      customer: 'FastTrack Logistics',
      from: {
        location: 'Sydney, NSW, Australia'
      },
      to: {
        location: 'Melbourne, VIC, Australia'
      },
      collectionDate: '2025-07-13T08:00:00.000Z',
      deliveryDate: '2025-07-15T16:00:00.000Z',
      vehicles: [
        {
          id: 'v2',
          plate: 'NSW-456',
          make: 'Honda',
          model: 'Accord',
          colour: 'White',
          year: 2022,
          notes: 'Customer requested extra care for leather interior.',
          services: [
            { name: 'Express Transport', price: 1200.00 },
            { name: 'Premium Insurance', price: 180.00 },
            { name: 'Priority Handling', price: 95.00 }
          ]
        },
        {
          id: 'v3',
          plate: 'NSW-789',
          make: 'BMW',
          model: 'X5',
          colour: 'Black',
          year: 2024,
          services: [
            { name: 'Luxury Transport', price: 1500.00 },
            { name: 'Comprehensive Insurance', price: 220.00 }
          ]
        }
      ],
      items: [
        { id: 'i2', vehicleId: 'v2', status: 'booked' },
        { id: 'i3', vehicleId: 'v3', status: 'booked' }
      ],
      status: 'booked',
      comments: [
        {
          id: '3',
          user: 'Sales',
          message: 'Booking confirmed by customer - ready for allocation',
          timestamp: '2025-07-10T08:35:00.000Z'
        }
      ]
    },
    {
      id: '3',
      reservationId: 'RES-2025-003',
      customer: 'Regional Transport Services',
      from: {
        location: 'Perth, WA, Australia'
      },
      to: {
        location: 'Adelaide, SA, Australia'
      },
      collectionDate: '2025-07-11T10:00:00.000Z',
      deliveryDate: '2025-07-13T14:00:00.000Z',
      vehicles: [
        {
          id: 'v4',
          plate: 'WA-123',
          make: 'Ford',
          model: 'Territory',
          colour: 'Blue',
          year: 2023,
          notes: 'Check tire pressure before transport - customer reported low PSI.',
          services: [
            { name: 'Standard Transport', price: 950.00 },
            { name: 'Basic Insurance', price: 85.00 }
          ]
        }
      ],
      items: [
        { id: 'i4', vehicleId: 'v4', status: 'allocated' }
      ],
      status: 'allocated',
      comments: [
        {
          id: '4',
          user: 'Dispatch',
          message: 'Vehicle allocated to driver John Smith for July 12th',
          timestamp: '2025-07-10T14:30:00.000Z'
        }
      ]
    },
    {
      id: '4',
      reservationId: 'RES-2025-004',
      customer: 'Elite Auto Services',
      from: {
        location: 'Gold Coast, QLD, Australia'
      },
      to: {
        location: 'Sunshine Coast, QLD, Australia'
      },
      collectionDate: '2025-07-10T11:00:00.000Z',
      deliveryDate: '2025-07-10T17:00:00.000Z',
      vehicles: [
        {
          id: 'v5',
          plate: 'QLD-567',
          make: 'Mercedes-Benz',
          model: 'C-Class',
          colour: 'Silver',
          year: 2024,
          notes: 'High-value vehicle. Requires enclosed transport and security protocols.',
          services: [
            { name: 'Premium Transport', price: 1350.00 },
            { name: 'Full Coverage Insurance', price: 200.00 },
            { name: 'White Glove Service', price: 150.00 }
          ]
        }
      ],
      items: [
        { id: 'i5', vehicleId: 'v5', status: 'collected' }
      ],
      status: 'in progress',
      comments: [
        {
          id: '5',
          user: 'Driver',
          message: 'Vehicle collected successfully, en route to destination',
          timestamp: '2025-07-10T10:45:00.000Z'
        }
      ]
    },
    {
      id: '5',
      reservationId: 'RES-2025-005',
      customer: 'Metro Transport Solutions',
      from: {
        location: 'Darwin, NT, Australia'
      },
      to: {
        location: 'Alice Springs, NT, Australia'
      },
      collectionDate: '2025-07-14T07:30:00.000Z',
      deliveryDate: '2025-07-16T14:00:00.000Z',
      vehicles: [
        {
          id: 'v6',
          plate: 'NT-111',
          make: 'Holden',
          model: 'Commodore',
          colour: 'Red',
          year: 2021,
          notes: 'Minor scratch on passenger door - documented with photos.',
          services: [
            { name: 'Standard Transport', price: 1100.00 },
            { name: 'Basic Insurance', price: 90.00 }
          ]
        },
        {
          id: 'v7',
          plate: 'NT-222',
          make: 'Mazda',
          model: 'CX-5',
          colour: 'Blue',
          year: 2023,
          services: [
            { name: 'Standard Transport', price: 1100.00 },
            { name: 'Basic Insurance', price: 90.00 }
          ]
        },
        {
          id: 'v8',
          plate: 'NT-333',
          make: 'Nissan',
          model: 'Navara',
          colour: 'White',
          year: 2022,
          notes: 'Ute tray has some equipment - secure before transport.',
          services: [
            { name: 'Standard Transport', price: 1100.00 },
            { name: 'Basic Insurance', price: 90.00 }
          ]
        }
      ],
      items: [
        { id: 'i6', vehicleId: 'v6', status: 'allocated' },
        { id: 'i7', vehicleId: 'v7', status: 'collected' },
        { id: 'i8', vehicleId: 'v8', status: 'delivered' }
      ],
      status: 'in progress',
      comments: [
        {
          id: '6',
          user: 'Dispatch',
          message: 'Mixed status booking - one vehicle delivered, one collected, one allocated',
          timestamp: '2025-07-10T16:20:00.000Z'
        },
        {
          id: '7',
          user: 'Driver',
          message: 'Navara delivered successfully. Commodore and CX-5 still in transit.',
          timestamp: '2025-07-10T18:45:00.000Z'
        }
      ]
    }
  ]);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    setCurrentView('bookings');
    toast.success(`Welcome back, ${username}!`);
  };

  const handleLogout = () => {
    setCurrentUser('');
    setCurrentView('login');
    setSelectedBooking(null);
    toast.success('Logged out successfully');
  };

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setCurrentView('booking-details');
  };

  const handleBackToBookings = () => {
    setSelectedBooking(null);
    setCurrentView('bookings');
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
    // Update individual vehicle statuses
    setBookings(prev => prev.map(booking => {
      if (booking.id === allocation.bookingId) {
        const updatedItems = booking.items.map(item => 
          allocation.vehicleIds.includes(item.vehicleId) 
            ? { ...item, status: 'allocated' as const }
            : item
        );
        
        // Update booking status based on item statuses
        const newBookingStatus = calculateBookingStatus(updatedItems, booking.status);
        
        return {
          ...booking,
          items: updatedItems,
          status: newBookingStatus
        };
      }
      return booking;
    }));

    // Update selected booking if it's the same one
    if (selectedBooking && selectedBooking.id === allocation.bookingId) {
      setSelectedBooking(prev => {
        if (!prev) return null;
        const updatedItems = prev.items.map(item => 
          allocation.vehicleIds.includes(item.vehicleId) 
            ? { ...item, status: 'allocated' as const }
            : item
        );
        
        const newBookingStatus = calculateBookingStatus(updatedItems, prev.status);
        
        return {
          ...prev,
          items: updatedItems,
          status: newBookingStatus
        };
      });
    }

    setShowQuickAllocate(false);
  };

  const handleAcceptJob = (bookingId: string) => {
    const acceptComment = {
      id: Date.now().toString(),
      user: currentUser,
      message: 'Job accepted with current terms and conditions',
      timestamp: new Date().toISOString()
    };

    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { 
            ...booking, 
            status: 'booked',
            items: booking.items.map(item => ({ ...item, status: 'booked' as const })),
            comments: [...booking.comments, acceptComment]
          }
        : booking
    ));

    // Update selected booking if it's the same one
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking(prev => prev ? {
        ...prev,
        status: 'booked',
        items: prev.items.map(item => ({ ...item, status: 'booked' as const })),
        comments: [...prev.comments, acceptComment]
      } : null);
    }

    setShowJobReply(false);
    toast.success('Job accepted successfully!');
  };

  const handleRejectJob = (bookingId: string, reason: string) => {
    const rejectComment = {
      id: Date.now().toString(),
      user: currentUser,
      message: `Job rejected. Reason: ${reason}`,
      timestamp: new Date().toISOString()
    };

    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { 
            ...booking, 
            status: 'rejected',
            items: booking.items.map(item => ({ ...item, status: 'cancelled' as const })),
            comments: [...booking.comments, rejectComment]
          }
        : booking
    ));

    // Update selected booking if it's the same one
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking(prev => prev ? {
        ...prev,
        status: 'rejected',
        items: prev.items.map(item => ({ ...item, status: 'cancelled' as const })),
        comments: [...prev.comments, rejectComment]
      } : null);
    }

    setShowJobReply(false);
    toast.success('Job rejected successfully');
  };

  const handleNegotiateJob = (bookingId: string, negotiation: NegotiationData) => {
    const negotiationComment = {
      id: Date.now().toString(),
      user: currentUser,
      message: 'Negotiation sent to customer with updated terms and conditions',
      timestamp: new Date().toISOString()
    };

    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { 
            ...booking, 
            status: 'pending customer',
            collectionDate: negotiation.collectionDate ? new Date(negotiation.collectionDate + 'T' + (negotiation.collectionTime || '00:00')).toISOString() : booking.collectionDate,
            deliveryDate: negotiation.deliveryDate ? new Date(negotiation.deliveryDate + 'T' + (negotiation.deliveryTime || '00:00')).toISOString() : booking.deliveryDate,
            vehicles: booking.vehicles.map(vehicle => {
              const negotiatedVehicle = negotiation.vehicles.find(v => v.id === vehicle.id);
              return negotiatedVehicle ? { ...vehicle, services: negotiatedVehicle.services } : vehicle;
            }),
            comments: [...booking.comments, negotiationComment]
          }
        : booking
    ));

    // Update selected booking if it's the same one
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking(prev => prev ? {
        ...prev,
        status: 'pending customer',
        collectionDate: negotiation.collectionDate ? new Date(negotiation.collectionDate + 'T' + (negotiation.collectionTime || '00:00')).toISOString() : prev.collectionDate,
        deliveryDate: negotiation.deliveryDate ? new Date(negotiation.deliveryDate + 'T' + (negotiation.deliveryTime || '00:00')).toISOString() : prev.deliveryDate,
        vehicles: prev.vehicles.map(vehicle => {
          const negotiatedVehicle = negotiation.vehicles.find(v => v.id === vehicle.id);
          return negotiatedVehicle ? { ...vehicle, services: negotiatedVehicle.services } : vehicle;
        }),
        comments: [...prev.comments, negotiationComment]
      } : null);
    }

    setShowJobReply(false);
    toast.success('Negotiation sent to customer!');
  };

  const handleAddComment = (bookingId: string, comment: string) => {
    const newComment = {
      id: Date.now().toString(),
      user: currentUser,
      message: comment,
      timestamp: new Date().toISOString()
    };

    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, comments: [...booking.comments, newComment] }
        : booking
    ));

    // Update selected booking if it's the same one
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking(prev => prev ? {
        ...prev,
        comments: [...prev.comments, newComment]
      } : null);
    }

    toast.success('Comment added successfully!');
  };

  const handleEditComment = (bookingId: string, commentId: string, newMessage: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { 
            ...booking, 
            comments: booking.comments.map(comment => 
              comment.id === commentId 
                ? { ...comment, message: newMessage, timestamp: new Date().toISOString() }
                : comment
            )
          }
        : booking
    ));

    // Update selected booking if it's the same one
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking(prev => prev ? {
        ...prev,
        comments: prev.comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, message: newMessage, timestamp: new Date().toISOString() }
            : comment
        )
      } : null);
    }

    toast.success('Comment updated successfully!');
  };

  const handleRemoveComment = (bookingId: string, commentId: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { 
            ...booking, 
            comments: booking.comments.filter(comment => comment.id !== commentId)
          }
        : booking
    ));

    // Update selected booking if it's the same one
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking(prev => prev ? {
        ...prev,
        comments: prev.comments.filter(comment => comment.id !== commentId)
      } : null);
    }

    toast.success('Comment removed successfully!');
  };
  
  // return <div className="bg-red-500 text-white p-4">TEST TAILWIND</div>;
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