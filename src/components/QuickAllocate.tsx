import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { SelectItemsStep } from './allocation/SelectItemsStep';
import { ChooseDateStep } from './allocation/ChooseDateStep';
import { AssignDriverStep } from './allocation/AssignDriverStep';
import { useSettings } from './SettingsContext';
import type { Booking, Driver, AllocationRequest } from '../types/booking';

interface QuickAllocateProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onAllocate: (allocation: AllocationRequest) => void;
}

export function QuickAllocate({ isOpen, onClose, booking, onAllocate }: QuickAllocateProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [resultMessage, setResultMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isAllocating, setIsAllocating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [allocationResult, setAllocationResult] = useState<{ success: boolean; message: string; driverName: string } | null>(null);
  
  const { getTextSizeClasses } = useSettings();
  const textClasses = getTextSizeClasses();

  // Mock drivers data - expanded for better search testing
  const drivers: Driver[] = [
    { id: '1', name: 'John Smith', available: true },
    { id: '2', name: 'Sarah Johnson', available: true },
    { id: '3', name: 'Mike Wilson', available: true },
    { id: '4', name: 'Emma Davis', available: false },
    { id: '5', name: 'David Brown', available: true },
    { id: '6', name: 'Lisa Chen', available: true },
    { id: '7', name: 'Robert Taylor', available: true },
    { id: '8', name: 'Jennifer Martinez', available: true },
    { id: '9', name: 'Michael Anderson', available: true },
    { id: '10', name: 'Ashley Thompson', available: true },
    { id: '11', name: 'Christopher Lee', available: true },
    { id: '12', name: 'Amanda White', available: false },
  ];

  const handleVehicleSelection = (vehicleId: string, selected: boolean) => {
    if (selected) {
      setSelectedVehicles(prev => [...prev, vehicleId]);
    } else {
      setSelectedVehicles(prev => prev.filter(id => id !== vehicleId));
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleAllocate = async () => {
    if (booking && selectedVehicles.length > 0 && selectedDriver && selectedDate) {
      setIsAllocating(true);
      setResultMessage(null);

      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        onAllocate({
          bookingId: booking.id,
          vehicleIds: selectedVehicles,
          driverId: selectedDriver,
          date: selectedDate
        });

        const driverName = drivers.find(d => d.id === selectedDriver)?.name || 'Unknown';
        setAllocationResult({
          success: true,
          message: `Successfully allocated ${selectedVehicles.length} vehicle(s) to ${driverName} for ${new Date(selectedDate).toLocaleDateString()}`,
          driverName
        });
        setShowConfirmation(true);

      } catch (error) {
        setAllocationResult({
          success: false,
          message: 'Failed to allocate vehicles. Please try again.',
          driverName: ''
        });
        setShowConfirmation(true);
      } finally {
        setIsAllocating(false);
      }
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setAllocationResult(null);
    if (allocationResult?.success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedVehicles([]);
    setSelectedDate('');
    setSelectedDriver('');
    setResultMessage(null);
    setShowConfirmation(false);
    setAllocationResult(null);
    onClose();
  };

  const canProceedStep1 = selectedVehicles.length > 0;
  const canProceedStep2 = selectedDate !== '';
  const canProceedStep3 = selectedDriver !== '';

  if (!booking) return null;

  const stepTitles = ['Select Items', 'Choose Date', 'Assign Driver'];
  const progress = (currentStep / 3) * 100;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-4">
            <DialogTitle className={`${textClasses.heading} text-center`}>
              Quick Allocate
            </DialogTitle>
            <DialogDescription className={`${textClasses.base} text-center`}>
              {booking.reservationId}
            </DialogDescription>
            
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`${textClasses.small} text-slate-600`}>
                  Step {currentStep} of 3
                </span>
                <span className={`${textClasses.small} text-slate-600`}>
                  {stepTitles[currentStep - 1]}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Result Message */}
            {resultMessage && (
              <Alert className={resultMessage.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                {resultMessage.type === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={`${textClasses.base} ${resultMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {resultMessage.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Step Content */}
            {currentStep === 1 && (
              <SelectItemsStep
                booking={booking}
                selectedVehicles={selectedVehicles}
                onVehicleSelection={handleVehicleSelection}
              />
            )}

            {currentStep === 2 && (
              <ChooseDateStep
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            )}

            {currentStep === 3 && (
              <AssignDriverStep
                drivers={drivers}
                selectedDriver={selectedDriver}
                onDriverSelection={setSelectedDriver}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={currentStep === 1 ? handleClose : handleBack}
                className={`${textClasses.base} h-12 px-6 touch-manipulation`}
              >
                {currentStep === 1 ? 'Cancel' : (
                  <>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </>
                )}
              </Button>
              
              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !canProceedStep1) ||
                    (currentStep === 2 && !canProceedStep2)
                  }
                  className={`${textClasses.base} h-12 px-6 bg-blue-600 hover:bg-blue-700 touch-manipulation`}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleAllocate}
                  disabled={!canProceedStep3 || isAllocating}
                  className={`${textClasses.base} h-12 px-6 bg-green-600 hover:bg-green-700 touch-manipulation`}
                >
                  {isAllocating ? 'Allocating...' : 'Allocate'}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className={`${textClasses.heading} flex items-center gap-2`}>
              {allocationResult?.success ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Allocation Successful
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Allocation Failed
                </>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription className={`${textClasses.base} ${
              allocationResult?.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {allocationResult?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={handleConfirmationClose}
              className={`${textClasses.base} h-12 px-6 touch-manipulation ${
                allocationResult?.success 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {allocationResult?.success ? 'OK' : 'Try Again'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}