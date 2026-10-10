import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Database } from '@/integrations/supabase/types';
import type { Product } from '@/data/catalog';
import { productInput } from './product-rules';

export const listProducts = createServerFn({ method: 'GET' }).handler(async (): Promise<Product[]> => {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error('Catálogo temporariamente indisponível.');
  const client = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => {
    const headers = new Headers(init?.headers);
    if (headers.get('Authorization') === `Bearer ${key}` && key.startsWith('sb_')) headers.delete('Authorization');
    headers.set('apikey', key);
    return fetch(input, { ...init, headers });
  } } });
  const { data, error } = await client.from('products').select('*').order('sort_order').order('created_at');
  if (error) throw new Error('Não foi possível carregar o catálogo.');
  return Promise.all((data ?? []).map(async (p) => {
    let image = p.image;
    if (image.startsWith('storage:')) {
      const { data: signed } = await client.storage.from('product-images').createSignedUrl(image.slice(8), 3600);
      if (signed) image = signed.signedUrl.replace(url, import.meta.env.VITE_SUPABASE_URL);
    }
    return { id: p.id, name: p.name, brand: p.brand, category: p.category as Product['category'], price: Number(p.price), originalPrice: p.original_price === null ? undefined : Number(p.original_price), onSale: p.original_price !== null, description: p.description, featured: p.featured, available: p.available, stock: p.stock, image, imageSource: p.image };
  }));
});

export const claimAdmin = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.rpc('claim_store_owner');
  if (error || !data) throw new Error('Acesso restrito à conta Google autorizada.');
  return { allowed: true };
});

export const saveProduct = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((input: unknown) => productInput.parse(input)).handler(async ({ context, data }) => {
  const { data: allowed } = await context.supabase.rpc('is_store_admin');
  if (!allowed) throw new Error('Acesso negado.');
  const { id, ...values } = data;
  const { error } = id
    ? await context.supabase.from('products').update({ ...values, updated_at: new Date().toISOString() }).eq('id', id)
    : await context.supabase.from('products').insert(values);
  if (error) throw new Error('Não foi possível salvar o perfume. Verifique os dados.');
  return { ok: true };
});

export const deleteProduct = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((id: string) => id).handler(async ({ context, data }) => {
  const { data: allowed } = await context.supabase.rpc('is_store_admin');
  if (!allowed) throw new Error('Acesso negado.');
  const { error } = await context.supabase.from('products').delete().eq('id', data);
  if (error) throw new Error('Não foi possível excluir o perfume.');
  return { ok: true };
});