import { describe, expect, it } from "vitest";
import { PRODUCTS, WHATSAPP_NUMBER, productWhatsAppLink } from "../data/catalog";

describe("Original public catalog values", () => {
  const prices = { "asad-bourbon": 220, "asad-elixir": 188, "hawas-black": 250, "fakhar-rose": 175, "qaed-al-fursan": 130, "club-de-nuit": 175, "fakhar-platin": 145, asad: 155, "sabah-al-ward": 150 };
  for (const [id, price] of Object.entries(prices)) {
    it(`preserves ${id} price`, () => {
      expect(PRODUCTS.find((p) => p.id === id)?.price).toBe(price);
    });
  }
  it("uses the official WhatsApp for product inquiries", () => {
    expect(WHATSAPP_NUMBER).toBe("5545920025156");
    const product = PRODUCTS.find((p) => p.id === "asad-bourbon");
    if (!product) throw new Error("Missing product");
    expect(productWhatsAppLink(product)).toContain("https://wa.me/5545920025156?text=");
  });
});