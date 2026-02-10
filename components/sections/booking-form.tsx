"use client";

import { useState, useEffect } from "react";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "sonner";
import { CalendarDays, Clock, Loader2, Phone } from "lucide-react";
import { PHONE_NUMBER, TELEGRAM } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Service, TimeSlot } from "@/lib/types";

interface BookingFormProps {
  services: Service[];
}

const bookingEnabled =
  process.env.NEXT_PUBLIC_BOOKING_ENABLED === "true";

export function BookingForm({ services }: BookingFormProps) {
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedService = services.find((s) => s.id === serviceId);

  // Generate date options: next 14 days
  const dateOptions: { value: string; label: string }[] = [];
  const today = startOfDay(new Date());
  for (let i = 0; i < 14; i++) {
    const d = addDays(today, i);
    dateOptions.push({
      value: format(d, "yyyy-MM-dd"),
      label: format(d, "d MMMM, EEEE", { locale: ru }),
    });
  }

  // Fetch available slots when service and date change
  useEffect(() => {
    if (!serviceId || !date || !selectedService) {
      setSlots([]);
      setTime("");
      return;
    }

    let cancelled = false;
    setLoadingSlots(true);
    setTime("");

    fetch(
      `/api/bookings/available?date=${date}&duration=${selectedService.duration_minutes}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setSlots(data.slots || []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Не удалось загрузить доступное время");
          setSlots([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [serviceId, date, selectedService]);

  // Filter out past time slots for today
  const availableSlots = slots.filter((slot) => {
    if (date !== format(today, "yyyy-MM-dd")) return true;
    const [h, m] = slot.time.split(":").map(Number);
    const slotDate = new Date();
    slotDate.setHours(h, m, 0, 0);
    return !isBefore(slotDate, new Date());
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!serviceId || !date || !time || !name.trim() || !phone.trim()) {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: serviceId,
          client_name: name.trim(),
          client_phone: phone.trim(),
          client_telegram: telegram.trim() || undefined,
          booking_date: date,
          booking_time: time,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка при создании записи");
      }

      toast.success("Вы успешно записаны! Ожидайте подтверждения.");
      setServiceId("");
      setDate("");
      setTime("");
      setName("");
      setPhone("");
      setTelegram("");
      setSlots([]);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Не удалось создать запись"
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!bookingEnabled) {
    return (
      <section id="booking" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Запись</h2>
          <div className="max-w-lg mx-auto bg-card p-6 sm:p-8 rounded-xl border shadow-sm text-center">
            <p className="text-muted-foreground mb-4">
              Онлайн-запись временно недоступна. Для записи свяжитесь напрямую:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="default" size="lg">
                <a href={`tel:${PHONE_NUMBER.replace(/\D/g, "")}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  {PHONE_NUMBER}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a
                  href={`https://t.me/${TELEGRAM.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Написать в Telegram
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">
          Онлайн-запись
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          Выберите услугу, дату и удобное время
        </p>

        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto space-y-6 bg-card p-6 sm:p-8 rounded-xl border shadow-sm"
        >
          {/* Service select */}
          <div className="space-y-2">
            <Label htmlFor="service">Услуга</Label>
            <Select value={serviceId} onValueChange={setServiceId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите услугу" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} — {s.price_note ? "от " : ""}
                    {s.price} ₽
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date select */}
          <div className="space-y-2">
            <Label htmlFor="date">
              <CalendarDays className="inline h-4 w-4 mr-1" />
              Дата
            </Label>
            <Select
              value={date}
              onValueChange={setDate}
              disabled={!serviceId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите дату" />
              </SelectTrigger>
              <SelectContent>
                {dateOptions.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time slots */}
          <div className="space-y-2">
            <Label>
              <Clock className="inline h-4 w-4 mr-1" />
              Время
            </Label>
            {loadingSlots ? (
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 rounded-md" />
                ))}
              </div>
            ) : !serviceId || !date ? (
              <p className="text-sm text-muted-foreground">
                Сначала выберите услугу и дату
              </p>
            ) : availableSlots.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Нет свободного времени на эту дату
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    type="button"
                    variant={time === slot.time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTime(slot.time)}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Client info */}
          <div className="space-y-2">
            <Label htmlFor="name">Ваше имя</Label>
            <Input
              id="name"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!time}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!time}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegram">Telegram (необязательно)</Label>
            <Input
              id="telegram"
              placeholder="@username"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              disabled={!time}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={
              submitting || !serviceId || !date || !time || !name || !phone
            }
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Отправка...
              </>
            ) : (
              "Записаться"
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
