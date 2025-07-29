import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User, CheckCircle, Search } from 'lucide-react';
import { useSettings } from '../SettingsContext';
import { Driver } from '../../types/booking';

interface AssignDriverStepProps {
  drivers: Driver[];
  loading?: boolean;
  selectedDriver: string;
  onDriverSelection: (driverId: string) => void;
}

export function AssignDriverStep({ drivers, loading = false, selectedDriver, onDriverSelection }: AssignDriverStepProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { getTextSizeClasses } = useSettings();
  const textClasses = getTextSizeClasses();

  const availableDrivers = drivers.filter(driver => driver.available);

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDriverInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <User className="h-5 w-5 text-blue-600" />
        <Label className={`${textClasses.base} text-slate-900`}>
          Assign Driver
        </Label>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Search driver name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`${textClasses.base} pl-10 h-12 border-slate-200 focus:border-blue-500 touch-manipulation`}
        />
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-slate-500">
            <p className={textClasses.small}>Loading drivers...</p>
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="p-4 text-center text-slate-500">
            <p className={textClasses.small}>
              {searchTerm ? 'No drivers found matching your search.' : 'No available drivers.'}
            </p>
          </div>
        ) : (
          filteredDrivers.map((driver) => {
            const isSelected = selectedDriver === driver.id;
            
            return (
              <div
                key={driver.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all touch-manipulation ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-200 bg-white hover:border-slate-300 active:bg-slate-50'
                }`}
                onClick={() => onDriverSelection(driver.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      {driver.image && (
                        <AvatarImage 
                          src={driver.image} 
                          alt={driver.name}
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                        {getDriverInitials(driver.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className={`${textClasses.base} font-medium text-slate-900`}>
                        {driver.name}
                      </h4>
                      <p className={`${textClasses.small} text-green-600`}>
                        Available
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}