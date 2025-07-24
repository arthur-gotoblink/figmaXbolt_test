import { Booking } from '../types/booking';

// Ici on imagine que tu as déjà une fonction `fetchAllBookings(token)`
import { fetchAllBookings } from '../api/blinkApi';

export interface BookingViewModel {
  id: string;
  reference: string;
  clientName: string;
  pickup: string;
  dropoff: string;
  status: string;
}

export const getFormattedBookings = async (token: string): Promise<BookingViewModel[]> => {
  const rawData = await fetchAllBookings(token);

  if (!rawData?.data) return [];

  return rawData.data.map((item: any): BookingViewModel => ({
    id: item.id,
    reference: item.reservation_id ?? 'N/A',
    clientName: item.customer_name ?? 'Inconnu',
    pickup: item.pickup_location ?? 'Inconnu',
    dropoff: item.dropoff_location ?? 'Inconnu',
    status: item.status ?? 'unknown',
  }));
};
