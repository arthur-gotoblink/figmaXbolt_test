import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Car, FileText } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { useSettings } from '../SettingsContext';
import type { Booking } from '../../types/booking';

interface VehicleInfoProps {
  booking: Booking;
}

export function VehicleInfo({ booking }: VehicleInfoProps) {
  const { getTextSizeClasses } = useSettings();
  const textClasses = getTextSizeClasses();

  // Group vehicles by status for better display
  const getStatusGrouping = () => {
    const statusGroups: { [key: string]: { vehicle: any; item: any; }[] } = {};
    
    booking.vehicles.forEach((vehicle, index) => {
      const item = booking.items[index];
      const status = item?.status || 'pending';
      
      if (!statusGroups[status]) {
        statusGroups[status] = [];
      }
      
      statusGroups[status].push({ vehicle, item });
    });
    
    return statusGroups;
  };

  const statusGroups = getStatusGrouping();
  const statusOrder = ['pending', 'booked', 'allocated', 'collected', 'delivered', 'cancelled'];

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className={`${textClasses.base} flex items-center text-slate-900`}>
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3">
            <Car className="h-5 w-5 text-blue-600" />
          </div>
          Vehicle Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {statusOrder.map(status => {
          const items = statusGroups[status];
          if (!items || items.length === 0) return null;
          
          return (
            <div key={status} className="space-y-3">
              {items.length > 1 && (
                <div className="flex items-center space-x-2 mb-3">
                  <StatusBadge status={status} type="item" />
                  <span className={`${textClasses.small} text-slate-600`}>
                    {items.length} vehicle{items.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              
              {items.map(({ vehicle, item }) => {
                const serviceTotal = vehicle.services.reduce((total: number, service: any) => total + service.price, 0);
                
                return (
                  <div key={vehicle.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0">
                        <h4 className={`${textClasses.base} font-medium text-slate-900 mb-2`}>
                          {vehicle.make} {vehicle.model} ({vehicle.year})
                        </h4>
                        <div className="space-y-1">
                          <p className={`${textClasses.small} text-slate-600`}>
                            Plate: <span className="text-slate-900">{vehicle.plate}</span>
                          </p>
                          <p className={`${textClasses.small} text-slate-600`}>
                            Colour: <span className="text-slate-900">{vehicle.colour}</span>
                          </p>
                        </div>
                      </div>
                      {item && items.length === 1 && (
                        <StatusBadge 
                          status={item.status} 
                          type="item" 
                          className="ml-4 flex-shrink-0" 
                        />
                      )}
                    </div>
                    
                    {vehicle.notes && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <FileText className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className={`${textClasses.small} font-medium text-blue-900 mb-1`}>Notes</p>
                            <p className={`${textClasses.small} text-blue-800`}>{vehicle.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className={`${textClasses.small} flex justify-between items-center font-medium pt-2 border-t border-slate-300`}>
                      <span className="text-slate-700">Service Total:</span>
                      <span className="text-slate-900">${serviceTotal.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}