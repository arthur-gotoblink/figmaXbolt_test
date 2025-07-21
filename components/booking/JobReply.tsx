import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle, XCircle, MessageSquare, Calendar, Trash2, Plus } from 'lucide-react';
import { useSettings } from '../SettingsContext';
import { Booking, Service } from '../../types/booking';

interface JobReplyProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onAccept: (bookingId: string) => void;
  onReject: (bookingId: string, reason: string) => void;
  onNegotiate: (bookingId: string, negotiation: NegotiationData) => void;
}

interface NegotiationData {
  collectionDate: string;
  collectionTime: string;
  deliveryDate: string;
  deliveryTime: string;
  vehicles: Array<{
    id: string;
    services: Service[];
  }>;
}

export function JobReply({ isOpen, onClose, booking, onAccept, onReject, onNegotiate }: JobReplyProps) {
  const [step, setStep] = useState<'options' | 'accept' | 'reject' | 'negotiate'>('options');
  const [rejectReason, setRejectReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState<'accept' | 'reject' | 'negotiate'>('accept');
  
  // Helper function to initialize negotiation data from booking
  const initializeNegotiationData = (bookingData: Booking | null): NegotiationData => {
    return {
      collectionDate: bookingData?.collectionDate ? bookingData.collectionDate.split('T')[0] : '',
      collectionTime: bookingData?.collectionDate ? bookingData.collectionDate.split('T')[1]?.substring(0, 5) || '' : '',
      deliveryDate: bookingData?.deliveryDate ? bookingData.deliveryDate.split('T')[0] : '',
      deliveryTime: bookingData?.deliveryDate ? bookingData.deliveryDate.split('T')[1]?.substring(0, 5) || '' : '',
      vehicles: bookingData?.vehicles.map(v => ({ id: v.id, services: [...v.services] })) || []
    };
  };

  // Negotiation state
  const [negotiationData, setNegotiationData] = useState<NegotiationData>(() => 
    initializeNegotiationData(booking)
  );

  const { getTextSizeClasses } = useSettings();
  const textClasses = getTextSizeClasses();

  // Update negotiation data when booking changes or modal opens
  useEffect(() => {
    if (booking && isOpen) {
      setNegotiationData(initializeNegotiationData(booking));
    }
  }, [booking, isOpen]);

  const predefinedReasons = [
    'Vehicle not available on requested dates',
    'Route not covered',
    'Insufficient notice period',
    'Pricing not acceptable',
    'Capacity constraints',
    'Other'
  ];

  const handleClose = () => {
    setStep('options');
    setRejectReason('');
    setShowConfirmation(false);
    // Reset negotiation data when closing
    if (booking) {
      setNegotiationData(initializeNegotiationData(booking));
    }
    onClose();
  };

  const handleAccept = () => {
    setConfirmationType('accept');
    setShowConfirmation(true);
  };

  const handleReject = () => {
    if (rejectReason) {
      setConfirmationType('reject');
      setShowConfirmation(true);
    }
  };

  const handleNegotiate = () => {
    setConfirmationType('negotiate');
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (!booking) return;

    switch (confirmationType) {
      case 'accept':
        onAccept(booking.id);
        break;
      case 'reject':
        onReject(booking.id, rejectReason);
        break;
      case 'negotiate':
        onNegotiate(booking.id, negotiationData);
        break;
    }
    setShowConfirmation(false);
    handleClose();
  };

  const updateVehicleService = (vehicleId: string, serviceIndex: number, field: 'name' | 'price', value: string | number) => {
    setNegotiationData(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(vehicle => 
        vehicle.id === vehicleId 
          ? {
              ...vehicle,
              services: vehicle.services.map((service, index) => 
                index === serviceIndex 
                  ? { ...service, [field]: field === 'price' ? Number(value) : value }
                  : service
              )
            }
          : vehicle
      )
    }));
  };

  const addVehicleService = (vehicleId: string) => {
    setNegotiationData(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(vehicle => 
        vehicle.id === vehicleId 
          ? {
              ...vehicle,
              services: [...vehicle.services, { name: '', price: 0 }]
            }
          : vehicle
      )
    }));
  };

  const removeVehicleService = (vehicleId: string, serviceIndex: number) => {
    setNegotiationData(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(vehicle => 
        vehicle.id === vehicleId 
          ? {
              ...vehicle,
              services: vehicle.services.filter((_, index) => index !== serviceIndex)
            }
          : vehicle
      )
    }));
  };

  if (!booking) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-4">
            <DialogTitle className={`${textClasses.heading} text-center`}>
              Reply to Job
            </DialogTitle>
            <DialogDescription className={`${textClasses.base} text-center`}>
              {booking.reservationId} - {booking.customer}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {step === 'options' && (
              <div className="space-y-4">
                <div className="grid gap-4">
                  <Button
                    onClick={() => setStep('accept')}
                    className={`${textClasses.base} h-14 bg-green-600 hover:bg-green-700 text-white touch-manipulation`}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Accept Job
                  </Button>
                  
                  <Button
                    onClick={() => setStep('negotiate')}
                    className={`${textClasses.base} h-14 bg-blue-600 hover:bg-blue-700 text-white touch-manipulation`}
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Negotiate Terms
                  </Button>
                  
                  <Button
                    onClick={() => setStep('reject')}
                    variant="destructive"
                    className={`${textClasses.base} h-14 touch-manipulation`}
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Reject Job
                  </Button>
                </div>
              </div>
            )}

            {step === 'accept' && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className={`${textClasses.base} text-green-800`}>
                    You are about to accept this job with the current terms and conditions.
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('options')}
                    className={`${textClasses.base} flex-1 touch-manipulation`}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleAccept}
                    className={`${textClasses.base} flex-1 bg-green-600 hover:bg-green-700 touch-manipulation`}
                  >
                    Confirm Accept
                  </Button>
                </div>
              </div>
            )}

            {step === 'reject' && (
              <div className="space-y-4">
                <div>
                  <Label className={`${textClasses.base} text-slate-900`}>
                    Reason for rejection
                  </Label>
                  <Select value={rejectReason} onValueChange={setRejectReason}>
                    <SelectTrigger className={`${textClasses.base} mt-2 h-12 touch-manipulation`}>
                      <SelectValue placeholder="Select reason..." />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedReasons.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {rejectReason === 'Other' && (
                  <div>
                    <Label className={`${textClasses.base} text-slate-900`}>
                      Please specify
                    </Label>
                    <Textarea
                      placeholder="Enter your reason..."
                      value={rejectReason === 'Other' ? '' : rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className={`${textClasses.base} mt-2 min-h-[100px] touch-manipulation`}
                    />
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('options')}
                    className={`${textClasses.base} flex-1 touch-manipulation`}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleReject}
                    disabled={!rejectReason}
                    variant="destructive"
                    className={`${textClasses.base} flex-1 touch-manipulation`}
                  >
                    Confirm Reject
                  </Button>
                </div>
              </div>
            )}

            {step === 'negotiate' && (
              <div className="space-y-6">
                {/* Dates and Times */}
                <Card>
                  <CardHeader>
                    <CardTitle className={`${textClasses.base} flex items-center gap-2`}>
                      <Calendar className="h-5 w-5" />
                      Collection & Delivery
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className={`${textClasses.small} text-slate-700`}>Collection Date</Label>
                        <Input
                          type="date"
                          value={negotiationData.collectionDate}
                          onChange={(e) => setNegotiationData(prev => ({ ...prev, collectionDate: e.target.value }))}
                          className={`${textClasses.base} mt-1 h-12 touch-manipulation`}
                        />
                      </div>
                      <div>
                        <Label className={`${textClasses.small} text-slate-700`}>Collection Time</Label>
                        <Input
                          type="time"
                          value={negotiationData.collectionTime}
                          onChange={(e) => setNegotiationData(prev => ({ ...prev, collectionTime: e.target.value }))}
                          className={`${textClasses.base} mt-1 h-12 touch-manipulation`}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className={`${textClasses.small} text-slate-700`}>Delivery Date</Label>
                        <Input
                          type="date"
                          value={negotiationData.deliveryDate}
                          onChange={(e) => setNegotiationData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                          className={`${textClasses.base} mt-1 h-12 touch-manipulation`}
                        />
                      </div>
                      <div>
                        <Label className={`${textClasses.small} text-slate-700`}>Delivery Time</Label>
                        <Input
                          type="time"
                          value={negotiationData.deliveryTime}
                          onChange={(e) => setNegotiationData(prev => ({ ...prev, deliveryTime: e.target.value }))}
                          className={`${textClasses.base} mt-1 h-12 touch-manipulation`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Vehicle Services */}
                <div className="space-y-4">
                  <h3 className={`${textClasses.base} font-semibold text-slate-900`}>
                    Vehicle Services
                  </h3>
                  {negotiationData.vehicles.map((vehicle) => {
                    const originalVehicle = booking.vehicles.find(v => v.id === vehicle.id);
                    return (
                      <Card key={vehicle.id}>
                        <CardHeader>
                          <CardTitle className={`${textClasses.base}`}>
                            {originalVehicle?.make} {originalVehicle?.model} - {originalVehicle?.plate}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {vehicle.services.map((service, index) => (
                            <div key={index} className="grid grid-cols-5 gap-2 items-end">
                              <div className="col-span-2">
                                <Label className={`${textClasses.small} text-slate-700`}>Service</Label>
                                <Input
                                  value={service.name}
                                  onChange={(e) => updateVehicleService(vehicle.id, index, 'name', e.target.value)}
                                  placeholder="Service name"
                                  className={`${textClasses.base} h-10 touch-manipulation`}
                                />
                              </div>
                              <div className="col-span-2">
                                <Label className={`${textClasses.small} text-slate-700`}>Price (£)</Label>
                                <Input
                                  type="number"
                                  value={service.price}
                                  onChange={(e) => updateVehicleService(vehicle.id, index, 'price', e.target.value)}
                                  placeholder="0.00"
                                  step="0.01"
                                  className={`${textClasses.base} h-10 touch-manipulation`}
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeVehicleService(vehicle.id, index)}
                                className="h-10 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={() => addVehicleService(vehicle.id)}
                            className={`${textClasses.small} h-10 touch-manipulation`}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Service
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('options')}
                    className={`${textClasses.base} flex-1 touch-manipulation`}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNegotiate}
                    className={`${textClasses.base} flex-1 bg-blue-600 hover:bg-blue-700 touch-manipulation`}
                  >
                    Send Negotiation
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className={`${textClasses.heading} flex items-center gap-2`}>
              {confirmationType === 'accept' && <CheckCircle className="h-5 w-5 text-green-600" />}
              {confirmationType === 'reject' && <XCircle className="h-5 w-5 text-red-600" />}
              {confirmationType === 'negotiate' && <MessageSquare className="h-5 w-5 text-blue-600" />}
              Confirm {confirmationType === 'accept' ? 'Accept' : confirmationType === 'reject' ? 'Reject' : 'Negotiation'}
            </AlertDialogTitle>
            <AlertDialogDescription className={`${textClasses.base}`}>
              {confirmationType === 'accept' && 'Are you sure you want to accept this job?'}
              {confirmationType === 'reject' && `Are you sure you want to reject this job? Reason: ${rejectReason}`}
              {confirmationType === 'negotiate' && 'Are you sure you want to send this negotiation to the customer?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setShowConfirmation(false)}
              className={`${textClasses.base} touch-manipulation`}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirm}
              className={`${textClasses.base} touch-manipulation ${
                confirmationType === 'accept' ? 'bg-green-600 hover:bg-green-700' :
                confirmationType === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}