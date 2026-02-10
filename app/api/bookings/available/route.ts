import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getAvailableSlots } from "@/lib/availability";
import type { Booking } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const duration = searchParams.get("duration");

  if (!date || !duration) {
    return NextResponse.json(
      { error: "Параметры date и duration обязательны" },
      { status: 400 }
    );
  }

  const durationMinutes = parseInt(duration, 10);
  if (isNaN(durationMinutes) || durationMinutes <= 0) {
    return NextResponse.json(
      { error: "Некорректная длительность" },
      { status: 400 }
    );
  }

  const { data: bookings, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("booking_date", date)
    .neq("status", "cancelled");

  if (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить записи" },
      { status: 500 }
    );
  }

  const slots = getAvailableSlots(
    (bookings as Booking[]) || [],
    durationMinutes
  );

  return NextResponse.json({ slots: slots.filter((s) => s.available) });
}
