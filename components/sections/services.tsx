"use client";

import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import type { Service } from "@/lib/types";

interface ServicesProps {
  services: Service[];
}

export function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Услуги и цены</h2>
        <p className="text-muted-foreground text-center mb-10">
          Актуальный прайс-лист
        </p>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="divide-y">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 hover:bg-accent/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base truncate">
                      {service.name}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {service.duration_minutes} мин.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-semibold text-sm sm:text-base whitespace-nowrap">
                      {service.price_note ? `от ` : ""}
                      {service.price} ₽
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <a href="#booking">Записаться</a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
