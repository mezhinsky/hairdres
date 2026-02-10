import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Heart } from "lucide-react";

const bookingEnabled =
  process.env.NEXT_PUBLIC_BOOKING_ENABLED === "true";

export function Hero() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto mb-8 h-40 w-40 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
            <Image
              src="/olga.jpg"
              alt="Парикмахер-стилист Ольга Делова"
              width={160}
              height={160}
              className="object-cover w-full h-full"
              priority
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Парикмахер-стилист Ольга
          </h1>

          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Более 10 лет опыта в индустрии красоты. Специализируюсь на сложном
            окрашивании, стрижках и восстановлении волос. Каждый клиент для
            меня — это индивидуальный подход и гарантия результата.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="secondary" className="gap-1 px-3 py-1">
              <Award className="h-3.5 w-3.5" />
              Wella Professionals
            </Badge>
            <Badge variant="secondary" className="gap-1 px-3 py-1">
              <Award className="h-3.5 w-3.5" />
              Schwarzkopf
            </Badge>
            <Badge variant="secondary" className="gap-1 px-3 py-1">
              <Heart className="h-3.5 w-3.5" />
              500+ довольных клиентов
            </Badge>
          </div>

          <Button asChild size="lg">
            <a href={bookingEnabled ? "#booking" : "#contacts"}>
              {bookingEnabled ? "Записаться онлайн" : "Связаться"}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
