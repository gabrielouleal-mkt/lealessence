import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { lovable } from '@/integrations/lovable';
import { supabase } from '@/integrations/supabase/client';
import { claimAdmin } from '@/lib/products.functions';
import { Button } from '@/components/ui/button';
import { LOGO_URL } from '@/data/catalog';

export const Route = createFileRoute('/auth')({
  head: () => ({ meta: [{ title: 'Acesso administrativo — Leal Essence' }, { name: 'description', content: 'Acesso Google exclusivo à administração da Leal Essence.' }, { property: 'og:title', content: 'Acesso administrativo — Leal Essence' }, { property: 'og:description', content: 'Administração protegida do catálogo Leal Essence.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex' }] }),
  component: Auth,
});
function Auth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState('');
  async function checkAccess() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    setSignedIn(true);
    try { await claimAdmin(); await navigate({ to: '/admin', replace: true }); }
    catch { setError('Acesso negado. Esta conta Google não está autorizada.'); }
  }
  useEffect(() => { void checkAccess(); }, []);
  async function signIn() {
    setBusy(true); setError('');
    try {
      const result = await lovable.auth.signInWithOAuth('google', { redirect_uri: `${window.location.origin}/auth`, extraParams: { prompt: 'select_account' } });
      if (result.error) throw result.error;
      if (!result.redirected) await checkAccess();
    } catch { setError('Não foi possível entrar. Tente novamente.'); }
    finally { setBusy(false); }
  }
  async function switchAccount() {
    await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut();
    setSignedIn(false); setError(''); await navigate({ to: '/auth', replace: true });
  }
  return <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-12 text-center">
    <Link to="/"><img src={LOGO_URL} alt="Leal Essence" className="h-24 w-auto" /></Link>
    <p className="eyebrow mt-12">Área reservada</p><h1 className="font-display mt-3 text-4xl text-foreground">Administração</h1>
    <p className="mt-4 max-w-sm text-sm text-muted-foreground">Acesso exclusivo à conta Google autorizada da Leal Essence.</p>
    {error && <p role="alert" className="mt-6 max-w-sm text-sm text-destructive">{error}</p>}
    {signedIn ? <Button className="mt-8" variant="outline" onClick={switchAccount}>Sair e trocar de conta</Button> : <Button className="mt-8 gap-3" onClick={signIn} disabled={busy}><span aria-hidden="true" className="text-lg font-semibold">G</span>{busy ? 'Entrando…' : 'Entrar com Google'}</Button>}
    <Link to="/" className="mt-8 text-sm text-muted-foreground hover:text-primary">Voltar ao catálogo</Link>
  </main>;
}