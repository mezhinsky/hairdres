import { WORK_START_HOUR, WORK_END_HOUR, SLOT_INTERVAL_MINUTES } from "./constants";
import type { Booking, TimeSlot } from "./types";

export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = WORK_START_HOUR; h < WORK_END_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_INTERVAL_MINUTES) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function getAvailableSlots(
  bookings: Booking[],
  durationMinutes: number
): TimeSlot[] {
  const allSlots = generateTimeSlots();
  const endOfDay = WORK_END_HOUR * 60;

  return allSlots.map((slot) => {
    const slotStart = timeToMinutes(slot);
    const slotEnd = slotStart + durationMinutes;

    if (slotEnd > endOfDay) {
      return { time: slot, available: false };
    }

    const hasConflict = bookings.some((booking) => {
      if (booking.status === "cancelled") return false;
      const bookingStart = timeToMinutes(booking.booking_time);
      const bookingEnd = bookingStart + booking.duration_minutes;
      return slotStart < bookingEnd && slotEnd > bookingStart;
    });

    return { time: slot, available: !hasConflict };
  });
}
