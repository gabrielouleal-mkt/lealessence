import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/products-query";
import { recommend, type QuizAnswers } from "@/lib/quiz";
import { formatPrice, WHATSAPP_INDICATION } from "@/data/catalog";
import { getVariants } from "@/lib/variants";
import { useCart } from "@/lib/cart";

const STEPS = [
  {
    key: "gender",
    title: "Para quem é o perfume?",
    options: [
      ["masculinos", "Masculino"],
      ["femininos", "Feminino"],
      ["qualquer", "Tanto faz"],
    ],
  },
  {
    key: "moment",
    title: "Quando você vai usar?",
    options: [
      ["dia", "No dia a dia"],
      ["noite", "À noite e em eventos"],
      ["ambos", "Em qualquer momento"],
    ],
  },
  {
    key: "style",
    title: "Qual aroma combina com você?",
    options: [
      ["especiado", "Especiado e quente"],
      ["doce", "Doce e envolvente"],
      ["fresco", "Fresco e leve"],
      ["amadeirado", "Amadeirado e elegante"],
      ["floral", "Floral"],
    ],
  },
] as const;

export function Quiz() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const { add } = useCart();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});

  const done = step >= STEPS.length;
  const results = done ? recommend(products, answers as QuizAnswers) : [];
  const current = STEPS[Math.min(step, STEPS.length - 1)]!;

  return (
    <section id="quiz" className="scroll-mt-20 border-y border-border bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
        <p className="eyebrow">Quiz olfativo</p>
        <h2 className="font-display mt-3 text-4xl font-medium text-foreground md:text-5xl">
          Descubra seu perfume ideal em 3 passos
        </h2>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-left md:p-10">
          {!done ? (
            <>
              <div className="flex items-center justify-between text-[0.6875rem] tracking-[0.22em] text-muted-foreground uppercase">
                <span>
                  Passo {step + 1} de {STEPS.length}
                </span>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Voltar
                  </button>
                )}
              </div>
              <div className="mt-3 h-px w-full bg-border" aria-hidden="true">
                <div
                  className="h-px bg-gold transition-all duration-500"
                  style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                />
              </div>
              <h3 className="font-display mt-6 text-3xl">{current.title}</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {current.options.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setAnswers((a) => ({ ...a, [current.key]: value }));
                      setStep(step + 1);
                    }}
                    className="rounded-xl border border-border px-5 py-4 text-left text-sm transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 className="font-display text-3xl">Nossas sugestões para você</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Selecionadas do catálogo com base nas fichas olfativas cadastradas.
              </p>
              {results.length === 0 ? (
                <p className="mt-6 text-sm text-muted-foreground">
                  Não encontramos uma combinação exata. Fale com a gente para receber uma indicação.
                </p>
              ) : (
                <ul className="mt-6 divide-y divide-border">
                  {results.map(({ product, score }) => (
                    <li key={product.id} className="flex flex-wrap items-center gap-4 py-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="size-16 rounded-md bg-cream object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-32 flex-1">
                        <p className="text-[0.625rem] tracking-[0.25em] text-gold-foreground/70 uppercase">
                          {product.brand}
                          {score >= 5 ? " · Combinação ideal" : ""}
                        </p>
                        <p className="font-display text-xl">{product.name}</p>
                        <p className="text-sm text-primary">{formatPrice(product.price)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => add(product, getVariants(product)[0]!)}
                        className="shimmer-gold rounded-full bg-primary px-4 py-2.5 text-[0.6875rem] font-semibold tracking-[0.16em] text-primary-foreground uppercase"
                      >
                        Adicionar à sacola
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6 flex flex-wrap gap-4 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
                <button
                  type="button"
                  onClick={() => {
                    setStep(0);
                    setAnswers({});
                  }}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Refazer quiz
                </button>
                <a
                  href={WHATSAPP_INDICATION}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Pedir indicação no WhatsApp
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
