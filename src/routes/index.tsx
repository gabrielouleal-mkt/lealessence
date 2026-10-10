import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { productsQuery } from '@/lib/products-query';
import { Header } from "@/components/leal/Header";
import { Hero } from "@/components/leal/Hero";
import { BrandMarquee, BrandRails } from "@/components/leal/BrandRail";
import { Catalog } from "@/components/leal/Catalog";
import { About, Benefits, Featured, Footer, IndicationBanner, Kits } from "@/components/leal/Sections";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  head: () => ({
    meta: [
      { title: "Leal Essence — Perfumaria Fina | Perfumes árabes e importados" },
      {
        name: "description",
        content:
          "Catálogo de perfumes árabes e importados da Leal Essence. Conheça as fragrâncias selecionadas e consulte valores e disponibilidade pelo WhatsApp.",
      },
      { property: "og:title", content: "Leal Essence — Perfumaria Fina" },
      {
        property: "og:description",
        content: "Perfumes árabes e importados selecionados. Consulte valores e disponibilidade pelo WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [brand, setBrand] = useState<string | null>(null);
  useReveal();

  const selectBrandFromRail = (b: string | null) => {
    setBrand(b);
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-background">
      <Header />
      <BrandRails onSelectBrand={selectBrandFromRail} activeBrand={brand} />
      <main>
        <Hero />
        <BrandMarquee />
        <Benefits />
        <Featured />
        <Catalog brand={brand} onBrandChange={setBrand} />
        <IndicationBanner />
        <Kits />
        <About />
      </main>
      <Footer />
    </div>
  );
}
