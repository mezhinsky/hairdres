export interface Service {
  id: string;
  name: string;
  price: number;
  price_note: string | null;
  duration_minutes: number;
  sort_order: number;
  is_active: boolean;
}

export interface Booking {
  id: string;
  service_id: string;
  client_name: string;
  client_phone: string;
  client_telegram: string | null;
  booking_date: string;
  booking_time: string;
  duration_minutes: number;
  status: "pending" | "confirmed" | "cancelled";
  notes: string | null;
  created_at: string;
  service?: Service;
}

export interface BookingFormData {
  service_id: string;
  client_name: string;
  client_phone: string;
  client_telegram?: string;
  booking_date: string;
  booking_time: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
