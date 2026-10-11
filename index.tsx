import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import { productsQuery } from '@/lib/products-query';
import { Header } from "@/components/leal/Header";
import { Hero } from "@/components/leal/Hero";
import { BrandMarquee, BrandRails } from "@/components/leal/BrandRail";
import { Catalog } from "@/components/leal/Catalog";
import { About, Benefits, Featured, Footer, IndicationBanner, Kits } from "@/components/leal/Sections";
import { Quiz } from "@/components/leal/Quiz";
import { Faq } from "@/components/leal/Faq";
import { CartDrawer } from "@/components/leal/CartDrawer";
import { CartProvider } from "@/lib/cart";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  // Marca ativa fica na URL (?marca=Armaf): atualizar a página mantém o filtro.
  validateSearch: (search: Record<string, unknown>): { marca?: string } => {
    const raw = search["marca"];
    const marca = typeof raw === "string" ? raw.trim().slice(0, 100) : "";
    return marca ? { marca } : {};
  },
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
  const { marca } = Route.useSearch();
  const navigate = Route.useNavigate();
  const brand = marca ?? null;
  useReveal();

  const setBrand = useCallback(
    (b: string | null) => {
      void navigate({ search: b ? { marca: b } : {}, replace: true, resetScroll: false });
    },
    [navigate],
  );

  // Atalhos laterais: aplicam o mesmo filtro da ARMAF e levam ao catálogo.
  const selectBrandFromRail = useCallback(
    (b: string | null) => {
      setBrand(b);
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
    },
    [setBrand],
  );

  return (
    <CartProvider>
      <div className="relative min-h-screen bg-background">
        <Header />
        <BrandRails onSelectBrand={selectBrandFromRail} activeBrand={brand} />
        <main>
          <Hero />
          <BrandMarquee onSelectBrand={selectBrandFromRail} activeBrand={brand} />
          <Benefits />
          <Featured />
          <Catalog brand={brand} onBrandChange={setBrand} />
          <Quiz />
          <IndicationBanner />
          <Kits />
          <About />
          <Faq />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
