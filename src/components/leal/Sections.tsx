import {
  ABOUT_IMAGE_URL,
  LOGO_URL,
  PRODUCTS,
  WHATSAPP_GENERIC,
  WHATSAPP_INDICATION,
  WHATSAPP_KIT,
  whatsappLink,
} from "@/data/catalog";
import { ProductCard } from "./ProductCard";
import { WhatsAppIcon } from "./Header";

export function Benefits() {
  const items = [
    {
      title: "Produtos selecionados",
      text: "Fragrâncias escolhidas pela performance, pela originalidade e pela satisfação de quem usa.",
      icon: (
        <path d="M12 3l2.4 5.6L20 9.3l-4.3 3.9 1.2 5.8L12 16.2 7.1 19l1.2-5.8L4 9.3l5.6-.7z" />
      ),
    },
    {
      title: "Envio para todo o Brasil",
      text: "Combinamos a forma de envio direto no atendimento, de acordo com a sua região.",
      icon: (
        <>
          <path d="M3 7h11v9H3z" />
          <path d="M14 10h4l3 3v3h-7" />
          <circle cx="7" cy="17.5" r="1.5" />
          <circle cx="17" cy="17.5" r="1.5" />
        </>
      ),
    },
    {
      title: "Atendimento pessoal",
      text: "Você fala direto com quem entende de fragrância — sem robôs e sem respostas genéricas.",
      icon: <path d="M4 5h16v10H8l-4 4z" />,
    },
  ];
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-px px-5 md:grid-cols-3 md:px-8">
        {items.map((it, i) => (
          <div
            key={it.title}
            className="reveal group flex gap-4 py-8 md:px-6 md:py-10"
            style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/20 text-primary transition-all duration-500 group-hover:rotate-[8deg] group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                {it.icon}
              </svg>
            </span>
            <div>
              <h3 className="font-display text-xl font-medium text-foreground">{it.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{it.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Featured() {
  const featured = PRODUCTS.filter((p) => p.featured);
  return (
    <section id="destaques" className="scroll-mt-20 bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="reveal flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="eyebrow">Seleção da casa</p>
            <h2 className="font-display mt-3 text-4xl font-medium text-foreground md:text-5xl">
              Destaques da coleção
            </h2>
            <p className="mt-4 text-muted-foreground">
              Algumas fragrâncias em evidência na Leal Essence. Consulte o valor
              e a disponibilidade em um clique.
            </p>
          </div>
          <a
            href="#catalogo"
            className="group inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.2em] text-primary uppercase"
          >
            Ver catálogo completo
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
          </a>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Kits() {
  const kits = [
    {
      tag: "Experiência completa",
      title: "Kit perfume + creme",
      text: "Uma opção completa para presentear e aproveitar a fragrância por mais tempo.",
      bullets: ["Hidratação perfumada", "Maior fixação na pele"],
      cta: "Consultar kits no WhatsApp",
      href: WHATSAPP_KIT,
    },
    {
      tag: "Sob medida",
      title: "Monte seu kit",
      text: "Fale com a gente e montamos uma combinação conforme o seu estilo e o seu orçamento.",
      bullets: ["Escolha seus favoritos", "Embalagem para presente"],
      cta: "Montar no WhatsApp",
      href: WHATSAPP_KIT,
      highlight: true,
    },
    {
      tag: "Consultoria rápida",
      title: "Presente sem erro",
      text: "Conte para quem é o presente e nós ajudamos a escolher a fragrância certa.",
      bullets: ["Orientação por perfil", "Sem risco de errar o gosto"],
      cta: "Pedir indicação de presente",
      href: whatsappLink("Olá! Gostaria de uma indicação de perfume para presente."),
    },
  ];
  return (
    <section id="kits" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="eyebrow">Para presentear</p>
          <h2 className="font-display mt-3 text-4xl font-medium text-foreground md:text-5xl">
            Kits &amp; combinações
          </h2>
          <p className="mt-4 text-muted-foreground">
            Combinações pensadas para impressionar em momentos inesquecíveis ou
            para presentear quem você ama.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {kits.map((k, i) => (
            <div
              key={k.title}
              className={`reveal card-product flex flex-col p-8 ${k.highlight ? "bg-primary text-primary-foreground" : ""}`}
              style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
            >
              <p className={`text-[0.625rem] font-semibold tracking-[0.3em] uppercase ${k.highlight ? "text-gold" : "text-primary"}`}>
                {k.tag}
              </p>
              <h3 className="font-display mt-3 text-3xl font-medium">{k.title}</h3>
              <p className={`mt-3 text-sm leading-relaxed ${k.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {k.text}
              </p>
              <ul className="mt-6 space-y-2">
                {k.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-[0.6875rem] tracking-[0.18em] uppercase">
                    <span className="text-gold" aria-hidden="true">✦</span>
                    {b}
                  </li>
                ))}
              </ul>
              <a
                href={k.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase transition-all duration-300 active:scale-[0.98] ${
                  k.highlight
                    ? "bg-primary-foreground text-primary hover:bg-cream"
                    : "border border-primary/25 text-primary hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                {k.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IndicationBanner() {
  return (
    <section className="px-5 md:px-8">
      <div className="reveal relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-primary px-8 py-16 text-center text-primary-foreground md:px-16 md:py-20">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full border border-gold/30" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-primary-foreground/10" aria-hidden="true" />
        <p className="text-[0.6875rem] font-medium tracking-[0.32em] text-gold uppercase">
          Não sabe qual escolher?
        </p>
        <h2 className="font-display mx-auto mt-4 max-w-2xl text-4xl font-medium md:text-5xl">
          Deixa a gente escolher com você.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
          Me diga o que você gosta, quanto quer investir e para qual ocasião. A
          gente indica opções que fazem sentido.
        </p>
        <a
          href={WHATSAPP_INDICATION}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-9 inline-flex items-center gap-3 rounded-full bg-primary-foreground px-8 py-4 text-xs font-semibold tracking-[0.18em] text-primary uppercase transition-all duration-300 hover:bg-cream hover:shadow-[0_16px_40px_-12px_color-mix(in_oklab,var(--color-bordeaux-deep)_70%,transparent)]"
        >
          <WhatsAppIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          Receber uma indicação
        </a>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="marca" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:gap-16 md:px-8">
        <div className="reveal relative">
          <img
            src={ABOUT_IMAGE_URL}
            alt="Detalhe de frasco de perfume árabe com filigrana dourada, madeira de oud e pétalas"
            loading="lazy"
            width={928}
            height={1152}
            className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[0_40px_70px_-30px_color-mix(in_oklab,var(--color-primary)_40%,transparent)]"
          />
          <div className="absolute -right-4 -bottom-6 hidden h-32 w-32 rounded-full border border-gold/40 md:block" aria-hidden="true" />
        </div>
        <div className="reveal" style={{ "--reveal-delay": "150ms" } as React.CSSProperties}>
          <p className="eyebrow">Sobre a Leal Essence</p>
          <h2 className="font-display mt-3 text-4xl leading-tight font-medium text-foreground md:text-5xl">
            Perfume bom é aquele que <em className="text-primary italic">combina com você.</em>
          </h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            A Leal Essence nasceu para facilitar a compra de perfumes árabes e
            importados no Brasil, com curadoria de fragrâncias, preço justo e
            atendimento próximo. Aqui você não precisa escolher sozinho.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Acreditamos que o perfume é uma extensão da sua identidade. Por isso,
            oferecemos uma consultoria humana que entende suas preferências para
            indicar fragrâncias com excelente projeção, fixação e presença marcante.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-8">
            <div>
              <h3 className="font-display text-xl text-foreground">Curadoria rigorosa</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Fragrâncias selecionadas pela performance, originalidade e satisfação de quem usa.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl text-foreground">Preço justo e competitivo</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Acesso às marcas mais prestigiadas com valores que fazem sentido.
              </p>
            </div>
          </div>
          <a
            href={WHATSAPP_INDICATION}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-xs font-semibold tracking-[0.18em] text-primary-foreground uppercase transition-all duration-300 hover:bg-bordeaux-deep"
          >
            Pedir uma indicação
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="contato" className="scroll-mt-20 border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-14 text-center md:px-8">
        <img src={LOGO_URL} alt="Leal Essence — Perfumaria Fina" loading="lazy" className="h-16 w-auto" width={96} height={64} />
        <p className="max-w-md text-sm text-muted-foreground">
          Perfumes árabes &amp; importados com curadoria e atendimento de verdade.
        </p>
        <a
          href={WHATSAPP_GENERIC}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-primary/25 px-6 py-3 text-[0.6875rem] font-semibold tracking-[0.18em] text-primary uppercase transition-all hover:bg-primary hover:text-primary-foreground"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Falar no WhatsApp
        </a>
        <p className="text-[0.625rem] tracking-[0.24em] text-muted-foreground/70 uppercase">
          Protótipo experimental · Marcas laterais em representação tipográfica
        </p>
      </div>
    </footer>
  );
}
