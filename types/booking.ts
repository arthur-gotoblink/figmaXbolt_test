export interface Service {
  name: string;
  price: number;
}

export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  colour: string;
  year: number;
  notes?: string;
  services: Service[];
}

export interface Item {
  id: string;
  vehicleId: string;
  status: 'pending' | 'booked' | 'allocated' | 'collected' | 'delivered' | 'cancelled';
}

export interface Comment {
  id: string;
  user: string;
  message: string;
  timestamp: string;
}

export interface Booking {
  id: string;
  reservationId: string;
  customer: string;
  from: {
    location: string;
  };
  to: {
    location: string;
  };
  collectionDate?: string;
  deliveryDate?: string;
  items: Item[];
  vehicles: Vehicle[];
  status: 'pending' | 'pending customer' | 'booked' | 'allocated' | 'in progress' | 'completed' | 'cancelled' | 'rejected' | 'invoiced';
  comments: Comment[];
}

export interface Driver {
  id: string;
  name: string;
  available: boolean;
}

export interface AllocationRequest {
  bookingId: string;
  vehicleIds: string[];
  driverId: string;
  date: string;
}