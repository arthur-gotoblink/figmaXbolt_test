import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DollarSign } from 'lucide-react';
import { useSettings } from '../SettingsContext';
import { Booking } from '../../types/booking';

interface BookingSummaryProps {
  booking: Booking;
}

export function BookingSummary({ booking }: BookingSummaryProps) {
  const { getTextSizeClasses } = useSettings();
  const textClasses = getTextSizeClasses();

  const totalServiceCost = booking.vehicles.reduce((total, vehicle) => 
    total + vehicle.services.reduce((vehicleTotal, service) => vehicleTotal + service.price, 0), 0
  );

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className={`${textClasses.base} flex items-center text-slate-900`}>
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mr-3">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className={`${textClasses.small} text-slate-600`}>Total Vehicles:</span>
          <span className={`${textClasses.small} text-slate-900`}>{booking.vehicles.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`${textClasses.small} text-slate-600`}>Total Services:</span>
          <span className={`${textClasses.small} text-slate-900`}>${totalServiceCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-200">
          <span className={`${textClasses.base} font-medium text-slate-900`}>Total Value:</span>
          <span className={`${textClasses.base} font-medium text-slate-900`}>${totalServiceCost.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}