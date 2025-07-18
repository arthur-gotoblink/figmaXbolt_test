import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Package, MapPin, Calendar, Car, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { useSettings } from '../SettingsContext';
import type { Booking } from '../../types/booking';

interface BookingCardProps {
  booking: Booking;
  onSelect: (booking: Booking) => void;
}

export function BookingCard({ booking, onSelect }: BookingCardProps) {
  const { getTextSizeClasses } = useSettings();
  const textClasses = getTextSizeClasses();

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 bg-white touch-manipulation shadow-sm">
      <CardContent className="p-6">
        {/* Header with ID and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 min-w-0 flex-1">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg flex-shrink-0">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h3 className={`${textClasses.base} text-gray-900 font-semibold truncate`}>{booking.reservationId}</h3>
              <p className={`${textClasses.small} text-gray-600 truncate`}>{booking.customer}</p>
            </div>
          </div>
          <StatusBadge status={booking.status} type="booking" className="flex-shrink-0" />
        </div>

        {/* Route Information */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="min-w-0 flex-1">
              <p className={`${textClasses.small} text-gray-500 mb-1`}>From:</p>
              <p className={`${textClasses.small} text-gray-900 font-medium truncate`}>{booking.from.location}</p>
              {booking.collectionDate && (
                <p className={`${textClasses.small} text-gray-500 truncate`}>
                  {new Date(booking.collectionDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <div className="min-w-0 flex-1">
              <p className={`${textClasses.small} text-gray-500 mb-1`}>To:</p>
              <p className={`${textClasses.small} text-gray-900 font-medium truncate`}>{booking.to.location}</p>
              {booking.deliveryDate && (
                <p className={`${textClasses.small} text-gray-500 truncate`}>
                  {new Date(booking.deliveryDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <Car className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className={`${textClasses.small} text-gray-700 font-medium`}>
              {booking.items.length} vehicle{booking.items.length !== 1 ? 's' : ''}
            </p>
            <p className={`${textClasses.small} text-gray-500 truncate`}>
              {booking.vehicles.map(v => `${v.make} ${v.model}`).join(', ')}
            </p>
          </div>
        </div>

        {/* Footer with Date and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className={`${textClasses.small} text-gray-500`}>
              {booking.collectionDate ? new Date(booking.collectionDate).toLocaleDateString() : 'TBD'}
            </span>
          </div>
          <Button 
            onClick={() => onSelect(booking)}
            className={`${textClasses.small} bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 touch-manipulation`}
          >
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}