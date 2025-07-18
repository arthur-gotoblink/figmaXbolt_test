import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Truck, MapPin, Calendar } from 'lucide-react';
import { useSettings } from '../SettingsContext';
import type { Booking } from '../../types/booking';

interface DeliveryInfoProps {
  booking: Booking;
}

export function DeliveryInfo({ booking }: DeliveryInfoProps) {
  const { getTextSizeClasses } = useSettings();
  const textClasses = getTextSizeClasses();

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className={`${textClasses.base} flex items-center text-slate-900`}>
          <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mr-3">
            <Truck className="h-5 w-5 text-orange-600" />
          </div>
          Delivery Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className={`${textClasses.small} font-medium text-slate-900 mb-1`}>Collection Point</p>
              <p className={`${textClasses.small} text-slate-700 mb-2`}>{booking.from.location}</p>
              {booking.collectionDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <p className={`${textClasses.small} text-slate-600`}>
                    {new Date(booking.collectionDate).toLocaleDateString()} at {new Date(booking.collectionDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className={`${textClasses.small} font-medium text-slate-900 mb-1`}>Delivery Point</p>
              <p className={`${textClasses.small} text-slate-700 mb-2`}>{booking.to.location}</p>
              {booking.deliveryDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <p className={`${textClasses.small} text-slate-600`}>
                    {new Date(booking.deliveryDate).toLocaleDateString()} at {new Date(booking.deliveryDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}