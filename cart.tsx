import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/catalog";
import type { Variant } from "./variants";
import { cartCount, cartTotal, type CartLine } from "./order-message";

const STORAGE_KEY = "leal-cart-v1";

interface CartApi {
  lines: CartLine[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (product: Product, variant: Variant) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Hidratação só no cliente (evita divergência SSR). Preferência do cliente, nunca dado sensível.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed))
        setLines(parsed.filter((l): l is CartLine => l && typeof l.key === "string" && l.qty > 0));
    } catch {
      /* storage indisponível: segue com sacola vazia */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, ready]);

  const add = useCallback((product: Product, variant: Variant) => {
    const key = `${product.id}|${variant.id}`;
    setLines((prev) =>
      prev.some((l) => l.key === key)
        ? prev.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + 1, 20) } : l))
        : [
            ...prev,
            {
              key,
              productId: product.id,
              name: product.name,
              brand: product.brand,
              variantId: variant.id,
              variantLabel: variant.label,
              unitPrice: variant.price,
              qty: 1,
            },
          ],
    );
    setOpen(true);
  }, []);
  const setQty = useCallback(
    (key: string, qty: number) =>
      setLines((prev) =>
        qty <= 0
          ? prev.filter((l) => l.key !== key)
          : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, 20) } : l)),
      ),
    [],
  );
  const remove = useCallback(
    (key: string) => setLines((prev) => prev.filter((l) => l.key !== key)),
    [],
  );
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartApi>(
    () => ({
      lines,
      count: cartCount(lines),
      total: cartTotal(lines),
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, open, add, setQty, remove, clear],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
