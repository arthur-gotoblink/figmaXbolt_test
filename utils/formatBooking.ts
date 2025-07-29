import { Booking } from '../types/booking';
import { Comment } from '../types/booking';
import {TeamMember} from '../types/booking';

export function formatRawBooking(raw: any): Booking {
  // Check if raw data is valid
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  // Ensure required properties exist with fallbacks
  const locations = raw.locations || [];
  const items = raw.items || [];
  
  const fromLocation = raw.locations.find((loc: any) => loc.order === 1);
  const toLocation = raw.locations.find((loc: any) => loc.order === 2);

  const vehicleData = items.map((item: any) => {
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
    items: items.map((item: any) => ({
      id: item.id,
      vehicleId: item.vehicle?.id || '',
      status: item.status || 'unknown',
    })),
    vehicles: vehicleData,
    status: raw.status || 'unknown',
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
    id: raw.id || Math.random().toString(36).substr(2, 9),
    user: raw.user?.full_name || raw.user?.name || raw.created_by?.full_name || raw.created_by?.name || 'Unknown',
    message: raw.comment || raw.message || raw.text || '',
    timestamp: raw.created_at || raw.updated_at || raw.timestamp || new Date().toISOString(),
  }));
}

export function formatRawTeamList(apiResponse: any): TeamMember[] {
  if (!apiResponse || !Array.isArray(apiResponse.users)) return [];

  return apiResponse.users.map((user: any): TeamMember => ({
    id: user.id || '',
    name: user.full_name || user.user_name || 'Unnamed',
    email: user.email || 'No email',
    image: user.image || null,
    phone: user.phone || '',
    status: user.status || '',
  }));
}