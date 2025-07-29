import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
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
      
      {/* Driver Selection Dropdown */}
      <div className="space-y-2">
        <Label className={`${textClasses.small} text-slate-700`}>
          Select Driver
        </Label>
        <Select 
          value={selectedDriver} 
          onValueChange={onDriverSelection}
          disabled={loading || filteredDrivers.length === 0}
        >
          <SelectTrigger className={`${textClasses.base} h-12 border-slate-200 focus:border-blue-500 touch-manipulation`}>
            <SelectValue 
              placeholder={
                loading 
                  ? "Loading drivers..." 
                  : filteredDrivers.length === 0 
                    ? (searchTerm ? "No drivers found matching your search" : "No available drivers")
                    : "Choose a driver..."
              } 
            />
          </SelectTrigger>
          <SelectContent>
            {filteredDrivers.map((driver) => (
              <SelectItem key={driver.id} value={driver.id}>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{driver.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Selected Driver Display */}
      {selectedDriver && !loading && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <div>
              <p className={`${textClasses.base} font-medium text-blue-900`}>
                Selected Driver
              </p>
              <p className={`${textClasses.small} text-blue-700`}>
                {filteredDrivers.find(d => d.id === selectedDriver)?.name || 'Unknown Driver'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}