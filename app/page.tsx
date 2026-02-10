import { supabase } from "@/lib/supabase";
import type { Service } from "@/lib/types";

export const dynamic = "force-dynamic";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Portfolio } from "@/components/sections/portfolio";
import { BookingForm } from "@/components/sections/booking-form";
import { Contacts } from "@/components/sections/contacts";
import { Footer } from "@/components/sections/footer";

async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }

  return data as Service[];
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "Парикмахер Ольга Делова",
  description:
    "Парикмахер-стилист Ольга Делова. Стрижки, окрашивание, балаяж, восстановление волос.",
  url: "https://www.olgadelova.ru",
  telephone: "+79164192494",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Москва",
    addressRegion: "Москва",
    addressCountry: "RU",
    streetAddress: "Северное Бутово",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 55.57,
    longitude: 37.578,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "09:00",
    closes: "20:00",
  },
  priceRange: "₽₽",
  image: "https://www.olgadelova.ru/og-image.jpg",
  sameAs: ["https://t.me/olyadelova75"],
};

export default async function Page() {
  const services = await getServices();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Services services={services} />
        <Portfolio />
        <BookingForm services={services} />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
