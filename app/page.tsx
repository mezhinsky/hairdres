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

export default async function Page() {
  const services = await getServices();

  return (
    <>
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
