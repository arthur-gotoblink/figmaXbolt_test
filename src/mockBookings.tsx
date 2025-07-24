import { Booking } from './types/booking';

// Mock data for testing
export const mockBookings: Booking[] = [
  {
    id: '1',
    reservationId: 'RES-001',
    customer: 'John Smith',
    from: { location: 'London, UK' },
    to: { location: 'Manchester, UK' },
    collectionDate: '2024-01-15T10:00:00Z',
    deliveryDate: '2024-01-16T14:00:00Z',
    status: 'pending',
    items: [
      { id: '1', vehicleId: '1', status: 'pending' }
    ],
    vehicles: [
      {
        id: '1',
        plate: 'ABC123',
        make: 'BMW',
        model: 'X5',
        colour: 'Black',
        year: 2022,
        services: [
          { name: 'Transport', price: 500 }
        ]
      }
    ],
    comments: []
  },
  {
    id: '2',
    reservationId: 'RES-002',
    customer: 'Sarah Johnson',
    from: { location: 'Birmingham, UK' },
    to: { location: 'Liverpool, UK' },
    collectionDate: '2024-01-17T09:00:00Z',
    deliveryDate: '2024-01-18T16:00:00Z',
    status: 'booked',
    items: [
      { id: '2', vehicleId: '2', status: 'booked' }
    ],
    vehicles: [
      {
        id: '2',
        plate: 'XYZ789',
        make: 'Mercedes',
        model: 'C-Class',
        colour: 'White',
        year: 2021,
        services: [
          { name: 'Transport', price: 450 }
        ]
      }
    ],
    comments: []
  }
];