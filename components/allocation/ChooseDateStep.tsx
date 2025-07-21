import React from 'react';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { useSettings } from '../SettingsContext';

interface ChooseDateStepProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function ChooseDateStep({ selectedDate, onDateChange }: ChooseDateStepProps) {
  const { getTextSizeClasses } = useSettings();
  const textClasses = getTextSizeClasses();

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Format date as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      onDateChange(`${year}-${month}-${day}`);
    }
  };

  // Safely parse the selected date
  let selectedDateObj: Date | undefined;
  if (selectedDate) {
    try {
      selectedDateObj = new Date(selectedDate + 'T00:00:00');
      // Check if the date is valid
      if (isNaN(selectedDateObj.getTime())) {
        selectedDateObj = undefined;
      }
    } catch (error) {
      selectedDateObj = undefined;
    }
  }

  // Get today's date for minimum date validation
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-5 w-5 text-blue-600" />
        <Label className={`${textClasses.base} text-slate-900`}>
          Choose Allocation Date
        </Label>
      </div>
      
      <div className="space-y-4">
        {/* Calendar Component - Always Visible */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDateObj}
            onSelect={handleDateSelect}
            disabled={(date) => date < today}
            className="rounded-lg border border-slate-200 bg-white"
          />
        </div>
        
        {/* Selected Date Display */}
        {selectedDate && selectedDateObj && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className={`${textClasses.small} text-blue-800 text-center`}>
              📅 Selected date: {selectedDateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}

        {!selectedDate && (
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className={`${textClasses.small} text-slate-600 text-center`}>
              Please select a date from the calendar above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}