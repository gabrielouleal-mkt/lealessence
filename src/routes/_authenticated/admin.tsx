import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, LogOut, Search, Upload, X } from 'lucide-react';
import { productsQuery } from '@/lib/products-query';
import { claimAdmin, saveProduct, deleteProduct } from '@/lib/products.functions';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice, LOGO_URL, type Product } from '@/data/catalog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { productInput } from '@/lib/product-rules';

export const Route = createFileRoute('/_authenticated/admin')({
  loader: async ({ context }) => { await claimAdmin(); await context.queryClient.ensureQueryData(productsQuery); },
  head: () => ({ meta: [{ title: 'Gerenciar perfumes — Leal Essence' }, { name: 'description', content: 'Gerenciamento reservado do catálogo Leal Essence.' }, { property: 'og:title', content: 'Gerenciar perfumes — Leal Essence' }, { property: 'og:description', content: 'Produtos, fotos e destaques da Leal Essence.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex' }] }),
  errorComponent: () => <main className="min-h-screen bg-background px-5 py-24 text-center"><h1 className="font-display text-4xl text-foreground">Acesso restrito</h1><p className="mt-4 text-muted-foreground">Entre com a conta Google autorizada.</p><Link to="/auth" className="mt-8 inline-block text-primary underline">Trocar de conta</Link></main>,
  component: Admin,
});

function Admin() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const queryClient = useQueryClient(); const navigate = useNavigate();
  const [query, setQuery] = useState(''); const [brand, setBrand] = useState(''); const [availability, setAvailability] = useState('');
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<Product | null>(null); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [notice, setNotice] = useState('');
  const filtered = products.filter(p => (!brand || p.brand === brand) && (!availability || (availability === 'available' ? p.available === true : p.available === false)) && `${p.name} ${p.brand}`.toLowerCase().includes(query.toLowerCase()));
  async function signOut() { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); await navigate({ to: '/auth', replace: true }); }
  async function remove() {
    if (!deleting) return; setBusy(true); setError('');
    try { await deleteProduct({ data: deleting.id }); await queryClient.invalidateQueries({ queryKey: ['products'] }); setDeleting(null); setNotice('Perfume excluído.'); }
    catch { setError('Não foi possível excluir. Tente novamente.'); } finally { setBusy(false); }
  }
  return <div className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border bg-card"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5"><Link to="/"><img src={LOGO_URL} alt="Leal Essence" className="h-14 w-auto" /></Link><div className="flex gap-3"><Button variant="outline" asChild><Link to="/">Ver catálogo</Link></Button><Button variant="ghost" onClick={signOut}><LogOut className="size-4" />Sair</Button></div></div></header>
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">Administração</p><h1 className="font-display mt-3 text-4xl">Perfumes</h1><p className="mt-2 text-sm text-muted-foreground">{products.length} produtos no catálogo</p></div><Button onClick={() => { setEditing(null); setNotice(''); }}><Plus className="size-4" />Adicionar perfume</Button></div>
      {notice && <p role="status" className="mt-6 text-sm text-primary">{notice}</p>}
      <div className="my-8 flex flex-wrap gap-3"><label className="relative min-w-48 flex-1"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="Buscar produtos" value={query} onChange={e => setQuery(e.target.value)} className="pl-10" placeholder="Buscar nome ou marca" /></label><select aria-label="Filtrar marca" className="rounded-md border border-input bg-background px-3 text-sm" value={brand} onChange={e => setBrand(e.target.value)}><option value="">Todas as marcas</option>{[...new Set(products.map(p => p.brand))].map(b => <option key={b}>{b}</option>)}</select><select aria-label="Filtrar disponibilidade" className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={availability} onChange={e => setAvailability(e.target.value)}><option value="">Todas as disponibilidades</option><option value="available">Disponíveis</option><option value="unavailable">Indisponíveis</option></select></div>
      <div className="divide-y divide-border border-y border-border">{filtered.map(p => <article key={p.id} className="flex flex-wrap items-center gap-4 py-5"><img src={p.image} alt={p.name} className="size-20 rounded-md object-contain bg-cream" /><div className="min-w-32 flex-1"><p className="text-xs text-muted-foreground">{p.brand} · {p.category}</p><h2 className="font-display text-2xl">{p.name}</h2><p className="text-sm text-primary">{formatPrice(p.price)} {p.originalPrice && <del className="ml-2 text-muted-foreground">{formatPrice(p.originalPrice)}</del>}</p><p className="mt-1 text-xs text-muted-foreground">{p.available === null ? 'Disponibilidade não informada' : p.available ? 'Disponível' : 'Indisponível'}{p.stock !== null && p.stock !== undefined ? ` · Estoque: ${p.stock}` : ''}{p.featured ? ' · Destaque' : ''}</p></div><div className="flex gap-2"><Button variant="outline" size="icon" title="Editar perfume" aria-label={`Editar ${p.name}`} onClick={() => setEditing(p)}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" title="Excluir perfume" aria-label={`Excluir ${p.name}`} onClick={() => { setDeleting(p); setError(''); }}><Trash2 className="size-4 text-destructive" /></Button></div></article>)}</div>
      {!filtered.length && <p className="py-12 text-center text-muted-foreground">Nenhum perfume encontrado.</p>}
    </main>
    <Dialog open={editing !== undefined} onOpenChange={open => { if (!open) setEditing(undefined); }}><DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle className="font-display text-3xl">{editing ? 'Editar perfume' : 'Adicionar perfume'}</DialogTitle></DialogHeader>{editing !== undefined && <ProductForm key={editing?.id ?? 'new'} product={editing} onSaved={async () => { await queryClient.invalidateQueries({ queryKey: ['products'] }); setEditing(undefined); setNotice('Perfume salvo no catálogo.'); }} />}</DialogContent></Dialog>
    <Dialog open={!!deleting} onOpenChange={open => { if (!open && !busy) setDeleting(null); }}><DialogContent><DialogHeader><DialogTitle>Excluir {deleting?.name}?</DialogTitle></DialogHeader><p className="text-sm text-muted-foreground">O perfume será removido do catálogo. Esta ação não pode ser desfeita.</p>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<div className="flex justify-end gap-3"><Button variant="outline" disabled={busy} onClick={() => setDeleting(null)}>Cancelar</Button><Button variant="destructive" disabled={busy} onClick={remove}>{busy ? 'Excluindo…' : 'Excluir perfume'}</Button></div></DialogContent></Dialog>
  </div>;
}

function ProductForm({ product, onSaved }: { product: Product | null; onSaved: () => Promise<void> }) {
  const [image, setImage] = useState(product?.imageSource ?? product?.image ?? ''); const [preview, setPreview] = useState(product?.image ?? ''); const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); setBusy(true); setError('');
    try {
      let source = image;
      if (file) {
        if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) throw new Error('Envie JPG, PNG ou WebP de até 5 MB.');
        const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'; const path = `${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file, { contentType: file.type, upsert: false });
        if (uploadError) throw new Error('Não foi possível enviar a foto.'); source = `storage:${path}`; setImage(source);
      }
      const number = (name: string) => Number(String(form.get(name)).replace(',', '.'));
      const sale = String(form.get('sale') ?? '').trim(); const stock = String(form.get('stock') ?? '').trim();
      const parsed = productInput.safeParse({ ...(product ? { id: product.id } : {}), name: form.get('name'), brand: form.get('brand'), description: form.get('description'), category: form.get('category'), price: sale ? number('sale') : number('price'), original_price: sale ? number('price') : null, image: source, featured: form.has('featured'), available: form.get('available') === '' ? null : form.get('available') === 'true', stock: stock ? number('stock') : null });
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? 'Confira os dados.');
      await saveProduct({ data: parsed.data }); await onSaved();
    } catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível salvar.'); } finally { setBusy(false); }
  }
  const inputClass = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground';
  return <form onSubmit={submit} className="space-y-5">
    <div className="flex items-center gap-5"><div className="flex size-28 shrink-0 items-center justify-center rounded-md bg-cream">{preview ? <img src={preview} alt="Foto do perfume" className="size-full object-contain" /> : <Upload className="size-6 text-muted-foreground" />}</div><label className="flex-1 text-sm">Foto do perfume<input type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} className="mt-2 block w-full text-xs" onChange={e => { const next = e.target.files?.[0]; if (!next) return; if (next.size > 5 * 1024 * 1024) { setError('A foto deve ter até 5 MB.'); return; } setFile(next); const reader = new FileReader(); reader.onload = () => { if (typeof reader.result === 'string') setPreview(reader.result); }; reader.readAsDataURL(next); }} /></label></div>
    <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm">Nome<Input name="name" required maxLength={120} defaultValue={product?.name} className="mt-1" /></label><label className="text-sm">Marca<Input name="brand" required maxLength={100} defaultValue={product?.brand} className="mt-1" /></label></div>
    <label className="block text-sm">Descrição<textarea name="description" rows={4} maxLength={5000} defaultValue={product?.description} className={`${inputClass} mt-1`} /></label>
    <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm">Categoria<select name="category" defaultValue={product?.category ?? 'masculinos'} className={`${inputClass} mt-1`}><option value="masculinos">Masculinos</option><option value="femininos">Femininos</option><option value="unissex">Unissex</option></select></label><label className="text-sm">Disponibilidade<select name="available" defaultValue={product?.available == null ? '' : String(product.available)} className={`${inputClass} mt-1`}><option value="">Não informada</option><option value="true">Disponível</option><option value="false">Indisponível</option></select></label><label className="text-sm">Preço normal (R$)<Input name="price" type="number" min="0" step="0.01" required defaultValue={product?.originalPrice ?? product?.price} className="mt-1" /></label><label className="text-sm">Preço promocional (R$)<Input name="sale" type="number" min="0" step="0.01" defaultValue={product?.originalPrice ? product.price : ''} className="mt-1" /></label><label className="text-sm">Quantidade em estoque<Input name="stock" type="number" min="0" step="1" defaultValue={product?.stock ?? ''} className="mt-1" /></label><label className="flex items-center gap-3 text-sm"><input type="checkbox" name="featured" defaultChecked={product?.featured} className="size-4 accent-primary" />Destaque na página inicial</label></div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}<div className="flex justify-end border-t border-border pt-5"><Button type="submit" disabled={busy}>{busy ? 'Salvando…' : 'Salvar perfume'}</Button></div>
  </form>;
}