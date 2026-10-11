import { useEffect, useRef } from "react";
import heroPerfume from "@/assets/hero-perfume.jpg";
import { WHATSAPP_INDICATION } from "@/data/catalog";

/** Partículas douradas determinísticas (posições fixas, sem random em render). */
const PARTICLES = [
  { left: "12%", top: "70%", size: 5, delay: "0s", dur: "9s" },
  { left: "22%", top: "82%", size: 3, delay: "1.4s", dur: "11s" },
  { left: "38%", top: "76%", size: 4, delay: "2.8s", dur: "8s" },
  { left: "55%", top: "85%", size: 3, delay: "0.8s", dur: "10s" },
  { left: "68%", top: "72%", size: 5, delay: "3.6s", dur: "9.5s" },
  { left: "80%", top: "80%", size: 3, delay: "2s", dur: "12s" },
  { left: "90%", top: "68%", size: 4, delay: "4.4s", dur: "8.5s" },
  { left: "30%", top: "88%", size: 2, delay: "5.2s", dur: "10.5s" },
];

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<HTMLDivElement>(null);

  // Parallax discreto conforme o mouse
  useEffect(() => {
    const stage = stageRef.current;
    const layers = layersRef.current;
    if (!stage || !layers) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        layers.style.setProperty("--px", x.toFixed(3));
        layers.style.setProperty("--py", y.toFixed(3));
      });
    };
    stage.addEventListener("mousemove", onMove);
    return () => {
      stage.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="inicio"
      ref={stageRef}
      className="relative overflow-hidden pt-16 md:pt-20"
      aria-label="Apresentação Leal Essence"
    >
      {/* Fundo: brilho radial creme + arco bordô */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_40%,color-mix(in_oklab,var(--color-gold)_10%,transparent),transparent_70%)]" />
        <div className="absolute -top-40 -right-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-primary)_12%,transparent),transparent_65%)]" />
        <div className="absolute -bottom-32 -left-32 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-primary)_8%,transparent),transparent_65%)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pt-10 pb-16 md:grid-cols-2 md:gap-8 md:px-8 md:pt-16 md:pb-24 lg:gap-16">
        {/* Coluna textual — preservada do site original */}
        <div className="relative z-10">
          <p
            className="eyebrow animate-hero-fade-up"
            style={{ "--hero-delay": "0.1s" } as React.CSSProperties}
          >
            Perfumes árabes &amp; importados
          </p>
          <div
            className="mt-4 h-px w-16 bg-gold animate-draw-line"
            aria-hidden="true"
          />
          <h1
            className="font-display mt-6 text-5xl leading-[1.05] font-medium tracking-tight text-balance text-foreground animate-hero-fade-up sm:text-6xl lg:text-7xl"
            style={{ "--hero-delay": "0.25s" } as React.CSSProperties}
          >
            Seu próximo perfume{" "}
            <em className="text-primary italic">começa aqui.</em>
          </h1>
          <p
            className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground animate-hero-fade-up md:text-lg"
            style={{ "--hero-delay": "0.4s" } as React.CSSProperties}
          >
            Fragrâncias marcantes, preços competitivos e atendimento de
            verdade. Encontre seu próximo perfume no catálogo ou fale com a
            gente para receber uma indicação.
          </p>
          <div
            className="mt-9 flex flex-wrap items-center gap-4 animate-hero-fade-up"
            style={{ "--hero-delay": "0.55s" } as React.CSSProperties}
          >
            <a
              href="#catalogo"
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-xs font-semibold tracking-[0.18em] text-primary-foreground uppercase transition-all duration-300 hover:bg-bordeaux-deep hover:shadow-[0_16px_32px_-12px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]"
            >
              Ver catálogo
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </a>
            <a
              href={WHATSAPP_INDICATION}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-7 py-3.5 text-xs font-semibold tracking-[0.18em] text-primary uppercase transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              Quero indicação
            </a>
          </div>
          <p
            className="mt-8 flex items-center gap-2 text-[0.6875rem] tracking-[0.24em] text-muted-foreground uppercase animate-hero-fade-up"
            style={{ "--hero-delay": "0.7s" } as React.CSSProperties}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
            Atendimento direto · Resposta rápida
          </p>
        </div>

        {/* Composição visual — campanha premium */}
        <div
          ref={layersRef}
          className="relative mx-auto w-full max-w-md animate-hero-fade-up md:max-w-none"
          style={{ "--hero-delay": "0.35s" } as React.CSSProperties}
        >
          {/* Anel decorativo bordô (camada de fundo, parallax invertido) */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            style={{
              transform:
                "translate(calc(var(--px, 0) * -18px), calc(var(--py, 0) * -14px))",
              transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            aria-hidden="true"
          >
            <div className="h-[92%] w-[92%] rounded-full border border-primary/15" />
            <div className="absolute h-[70%] w-[70%] rounded-full border border-gold/25" />
          </div>

          {/* Frasco protagonista */}
          <div
            className="relative"
            style={{
              transform:
                "translate(calc(var(--px, 0) * 12px), calc(var(--py, 0) * 10px))",
              transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <div className="animate-float-bottle relative overflow-hidden rounded-[2rem] shadow-[0_48px_80px_-32px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]">
              <img
                src={heroPerfume}
                alt="Frasco de perfume bordô com tampa dourada sobre pedestal de mármore — composição de campanha Leal Essence"
                className="aspect-[4/5] w-full object-cover"
                width={1024}
                height={1280}
                fetchPriority="high"
              />
              {/* Brilho que atravessa a imagem */}
              <div
                className="animate-sheen pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                aria-hidden="true"
              />
              {/* Vinheta suave nas bordas */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-primary/10 ring-inset"
                aria-hidden="true"
              />
            </div>

            {/* Cartão flutuante */}
            <div
              className="absolute -bottom-5 -left-4 rounded-2xl border border-border bg-card/90 px-5 py-4 shadow-[0_20px_40px_-16px_color-mix(in_oklab,var(--color-primary)_30%,transparent)] backdrop-blur-md md:-left-10"
              style={{
                transform:
                  "translate(calc(var(--px, 0) * -8px), calc(var(--py, 0) * -6px))",
                transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <p className="text-[0.625rem] tracking-[0.28em] text-muted-foreground uppercase">
                Arte conceitual · Curadoria
              </p>
              <p className="font-display mt-1 text-lg leading-tight text-primary italic">
                Lattafa · Rasasi · Armaf
              </p>
            </div>
          </div>

          {/* Partículas douradas */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {PARTICLES.map((p, i) => (
              <span
                key={i}
                className="animate-particle absolute rounded-full bg-gold"
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  animationDelay: p.delay,
                  animationDuration: p.dur,
                  boxShadow: "0 0 8px 1px color-mix(in oklab, var(--color-gold) 60%, transparent)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
