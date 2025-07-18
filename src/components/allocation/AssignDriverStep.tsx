import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { User, CheckCircle, Search } from 'lucide-react';
import { useSettings } from '../SettingsContext';
import type { Driver } from '../../types/booking';

interface AssignDriverStepProps {
  drivers: Driver[];
  selectedDriver: string;
  onDriverSelection: (driverId: string) => void;
}

export function AssignDriverStep({ drivers, selectedDriver, onDriverSelection }: AssignDriverStepProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { getTextSizeClasses } = useSettings();
  const textClasses = getTextSizeClasses();

  const availableDrivers = drivers.filter(driver => driver.available);

  const filteredDrivers = availableDrivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {filteredDrivers.length === 0 ? (
          <div className="p-4 text-center text-slate-500">
            <p className={textClasses.small}>
              {searchTerm ? 'No drivers found matching your search.' : 'No available drivers.'}
            </p>
          </div>
        ) : (
          filteredDrivers.map((driver) => (
            <div
              key={driver.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all touch-manipulation ${
                selectedDriver === driver.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300 active:bg-slate-50'
              }`}
              onClick={() => onDriverSelection(driver.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className={`${textClasses.base} font-medium text-slate-900`}>
                    {driver.name}
                  </h4>
                  <p className={`${textClasses.small} text-green-600`}>
                    Available
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedDriver === driver.id ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                }`}>
                  {selectedDriver === driver.id && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}