import { Camera } from "lucide-react";

const PLACEHOLDERS = Array.from({ length: 6 }, (_, i) => i + 1);

export function Portfolio() {
  return (
    <section id="portfolio" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Портфолио</h2>
        <p className="text-muted-foreground text-center mb-10">
          Примеры моих работ
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {PLACEHOLDERS.map((n) => (
            <div
              key={n}
              className="aspect-square rounded-xl bg-secondary/50 border flex flex-col items-center justify-center gap-2 text-muted-foreground"
            >
              <Camera className="h-8 w-8" />
              <span className="text-xs">Фото {n}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
