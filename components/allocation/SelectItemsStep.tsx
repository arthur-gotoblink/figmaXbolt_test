import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Car, CheckCircle, Search } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { useSettings } from '../SettingsContext';
import { Booking } from '../../types/booking';

interface SelectItemsStepProps {
  booking: Booking;
  selectedVehicles: string[];
  onVehicleSelection: (vehicleId: string, selected: boolean) => void;
}

export function SelectItemsStep({ booking, selectedVehicles, onVehicleSelection }: SelectItemsStepProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { getTextSizeClasses } = useSettings();
  const textClasses = getTextSizeClasses();

  const filteredVehicles = booking.vehicles.filter(vehicle => {
    const searchText = searchTerm.toLowerCase();
    return (
      vehicle.make.toLowerCase().includes(searchText) ||
      vehicle.model.toLowerCase().includes(searchText) ||
      vehicle.colour.toLowerCase().includes(searchText) ||
      vehicle.plate.toLowerCase().includes(searchText) ||
      vehicle.year.toString().includes(searchText) ||
      (vehicle.notes && vehicle.notes.toLowerCase().includes(searchText))
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Car className="h-5 w-5 text-blue-600" />
        <Label className={`${textClasses.base} text-slate-900`}>
          Select Items to Allocate
        </Label>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Search vehicle details (make, model, plate, year, color, notes)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`${textClasses.base} pl-10 h-12 border-slate-200 focus:border-blue-500 touch-manipulation`}
        />
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {filteredVehicles.length === 0 ? (
          <div className="p-4 text-center text-slate-500">
            <p className={textClasses.small}>
              {searchTerm ? 'No vehicles found matching your search.' : 'No vehicles available.'}
            </p>
          </div>
        ) : (
          filteredVehicles.map((vehicle, index) => {
            const item = booking.items.find(item => item.vehicleId === vehicle.id);
            const isSelected = selectedVehicles.includes(vehicle.id);
            // Only booked items can be allocated
            const canSelect = item?.status === 'booked';
            
            return (
              <div
                key={vehicle.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all touch-manipulation ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : canSelect 
                      ? 'border-slate-200 bg-white hover:border-slate-300 active:bg-slate-50' 
                      : 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => canSelect && onVehicleSelection(vehicle.id, !isSelected)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className={`${textClasses.base} font-medium text-slate-900 truncate`}>
                      {vehicle.make} {vehicle.model}
                    </h4>
                    <p className={`${textClasses.small} text-slate-600`}>
                      {vehicle.year} • {vehicle.colour}
                    </p>
                    <p className={`${textClasses.small} text-slate-500`}>
                      {vehicle.plate}
                    </p>
                    {vehicle.notes && (
                      <p className={`${textClasses.small} text-slate-500 mt-1 italic`}>
                        {vehicle.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {item && (
                      <StatusBadge status={item.status} type="item" />
                    )}
                    {canSelect && (
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                    )}
                  </div>
                </div>
                
                {!canSelect && item && (
                  <p className={`${textClasses.small} text-slate-500 mt-2`}>
                    {item.status === 'pending' && 'Booking must be confirmed before allocation'}
                    {item.status === 'allocated' && 'Already allocated'}
                    {item.status === 'collected' && 'Already collected'}
                    {item.status === 'delivered' && 'Already delivered'}
                    {item.status === 'cancelled' && 'Cancelled'}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}