import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatPrice } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import { orderWhatsAppLink } from "@/lib/order-message";
import { WhatsAppIcon } from "./Header";

export function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Abrir sacola${count ? `, ${count} ${count === 1 ? "item" : "itens"}` : ""}`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary/40 hover:text-primary"
    >
      <ShoppingBag className="size-4" aria-hidden="true" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </button>
  );
}

export function CartDrawer() {
  const { lines, total, count, open, setOpen, setQty, remove, clear } = useCart();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border p-6 text-left">
          <SheetTitle className="font-display text-3xl font-medium">Sua sacola</SheetTitle>
          <SheetDescription>
            {count
              ? `${count} ${count === 1 ? "item" : "itens"} selecionados`
              : "Adicione perfumes para montar seu pedido."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          {lines.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Sua sacola está vazia.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {lines.map((l) => (
                <li key={l.key} className="py-5">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[0.625rem] tracking-[0.25em] text-gold-foreground/70 uppercase">
                        {l.brand}
                      </p>
                      <p className="font-display text-xl leading-tight">{l.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {l.variantLabel} · {formatPrice(l.unitPrice)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(l.key)}
                      aria-label={`Remover ${l.name}`}
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="mx-auto size-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button
                        type="button"
                        onClick={() => setQty(l.key, l.qty - 1)}
                        aria-label="Diminuir quantidade"
                        className="h-8 w-8"
                      >
                        <Minus className="mx-auto size-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm" aria-live="polite">
                        {l.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(l.key, l.qty + 1)}
                        aria-label="Aumentar quantidade"
                        className="h-8 w-8"
                      >
                        <Plus className="mx-auto size-3.5" />
                      </button>
                    </div>
                    <p className="font-medium text-primary">{formatPrice(l.unitPrice * l.qty)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-border p-6">
            <div className="flex items-baseline justify-between">
              <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                Total
              </span>
              <span className="font-display text-3xl font-semibold text-primary">
                {formatPrice(total)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Frete e prazo combinados no atendimento.
            </p>
            <a
              href={orderWhatsAppLink(lines)}
              target="_blank"
              rel="noopener noreferrer"
              className="shimmer-gold mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3.5 text-[0.6875rem] font-semibold tracking-[0.16em] text-primary-foreground uppercase transition-all hover:bg-bordeaux-deep"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Enviar pedido no WhatsApp
            </a>
            <button
              type="button"
              onClick={clear}
              className="mt-3 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Esvaziar sacola
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
