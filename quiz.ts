import type { Product } from "@/data/catalog";
import { getProfile, type OlfactoryFamily } from "./fragrance-profiles";

export type GenderAnswer = "masculinos" | "femininos" | "qualquer";
export type MomentAnswer = "dia" | "noite" | "ambos";
export type StyleAnswer = "especiado" | "doce" | "fresco" | "amadeirado" | "floral";

export interface QuizAnswers {
  gender: GenderAnswer;
  moment: MomentAnswer;
  style: StyleAnswer;
}

const STYLE_FAMILY: Record<StyleAnswer, OlfactoryFamily> = {
  especiado: "Especiado",
  doce: "Doce / Gourmand",
  fresco: "Fresco",
  amadeirado: "Amadeirado",
  floral: "Floral",
};

export function recommend(products: Product[], a: QuizAnswers, limit = 3) {
  const eligible = products.filter(
    (p) =>
      p.available !== false &&
      (a.gender === "qualquer" || p.category === a.gender || p.category === "unissex"),
  );
  return eligible
    .map((p) => {
      const profile = getProfile(p.name);
      let score = 0;
      if (profile) {
        if (profile.family.includes(STYLE_FAMILY[a.style])) score += 3;
        if (
          a.moment === "ambos" ||
          profile.moments.includes("ambos") ||
          profile.moments.includes(a.moment)
        )
          score += 2;
      }
      return { product: p, score, profiled: !!profile };
    })
    .sort(
      (x, y) => y.score - x.score || Number(!!y.product.featured) - Number(!!x.product.featured),
    )
    .slice(0, limit);
}
