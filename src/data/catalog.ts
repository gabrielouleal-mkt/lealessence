import logoAsset from "@/assets/logo.png.asset.json";
import aboutAsset from "@/assets/about.jpg.asset.json";
import asadBourbon from "@/assets/asad-bourbon.jpg.asset.json";
import asadElixir from "@/assets/asad-elixir.jpg.asset.json";
import asad from "@/assets/asad.jpg.asset.json";
import clubDeNuit from "@/assets/club-de-nuit.jpg.asset.json";
import fakharPlatin from "@/assets/fakhar-platin.jpg.asset.json";
import fakharRose from "@/assets/fakhar-rose.jpg.asset.json";
import hawasBlack from "@/assets/hawas-black.jpg.asset.json";
import qaedAlFursan from "@/assets/qaed-al-fursan.jpg.asset.json";
import sabahAlWard from "@/assets/sabah-al-ward.jpg.asset.json";

export const LOGO_URL = logoAsset.url;
export const ABOUT_IMAGE_URL = aboutAsset.url;

export const WHATSAPP_NUMBER = "5545920025156";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_GENERIC = whatsappLink(
  "Olá! Estava no site da Leal Essence e gostaria de falar com um atendente.",
);
export const WHATSAPP_INDICATION = whatsappLink(
  "Olá! Vi o site da Leal Essence e gostaria de uma indicação de perfume.",
);
export const WHATSAPP_KIT = whatsappLink(
  "Olá! Vi o site da Leal Essence e gostaria de ajuda para montar um kit de presente personalizado.",
);

export type Category = "masculinos" | "femininos";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  originalPrice?: number;
  onSale?: boolean;
  featured?: boolean;
  description?: string;
  image: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "asad-bourbon",
    name: "Asad Bourbon",
    brand: "Lattafa",
    category: "masculinos",
    price: 220,
    originalPrice: 250,
    onSale: true,
    featured: true,
    description:
      "O Asad Bourbon da Lattafa é um perfume masculino oriental especiado, quente e envolvente. Sua fragrância combina o frescor da pimenta rosa e lavanda com o toque adocicado da ameixa mirabelle, evoluindo para um coração rico de cacau e noz-moscada. A base é densa e sofisticada, destacando-se pela baunilha de Bourbon e âmbar. É uma escolha marcante e elegante, ideal para noites e climas frios.",
    image: asadBourbon.url,
  },
  {
    id: "asad-elixir",
    name: "Asad Elixir",
    brand: "Lattafa",
    category: "masculinos",
    price: 188,
    featured: true,
    image: asadElixir.url,
  },
  {
    id: "hawas-black",
    name: "Hawas Black",
    brand: "Rasasi",
    category: "masculinos",
    price: 250,
    featured: true,
    image: hawasBlack.url,
  },
  {
    id: "fakhar-rose",
    name: "Fakhar Rosé",
    brand: "Lattafa",
    category: "femininos",
    price: 175,
    featured: true,
    image: fakharRose.url,
  },
  {
    id: "qaed-al-fursan",
    name: "Qaed Al Fursan",
    brand: "Lattafa",
    category: "masculinos",
    price: 130,
    image: qaedAlFursan.url,
  },
  {
    id: "club-de-nuit",
    name: "Club de Nuit",
    brand: "Armaf",
    category: "masculinos",
    price: 175,
    image: clubDeNuit.url,
  },
  {
    id: "fakhar-platin",
    name: "Fakhar Platin",
    brand: "Lattafa",
    category: "masculinos",
    price: 145,
    image: fakharPlatin.url,
  },
  {
    id: "asad",
    name: "Asad",
    brand: "Lattafa",
    category: "masculinos",
    price: 155,
    image: asad.url,
  },
  {
    id: "sabah-al-ward",
    name: "Sabah Al Ward",
    brand: "Al Wataniah",
    category: "femininos",
    price: 150,
    image: sabahAlWard.url,
  },
];

export function productWhatsAppLink(p: Product) {
  return whatsappLink(
    `Olá! Tenho interesse no ${p.name} (${p.brand}). Pode me passar disponibilidade e preço?`,
  );
}

export function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/**
 * Marcas de perfumaria árabe/importada exibidas nas margens laterais.
 * Representação tipográfica de protótipo — sem logos oficiais.
 */
export const BRAND_RAIL_LEFT = [
  "Lattafa",
  "Armaf",
  "Afnan",
  "Maison Alhambra",
  "Fragrance World",
  "Rasasi",
];

export const BRAND_RAIL_RIGHT = [
  "Swiss Arabian",
  "Al Haramain",
  "Paris Corner",
  "Ajmal",
  "Ard Al Zaafaran",
  "Orientica",
];

/** Marcas presentes no catálogo real (para filtro). */
export const CATALOG_BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))];
