import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, Package, Filter, Plus, Truck } from 'lucide-react';
import { BookingCard } from './booking/BookingCard';
import { SettingsMenu } from './SettingsMenu';
import { NewBookingForm } from './NewBookingForm';
import { useSettings } from './SettingsContext';
import { Booking } from '../types/booking';

interface BookingListProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onBookingCreated: () => void;
  username: string;
  onLogout: () => void;
}

export function BookingList({ bookings, onSelectBooking, onBookingCreated, username, onLogout }: BookingListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showNewBookingForm, setShowNewBookingForm] = useState(false);
  const { getTextSizeClasses } = useSettings();
  const textClasses = getTextSizeClasses();

  const statusOptions = [
    { value: 'all', label: 'All Bookings', count: bookings.length },
    { value: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
    { value: 'booked', label: 'Confirmed', count: bookings.filter(b => b.status === 'booked').length },
    { value: 'allocated', label: 'Allocated', count: bookings.filter(b => b.status === 'allocated').length },
    { value: 'in progress', label: 'In Progress', count: bookings.filter(b => b.status === 'in progress').length },
    { value: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length }
  ];

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.reservationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.from.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.to.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleNewBookingClick = () => {
    setShowNewBookingForm(true);
  };

  const handleBookingCreated = () => {
    setShowNewBookingForm(false);
    onBookingCreated();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`${textClasses.heading} text-gray-900 font-bold`}>Transport Management</h1>
                <p className={`${textClasses.small} text-gray-500`}>Manage your bookings and allocations</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleNewBookingClick}
                className={`${textClasses.small} hidden sm:flex touch-manipulation bg-blue-600 hover:bg-blue-700 text-white`}
              >
                <Plus className="h-4 w-4 mr-1" />
                New Booking
              </Button>
              <SettingsMenu username={username} onLogout={onLogout} />
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Search and Filter Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className={`${textClasses.base} text-gray-900 font-semibold mb-4`}>Search & Filter</h2>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by booking ID, customer, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${textClasses.base} pl-10 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 touch-manipulation`}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStatus(option.value)}
                    className={`${textClasses.small} touch-manipulation ${
                      selectedStatus === option.value 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                        : 'text-gray-600 hover:text-gray-900 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    {option.label}
                    <Badge variant="secondary" className="ml-2 text-xs bg-gray-200 text-gray-700 rounded-full">
                      {option.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Bookings Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={`${textClasses.base} text-gray-900 font-semibold`}>
                Bookings ({filteredBookings.length})
              </h2>
            </div>
            
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-12 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className={`${textClasses.base} text-gray-900 mb-2`}>No bookings found</h3>
                  <p className={`${textClasses.small} text-gray-600`}>
                    {searchTerm || selectedStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria.' 
                      : 'Get started by creating your first booking.'}
                  </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onSelect={onSelectBooking}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <NewBookingForm
        isOpen={showNewBookingForm}
        onClose={() => setShowNewBookingForm(false)}
        onBookingCreated={handleBookingCreated}
      />
    </div>
  );
}