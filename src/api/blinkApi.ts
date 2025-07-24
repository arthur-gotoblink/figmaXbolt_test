const BASE_URL = 'https://api.staging.blinksystems.com.au/v3';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function apiRequest<T>(
  endpoint: string,
  token: string,
  method: HttpMethod = 'GET',
  body?: any
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API ${method} ${endpoint} failed: ${res.status} - ${errorText}`);
  }

  return res.json();
}

// 👉 Exports des fonctions
export async function fetchAllBookings(token: string) {
  return apiRequest<{ data: any[] }>('/job/booking/search?limit=20&offset=0&sort_by=collect_after&order=desc', token);
}

export async function fetchBookingDetails(id: string, token: string) {
  return apiRequest(`/job/booking/read?id=${id}`, token);
}

export async function fetchBookingComments(bookingId: string, token: string) {
  return apiRequest(`/job/comment/search?booking_id=${bookingId}&sort_by=created_at&order=desc&limit=50`, token);
}
