"use client";

import { useState } from "react";
import { Menu, X, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/lib/constants";

const bookingEnabled =
  process.env.NEXT_PUBLIC_BOOKING_ENABLED === "true";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="#" className="flex items-center gap-2 text-lg font-medium">
          <Scissors className="h-5 w-5 text-primary" />
          <span>Ольга</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
          {bookingEnabled && (
            <Button asChild size="sm">
              <a href="#booking">Записаться</a>
            </Button>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t bg-background px-4 pb-4">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block py-2 text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          {bookingEnabled && (
            <Button asChild size="sm" className="mt-2 w-full">
              <a href="#booking" onClick={() => setMenuOpen(false)}>
                Записаться
              </a>
            </Button>
          )}
        </nav>
      )}
    </header>
  );
}
