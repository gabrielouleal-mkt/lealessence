import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WHATSAPP_GENERIC } from "@/data/catalog";

/**
 * Respostas escritas para NÃO prometer nada que a loja não confirmou:
 * prazo, frete e pagamento são combinados no atendimento (mesmo texto já usado em "Envio para todo o Brasil").
 * Edite as respostas abaixo quando quiser detalhar políticas fixas (ex.: Pix, cartão, prazos por região).
 */
export const FAQ_ITEMS = [
  {
    q: "Os perfumes são originais?",
    a: "Trabalhamos com perfumes árabes e importados das marcas exibidas no catálogo, selecionados pela performance e pela originalidade. Se quiser saber a procedência de um item específico, pergunte pelo WhatsApp antes de fechar o pedido.",
  },
  {
    q: "Qual é o prazo de envio?",
    a: "Enviamos para todo o Brasil. O prazo e a forma de envio variam conforme a sua região e são combinados direto no atendimento, antes de você confirmar o pedido.",
  },
  {
    q: "Quais são as formas de pagamento?",
    a: "O pagamento é combinado no WhatsApp, junto com a confirmação do pedido. Não há checkout automático no site: você monta a sacola, envia o pedido e finalizamos com você.",
  },
  {
    q: "Como funciona a sacola?",
    a: "Você adiciona os perfumes, vê o total e toca em “Enviar pedido no WhatsApp”. O pedido já vai formatado para a nossa conversa, e confirmamos disponibilidade e detalhes com você.",
  },
  {
    q: "Como escolho um perfume?",
    a: "Use os filtros por gênero, marca e família olfativa, abra “Ver detalhes” para conhecer as notas, ou faça o quiz. Se preferir, peça uma indicação personalizada no WhatsApp.",
  },
] as const;

export function Faq() {
  return (
    <section id="duvidas" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <div className="text-center">
          <p className="eyebrow">Dúvidas frequentes</p>
          <h2 className="font-display mt-3 text-4xl font-medium text-foreground md:text-5xl">
            Antes de pedir
          </h2>
        </div>
        <Accordion
          type="single"
          collapsible
          className="mt-10 rounded-2xl border border-border bg-card px-6"
        >
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger className="font-display text-left text-xl font-medium hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Ficou com outra dúvida?{" "}
          <a
            href={WHATSAPP_GENERIC}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4"
          >
            Fale com a gente no WhatsApp
          </a>
          .
        </p>
      </div>
    </section>
  );
}
