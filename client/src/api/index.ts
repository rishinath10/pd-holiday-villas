import type { Villa, Booking, AvailabilityResponse, AdminUser, DatePrice } from '../types';

const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

// Public
export const fetchVillas = () => request<Villa[]>('/villas');
export const fetchVilla = (slug: string) => request<Villa>(`/villas/${slug}`);
export const fetchAvailability = (slug: string, from?: string, to?: string) => {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  return request<AvailabilityResponse>(`/villas/${slug}/availability?${params}`);
};

export const createBooking = (data: {
  villaSlug: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
}) => request<Booking>('/bookings', { method: 'POST', body: JSON.stringify(data) });

export const lookupBooking = (email: string, ref: string) =>
  request<Booking[]>(`/bookings/lookup?email=${encodeURIComponent(email)}&ref=${encodeURIComponent(ref)}`);

// Admin
export const adminLogin = (email: string, password: string) =>
  request<AdminUser>('/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const adminLogout = () => request('/admin/logout', { method: 'POST' });

export const adminGetMe = () => request<AdminUser>('/admin/me');

export const adminFetchBookings = () => request<Booking[]>('/admin/bookings');

export const adminUpdateBookingStatus = (id: string, status: string) =>
  request<Booking>(`/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

export const adminCreateBooking = (data: {
  villaId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  paymentChannel?: string;
  specialRequests?: string;
}) => request<Booking>('/admin/bookings', { method: 'POST', body: JSON.stringify(data) });

export const adminUpdateVilla = (id: string, data: Record<string, unknown>) =>
  request<Villa>(`/admin/villas/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const adminSyncIcal = () => request('/admin/sync/ical', { method: 'POST' });

export const adminDeleteBooking = (id: string) =>
  request<{ message: string }>(`/admin/bookings/${id}`, { method: 'DELETE' });

export const adminFetchDatePrices = (villaId: string) =>
  request<DatePrice[]>(`/admin/villas/${villaId}/date-prices`);

export const adminSetDatePrices = (villaId: string, dates: string[], price: number, label?: string) =>
  request<{ message: string }>(`/admin/villas/${villaId}/date-prices`, {
    method: 'POST',
    body: JSON.stringify({ dates, price, label }),
  });

export const adminDeleteDatePrices = (villaId: string, dates: string[]) =>
  request<{ message: string }>(`/admin/villas/${villaId}/date-prices`, {
    method: 'DELETE',
    body: JSON.stringify({ dates }),
  });

export const adminAddIcalSource = (villaId: string, source: string, url: string) =>
  request<Villa>(`/admin/villas/${villaId}/ical-sources`, {
    method: 'POST',
    body: JSON.stringify({ source, url }),
  });

export const adminDeleteIcalSource = (villaId: string, sourceIndex: number) =>
  request<Villa>(`/admin/villas/${villaId}/ical-sources/${sourceIndex}`, { method: 'DELETE' });

export const adminUploadVillaImages = async (villaId: string, files: File[]): Promise<Villa> => {
  const formData = new FormData();
  files.forEach(f => formData.append('images', f));
  const res = await fetch(`${API_BASE}/admin/villas/${villaId}/images`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `Upload failed: ${res.status}`);
  }
  return res.json();
};

export const adminDeleteVillaImage = (villaId: string, imageIndex: number) =>
  request<Villa>(`/admin/villas/${villaId}/images/${imageIndex}`, { method: 'DELETE' });

export const adminReorderVillaImages = (villaId: string, images: { url: string; alt: string }[]) =>
  request<Villa>(`/admin/villas/${villaId}/images`, { method: 'PUT', body: JSON.stringify({ images }) });

export const fetchDatePrices = (slug: string) =>
  request<DatePrice[]>(`/villas/${slug}/date-prices`);
