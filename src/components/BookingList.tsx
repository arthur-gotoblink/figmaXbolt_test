import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Search, Package, Filter, Plus } from 'lucide-react';
import { BookingCard } from './booking/BookingCard';
import { SettingsMenu } from './SettingsMenu';
import { useSettings } from './SettingsContext';
import type { Booking } from '../types/booking';

interface BookingListProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  username: string;
  onLogout: () => void;
}

export function BookingList({ bookings, onSelectBooking, username, onLogout }: BookingListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`${textClasses.heading} text-slate-900`}>Transport Management</h1>
                <p className={`${textClasses.small} text-slate-600`}>Manage your bookings and allocations</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className={`${textClasses.small} hidden sm:flex touch-manipulation`}>
                <Plus className="h-4 w-4 mr-1" />
                New Booking
              </Button>
              <SettingsMenu username={username} onLogout={onLogout} />
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search and Filters */}
          <Card className="border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className={`${textClasses.base} text-slate-900`}>Search & Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search by booking ID, customer, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${textClasses.base} pl-10 border-slate-200 focus:border-blue-500 touch-manipulation`}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedStatus === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(option.value)}
                    className={`${textClasses.small} touch-manipulation ${
                      selectedStatus === option.value 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'text-slate-600 hover:text-slate-900 border-slate-200'
                    }`}
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    {option.label}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {option.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bookings List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={`${textClasses.base} text-slate-900`}>
                Bookings ({filteredBookings.length})
              </h2>
            </div>
            
            {filteredBookings.length === 0 ? (
              <Card className="border-slate-200 bg-white">
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className={`${textClasses.base} text-slate-900 mb-2`}>No bookings found</h3>
                  <p className={`${textClasses.small} text-slate-600`}>
                    {searchTerm || selectedStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria.' 
                      : 'Get started by creating your first booking.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}