import Image from "next/image";

const PORTFOLIO_ITEMS = [
  { src: "/2e5tvtle3o.jpg", alt: "Укладка на длинные волосы" },
  { src: "/5984d10cng.jpg", alt: "Восстановление и блеск" },
  { src: "/5qrrof63r9.jpg", alt: "Блонд каре" },
  { src: "/5idoq8mls3.jpg", alt: "Окрашивание до/после" },
  { src: "/39pnpqregp.jpg", alt: "Короткая стрижка" },
  { src: "/39k3iqrgsq.jpg", alt: "Рыжее окрашивание" },
  { src: "/1q4l5rrt18.jpg", alt: "Блонд с укладкой" },
  { src: "/7bv3l3pbu6.jpg", alt: "Каре с мелированием" },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Портфолио</h2>
        <p className="text-muted-foreground text-center mb-10">
          Примеры моих работ
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {PORTFOLIO_ITEMS.map((item) => (
            <div
              key={item.src}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden border"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
                <p className="text-white text-sm font-medium">{item.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
