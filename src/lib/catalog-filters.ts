import type { Product, Category } from '@/data/catalog';

export function normalizeBrand(brand: string) {
  return brand.trim().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, ' ').toLowerCase();
}

export function filterProducts(products: Product[], { brand, category = 'todos', query = '' }: { brand: string | null; category?: Category | 'todos'; query?: string }) {
  const search = normalizeBrand(query);
  return products.filter(p => (category === 'todos' || category === p.category)
    && (!brand || normalizeBrand(p.brand) === normalizeBrand(brand))
    && (!search || normalizeBrand(`${p.name} ${p.brand}`).includes(search)));
}