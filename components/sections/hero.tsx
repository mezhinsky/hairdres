import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scissors, Award, Heart } from "lucide-react";

export function Hero() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Avatar placeholder */}
          <div className="mx-auto mb-8 h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
            <Scissors className="h-12 w-12 text-primary" />
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
            <a href="#booking">Записаться онлайн</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
