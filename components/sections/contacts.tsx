import { MapPin, Phone, Instagram, Send } from "lucide-react";
import { PHONE_NUMBER, ADDRESS, INSTAGRAM, TELEGRAM } from "@/lib/constants";

export function Contacts() {
  return (
    <section id="contacts" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Контакты</h2>
        <p className="text-muted-foreground text-center mb-10">
          Свяжитесь со мной или приходите в салон
        </p>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Телефон</p>
                <a
                  href={`tel:${PHONE_NUMBER.replace(/\D/g, "")}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {PHONE_NUMBER}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Instagram className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Instagram</p>
                <p className="text-muted-foreground">{INSTAGRAM}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Send className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Telegram</p>
                <a
                  href={`https://t.me/${TELEGRAM.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {TELEGRAM}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Адрес</p>
                <p className="text-muted-foreground">{ADDRESS}</p>
              </div>
            </div>
          </div>

          {/* Yandex Map — Северное Бутово */}
          <div className="aspect-video md:aspect-auto md:min-h-[300px] rounded-xl overflow-hidden border">
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=37.578&pt=37.578,55.570,pm2rdm~&z=14&l=map"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 300 }}
              allowFullScreen
              loading="lazy"
              title="Северное Бутово на карте"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
