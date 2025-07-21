import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Package, MapPin, Calendar, Car, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { useSettings } from '../SettingsContext';
import { Booking } from '../../types/booking';

interface BookingCardProps {
  booking: Booking;
  onSelect: (booking: Booking) => void;
}

export function BookingCard({ booking, onSelect }: BookingCardProps) {
  const { getTextSizeClasses } = useSettings();
  const textClasses = getTextSizeClasses();

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-slate-200 bg-white touch-manipulation">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 min-w-0 flex-1">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg flex-shrink-0">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h3 className={`${textClasses.base} text-slate-900 truncate`}>{booking.reservationId}</h3>
              <p className={`${textClasses.small} text-slate-600 truncate`}>{booking.customer}</p>
            </div>
          </div>
          <StatusBadge status={booking.status} type="booking" className="flex-shrink-0" />
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-start space-x-3">
            <MapPin className="h-4 w-4 text-emerald-500 mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className={`${textClasses.small} text-slate-700 truncate`}>From: {booking.from.location}</p>
              {booking.collectionDate && (
                <p className={`${textClasses.small} text-slate-500 truncate`}>
                  {new Date(booking.collectionDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <MapPin className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className={`${textClasses.small} text-slate-700 truncate`}>To: {booking.to.location}</p>
              {booking.deliveryDate && (
                <p className={`${textClasses.small} text-slate-500 truncate`}>
                  {new Date(booking.deliveryDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Car className="h-4 w-4 text-slate-400 mt-1 flex-shrink-0" />
            <div className="min-w-0">
              <p className={`${textClasses.small} text-slate-700`}>
                {booking.items.length} vehicle{booking.items.length !== 1 ? 's' : ''}
              </p>
              <p className={`${textClasses.small} text-slate-500 truncate`}>
                {booking.vehicles.map(v => `${v.make} ${v.model}`).join(', ')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className={`${textClasses.small} text-slate-500`}>
              {booking.collectionDate ? new Date(booking.collectionDate).toLocaleDateString() : 'TBD'}
            </span>
          </div>
          <Button 
            onClick={() => onSelect(booking)}
            className={`${textClasses.small} bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 touch-manipulation`}
          >
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">View</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}