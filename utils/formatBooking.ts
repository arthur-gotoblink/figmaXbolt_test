import { Booking } from '../types/booking';
import { Comment } from '../types/booking';

export function formatRawBooking(raw: any): Booking {
  const fromLocation = raw.locations.find((loc: any) => loc.order === 1);
  const toLocation = raw.locations.find((loc: any) => loc.order === 2);

  const vehicleData = raw.items.map((item: any) => {
    const vehicle = item.vehicle || {};
    return {
      id: vehicle.id,
      plate: vehicle.vehicle_registration_plate,
      make: vehicle.make || '',
      model: vehicle.model || '',
      colour: vehicle.colour || '',
      year: vehicle.year || 0,
      notes: vehicle.notes || '',
      services: [], // Tu pourras les rajouter plus tard
    };
  });

  return {
    id: raw.id,
    reservationId: raw.tracking_number,
    customer: raw.shipper?.full_name || 'Unknown',
    from: {
      location: fromLocation?.address?.address_locality || 'Unknown',
    },
    to: {
      location: toLocation?.address?.address_locality || 'Unknown',
    },
    collectionDate: raw.collect_after,
    deliveryDate: raw.deliver_before,
    items: raw.items.map((item: any) => ({
      id: item.id,
      vehicleId: item.vehicle?.id || '',
      status: item.status,
    })),
    vehicles: vehicleData,
    status: raw.status,
    comments: [
      {
        id: 'comment-id',
        user: raw.user?.full_name || 'Unknown',
        message: `Booking created`,
        timestamp: raw.created_at,
      },
    ],
  };
}

export function formatRawComments(rawComments: any[]): Comment[] {
  return rawComments.map((raw) => ({
    id: raw.id || '',
    user: raw.user?.full_name || 'Unknown',
    message: raw.comment || '',
    timestamp: raw.created_at || '',
  }));
}