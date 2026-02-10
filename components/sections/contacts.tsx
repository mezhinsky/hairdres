import { MapPin, Phone, Instagram } from "lucide-react";
import { PHONE_NUMBER, ADDRESS, INSTAGRAM } from "@/lib/constants";

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
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Адрес</p>
                <p className="text-muted-foreground">{ADDRESS}</p>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="aspect-video md:aspect-auto md:min-h-[250px] rounded-xl bg-muted border flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <span className="text-sm">Карта (заглушка)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
