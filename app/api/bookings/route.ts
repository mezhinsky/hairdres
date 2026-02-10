import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendBookingNotification } from "@/lib/telegram";
import { getAvailableSlots } from "@/lib/availability";
import type { Booking, BookingFormData } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: BookingFormData = await request.json();

    if (
      !body.service_id ||
      !body.client_name ||
      !body.client_phone ||
      !body.booking_date ||
      !body.booking_time
    ) {
      return NextResponse.json(
        { error: "Все поля обязательны для заполнения" },
        { status: 400 }
      );
    }

    // Get the service to know duration
    const { data: service, error: serviceError } = await supabaseAdmin
      .from("services")
      .select("*")
      .eq("id", body.service_id)
      .single();

    if (serviceError || !service) {
      return NextResponse.json(
        { error: "Услуга не найдена" },
        { status: 400 }
      );
    }

    // Check for conflicts
    const { data: existingBookings } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("booking_date", body.booking_date)
      .neq("status", "cancelled");

    const slots = getAvailableSlots(
      (existingBookings as Booking[]) || [],
      service.duration_minutes
    );

    const selectedSlot = slots.find((s) => s.time === body.booking_time);
    if (!selectedSlot?.available) {
      return NextResponse.json(
        { error: "Выбранное время уже занято" },
        { status: 409 }
      );
    }

    // Create the booking
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .insert({
        service_id: body.service_id,
        client_name: body.client_name,
        client_phone: body.client_phone,
        client_telegram: body.client_telegram || null,
        booking_date: body.booking_date,
        booking_time: body.booking_time,
        duration_minutes: service.duration_minutes,
        status: "pending",
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Booking creation error:", bookingError);
      return NextResponse.json(
        { error: "Не удалось создать запись" },
        { status: 500 }
      );
    }

    // Send Telegram notification — await before returning,
    // otherwise Vercel kills the function and the request gets dropped
    await sendBookingNotification({
      client_name: body.client_name,
      client_phone: body.client_phone,
      client_telegram: body.client_telegram,
      booking_date: body.booking_date,
      booking_time: body.booking_time,
      service_name: service.name,
      duration_minutes: service.duration_minutes,
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
