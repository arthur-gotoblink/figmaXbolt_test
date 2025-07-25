import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, Trash2, Calendar, MapPin, User, Car } from 'lucide-react';
import { useSettings } from './SettingsContext';
import { useAuth } from '../src/lib/authToken';

interface NewBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated: () => void;
}

interface Vehicle {
  make: string;
  model: string;
  year: string;
  colour: string;
  plate: string;
  notes: string;
}

interface Location {
  address: string;
  city: string;
  postcode: string;
}

export function NewBookingForm({ isOpen, onClose, onBookingCreated }: NewBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customer, setCustomer] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [pickupLocation, setPickupLocation] = useState<Location>({
    address: '',
    city: '',
    postcode: ''
  });
  
  const [deliveryLocation, setDeliveryLocation] = useState<Location>({
    address: '',
    city: '',
    postcode: ''
  });
  
  const [collectionDate, setCollectionDate] = useState('');
  const [collectionTime, setCollectionTime] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([{
    make: '',
    model: '',
    year: '',
    colour: '',
    plate: '',
    notes: ''
  }]);

  const { getTextSizeClasses } = useSettings();
  const { token } = useAuth();
  const textClasses = getTextSizeClasses();

  const handleClose = () => {
    // Reset form
    setCustomer('');
    setCustomerEmail('');
    setCustomerPhone('');
    setPickupLocation({ address: '', city: '', postcode: '' });
    setDeliveryLocation({ address: '', city: '', postcode: '' });
    setCollectionDate('');
    setCollectionTime('');
    setDeliveryDate('');
    setDeliveryTime('');
    setVehicles([{ make: '', model: '', year: '', colour: '', plate: '', notes: '' }]);
    onClose();
  };

  const addVehicle = () => {
    setVehicles([...vehicles, { make: '', model: '', year: '', colour: '', plate: '', notes: '' }]);
  };

  const removeVehicle = (index: number) => {
    if (vehicles.length > 1) {
      setVehicles(vehicles.filter((_, i) => i !== index));
    }
  };

  const updateVehicle = (index: number, field: keyof Vehicle, value: string) => {
    const updatedVehicles = vehicles.map((vehicle, i) => 
      i === index ? { ...vehicle, [field]: value } : vehicle
    );
    setVehicles(updatedVehicles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSubmitting(true);

    try {
      const bookingData = {
        customer_name: customer,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        pickup_location: {
          address: pickupLocation.address,
          city: pickupLocation.city,
          postcode: pickupLocation.postcode
        },
        delivery_location: {
          address: deliveryLocation.address,
          city: deliveryLocation.city,
          postcode: deliveryLocation.postcode
        },
        collection_date: collectionDate && collectionTime ? 
          `${collectionDate}T${collectionTime}:00Z` : null,
        delivery_date: deliveryDate && deliveryTime ? 
          `${deliveryDate}T${deliveryTime}:00Z` : null,
        vehicles: vehicles.filter(v => v.make && v.model && v.plate),
        status: 'pending'
      };

      const response = await fetch('http://localhost:3001/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        onBookingCreated();
        handleClose();
      } else {
        const errorData = await response.json();
        console.error('Failed to create booking:', errorData);
        alert('Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return customer && 
           customerEmail && 
           pickupLocation.address && 
           pickupLocation.city &&
           deliveryLocation.address && 
           deliveryLocation.city &&
           vehicles.some(v => v.make && v.model && v.plate);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <DialogTitle className={`${textClasses.heading} text-center`}>
            Create New Booking
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className={`${textClasses.base} flex items-center gap-2`}>
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className={`${textClasses.small} text-slate-700`}>Customer Name *</Label>
                  <Input
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    placeholder="Enter customer name"
                    className={`${textClasses.base} mt-1 h-12 touch-manipulation`}
                    required
                  />
                </div>
                <div>
                  <Label className={`${textClasses.small} text-slate-700`}>Email *</Label>
                  <Input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Enter email address"
                    className={`${textClasses.base} mt-1 h-12 touch-manipulation`}
                    required
                  />
                </div>
              </div>
              <div>
                <Label className={`${textClasses.small} text-slate-700`}>Phone Number</Label>
                <Input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className={`${textClasses.base} mt-1 h-12 touch-manipulation`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Locations */}
          <Card>
            <CardHeader>
              <CardTitle className={`${textClasses.base} flex items-center gap-2`}>
                <MapPin className="h-5 w-5" />
                Pickup & Delivery Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className={`${textClasses.base} font-medium text-slate-900 mb-3`}>Pickup Location</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label className={`${textClasses.small} text-slate-700`}>Address *</Label>
                    <Input
                      value={pickupLocation.address}
                      onChange={(e) => setPickupLocation({...pickupLocation, address: e.target.value})}
                      placeholder="Enter pickup address"
                      className={`${textClasses.base} mt-1 h-12 touch-manipulation`}
                      required
                    />
                  </div>
                  <div>
                    <Label className={`${textClasses.small} text-slate-700`}>City *</Label>
                    <Input
                      value={pickupLocation.city}
                      onChange={(e) => setPickupLocation({...pickupLocation, city: e.target.value})}
                      placeholder="City"
                      className={`${textClasses.base} mt-1 h-12 touch-manipulation`}
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label className={`${textClasses.small} text-slate-700`}>Postcode</Label>
                  <Input
                    value={pickupLocation.postcode}
                    onChange={(e) => setPickupLocation({...pickupLocation, postcode: e.target.value})}
                    placeholder="Postcode"
                    className={`${textClasses.base} mt-1 h-12 touch-manipulation w-full md:w-48`}
                  />
                </div>
              </div>

              <div>
                <h4 className={`${textClasses.base} font-medium text-slate-900 mb-3`}>Delivery Location</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label className={`${textClasses.small} text-slate-700`}>Address *</Label>
                    <Input
                      value={deliveryLocation.address}
                      onChange={(e) => setDeliveryLocation({...deliveryLocation, address: e.target.value})}
                      placeholder="Enter delivery address"
                      className={`${textClasses.base} mt-1 h-12 touch-manipulation`}
                      required
                    />
                  </div>
                  <div>
                    <Label className={`${textClasses.small} text-slate-700`}>City *</Label>
                    <Input
                      value={deliveryLocation.city}
                      onChange={(e) => setDeliveryLocation({...deliveryLocation, city: e.target.value})}
                      placeholder="City"
                      className={`${textClasses.base} mt-1 h-12 touch-manipulation`}
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label className={`${textClasses.small} text-slate-700`}>Postcode</Label>
                  <Input
                    value={deliveryLocation.postcode}
                    onChange={(e) => setDeliveryLocation({...deliveryLocation, postcode: e.target.value})}
                    placeholder="Postcode"
                    className={`${textClasses.base} mt-1 h-12 touch-manipulation w-full md:w-48`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates & Times */}
          <Card>
            <CardHeader>
              <CardTitle className={`${textClasses.base} flex items-center gap-2`}>
                <Calendar className="h-5 w-5" />
                Collection & Delivery Times
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`${textClasses.base} font-medium text-slate-900 mb-3`}>Collection</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className={`${textClasses.small} text-slate-700`}>Date</Label>
                      <Input
                        type="date"
                        value={collectionDate}
                        onChange={(e) => setCollectionDate(e.target.value)}
                        className={`${textClasses.base} mt-1 h-12 touch-manipulation`}
                      />
                    </div>
                    <div>
                      <Label className={`${textClasses.small} text-slate-700`}>Time</Label>
                      <Input
                        type="time"
                        value={collectionTime}
                        onChange={(e) => setCollectionTime(e.target.value)}
                        className={`${textClasses.base} mt-1 h-12 touch-manipulation`}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className={`${textClasses.base} font-medium text-slate-900 mb-3`}>Delivery</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className={`${textClasses.small} text-slate-700`}>Date</Label>
                      <Input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className={`${textClasses.base} mt-1 h-12 touch-manipulation`}
                      />
                    </div>
                    <div>
                      <Label className={`${textClasses.small} text-slate-700`}>Time</Label>
                      <Input
                        type="time"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className={`${textClasses.base} mt-1 h-12 touch-manipulation`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicles */}
          <Card>
            <CardHeader>
              <CardTitle className={`${textClasses.base} flex items-center gap-2`}>
                <Car className="h-5 w-5" />
                Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vehicles.map((vehicle, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`${textClasses.base} font-medium text-slate-900`}>
                      Vehicle {index + 1}
                    </h4>
                    {vehicles.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVehicle(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className={`${textClasses.small} text-slate-700`}>Make *</Label>
                      <Input
                        value={vehicle.make}
                        onChange={(e) => updateVehicle(index, 'make', e.target.value)}
                        placeholder="e.g. BMW"
                        className={`${textClasses.base} mt-1 h-10 touch-manipulation`}
                      />
                    </div>
                    <div>
                      <Label className={`${textClasses.small} text-slate-700`}>Model *</Label>
                      <Input
                        value={vehicle.model}
                        onChange={(e) => updateVehicle(index, 'model', e.target.value)}
                        placeholder="e.g. X5"
                        className={`${textClasses.base} mt-1 h-10 touch-manipulation`}
                      />
                    </div>
                    <div>
                      <Label className={`${textClasses.small} text-slate-700`}>Year</Label>
                      <Input
                        value={vehicle.year}
                        onChange={(e) => updateVehicle(index, 'year', e.target.value)}
                        placeholder="e.g. 2022"
                        className={`${textClasses.base} mt-1 h-10 touch-manipulation`}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label className={`${textClasses.small} text-slate-700`}>Colour</Label>
                      <Input
                        value={vehicle.colour}
                        onChange={(e) => updateVehicle(index, 'colour', e.target.value)}
                        placeholder="e.g. Black"
                        className={`${textClasses.base} mt-1 h-10 touch-manipulation`}
                      />
                    </div>
                    <div>
                      <Label className={`${textClasses.small} text-slate-700`}>Registration Plate *</Label>
                      <Input
                        value={vehicle.plate}
                        onChange={(e) => updateVehicle(index, 'plate', e.target.value)}
                        placeholder="e.g. ABC123"
                        className={`${textClasses.base} mt-1 h-10 touch-manipulation`}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label className={`${textClasses.small} text-slate-700`}>Notes</Label>
                    <Textarea
                      value={vehicle.notes}
                      onChange={(e) => updateVehicle(index, 'notes', e.target.value)}
                      placeholder="Any additional notes about this vehicle..."
                      className={`${textClasses.base} mt-1 min-h-[80px] touch-manipulation`}
                    />
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addVehicle}
                className={`${textClasses.base} h-12 touch-manipulation`}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Vehicle
              </Button>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className={`${textClasses.base} flex-1 h-12 touch-manipulation`}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`${textClasses.base} flex-1 h-12 bg-blue-600 hover:bg-blue-700 touch-manipulation`}
            >
              {isSubmitting ? 'Creating...' : 'Create Booking'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}