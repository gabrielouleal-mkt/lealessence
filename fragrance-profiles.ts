import { normalizeBrand } from "./catalog-filters";

/**
 * Ficha olfativa OPCIONAL por perfume. Chave = nome do produto normalizado
 * (sem acento, minúsculo), então funciona com os produtos do banco sem alterar o schema.
 *
 * Só entram aqui perfumes com notas confirmadas em fontes públicas. Perfume sem ficha
 * continua normal no site: o modal mostra apenas descrição e foto.
 * Para adicionar/editar, basta incluir um item neste objeto.
 */
export type OlfactoryFamily = "Especiado" | "Doce / Gourmand" | "Fresco" | "Amadeirado" | "Floral";

export interface FragranceProfile {
  family: OlfactoryFamily[];
  top: string[];
  heart: string[];
  base: string[];
  /** Projeção e fixação em linguagem simples (referência de performance de EDP). */
  projection: string;
  longevity: string;
  climate: string;
  occasion: string;
  /** Usado pelo quiz */
  intensity: "suave" | "moderada" | "marcante";
  moments: Array<"dia" | "noite" | "ambos">;
}

const PROFILES: Record<string, FragranceProfile> = {
  // Notas: texto de descrição já cadastrado no site para o Asad Bourbon.
  "asad bourbon": {
    family: ["Especiado", "Doce / Gourmand"],
    top: ["Pimenta rosa", "Lavanda", "Ameixa mirabelle"],
    heart: ["Cacau", "Noz-moscada"],
    base: ["Baunilha de Bourbon", "Âmbar"],
    projection: "Moderada a forte",
    longevity: "Longa duração",
    climate: "Clima frio e ameno",
    occasion: "Noites e ocasiões elegantes",
    intensity: "marcante",
    moments: ["noite"],
  },
  // Notas: fabricante/varejistas (Lattafa, Anabis, Bjutip).
  "asad elixir": {
    family: ["Especiado", "Amadeirado"],
    top: ["Pimenta rosa", "Açafrão", "Grapefruit"],
    heart: ["Tabaco", "Cedro", "Baunilha"],
    base: ["Patchouli", "Olíbano", "Cashmeran", "Âmbar seco"],
    projection: "Forte",
    longevity: "Longa duração",
    climate: "Clima frio e ameno",
    occasion: "Noite e eventos",
    intensity: "marcante",
    moments: ["noite"],
  },
  // Notas e performance: Parfumo, The Scent Base e varejistas (lançado em 2024).
  "hawas black": {
    family: ["Amadeirado", "Fresco"],
    top: ["Bergamota", "Abacaxi", "Grapefruit"],
    heart: ["Cedro", "Patchouli", "Jasmim"],
    base: ["Musgo de carvalho", "Âmbar", "Notas amadeiradas"],
    projection: "Acima da média",
    longevity: "6+ horas",
    climate: "Versátil, melhor em clima ameno e frio",
    occasion: "Dia e noite",
    intensity: "marcante",
    moments: ["ambos"],
  },
  // Notas: site oficial Lattafa (Fakhar Women). Fontes divergem sobre o Rosé: confirme com o fornecedor.
  "fakhar rose": {
    family: ["Floral", "Doce / Gourmand"],
    top: ["Aldeídos", "Lírio", "Romã", "Frutas frescas"],
    heart: ["Rosa", "Jasmim", "Gardênia"],
    base: ["Baunilha", "Sândalo", "Ambroxan", "Almíscar branco"],
    projection: "Moderada",
    longevity: "Longa duração",
    climate: "Versátil, ótimo em clima ameno",
    occasion: "Dia a dia e encontros",
    intensity: "moderada",
    moments: ["ambos"],
  },
};

export function getProfile(productName: string): FragranceProfile | null {
  return PROFILES[normalizeBrand(productName)] ?? null;
}

export const FAMILIES: OlfactoryFamily[] = [
  "Especiado",
  "Doce / Gourmand",
  "Fresco",
  "Amadeirado",
  "Floral",
];
