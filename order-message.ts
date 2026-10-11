import { formatPrice, whatsappLink } from "@/data/catalog";

export interface CartLine {
  key: string;
  productId: string;
  name: string;
  brand: string;
  variantId: string;
  variantLabel: string;
  unitPrice: number;
  qty: number;
}

export const cartTotal = (lines: CartLine[]) =>
  lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
export const cartCount = (lines: CartLine[]) => lines.reduce((sum, l) => sum + l.qty, 0);

export function buildOrderMessage(lines: CartLine[]) {
  const items = lines.map(
    (l) =>
      `• ${l.qty}x ${l.name} (${l.brand}) — ${l.variantLabel} — ${formatPrice(l.unitPrice * l.qty)}`,
  );
  return [
    "Olá! Gostaria de fazer este pedido pela Leal Essence:",
    "",
    ...items,
    "",
    `Total: ${formatPrice(cartTotal(lines))}`,
    "",
    "Pode confirmar a disponibilidade, o prazo de envio e as formas de pagamento?",
  ].join("\n");
}

export const orderWhatsAppLink = (lines: CartLine[]) => whatsappLink(buildOrderMessage(lines));
