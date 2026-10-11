import type { Product, Category } from '@/data/catalog';

export function normalizeBrand(brand: string) {
  return brand.trim().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, ' ').toLowerCase();
}

export type CategoryFilter = Category | 'todos';

export function filterProducts(
  products: Product[],
  { brand, category = 'todos', query = '', families = [], familyOf }: {
    brand: string | null; category?: CategoryFilter; query?: string;
    /** Famílias olfativas selecionadas (OU). Produto sem ficha não aparece quando há família ativa. */
    families?: string[]; familyOf?: (p: Product) => string[];
  },
) {
  const search = normalizeBrand(query);
  return products.filter(p => (category === 'todos' || category === p.category)
    && (!brand || normalizeBrand(p.brand) === normalizeBrand(brand))
    && (!search || normalizeBrand(`${p.name} ${p.brand}`).includes(search))
    && (!families.length || (familyOf?.(p) ?? []).some(f => families.includes(f))));
}

/** Divide o texto em trechos para destacar a busca (sem acento/caixa), preservando o texto original. */
export function splitHighlight(text: string, query: string): Array<{ text: string; match: boolean }> {
  const q = normalizeBrand(query);
  if (!q) return [{ text, match: false }];
  // normalize NFD pode mudar comprimento; mapeamos índice a índice por caractere
  const chars = Array.from(text);
  const norm = chars.map(c => normalizeBrand(c) || '');
  const flat = norm.join('');
  const owner: number[] = [];
  norm.forEach((n, i) => { for (let k = 0; k < n.length; k++) owner.push(i); });
  const marks = new Set<number>();
  let from = 0;
  for (;;) {
    const at = flat.indexOf(q, from);
    if (at < 0) break;
    for (let k = at; k < at + q.length; k++) marks.add(owner[k]!);
    from = at + q.length;
  }
  const out: Array<{ text: string; match: boolean }> = [];
  chars.forEach((c, i) => {
    const match = marks.has(i);
    const last = out[out.length - 1];
    if (last && last.match === match) last.text += c; else out.push({ text: c, match });
  });
  return out;
}
