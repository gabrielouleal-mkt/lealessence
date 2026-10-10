import { useEffect } from "react";

/**
 * Observa elementos com a classe `.reveal` e adiciona `.is-visible`
 * quando entram na viewport. Uma única instância por página.
 */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    const mutations = new MutationObserver((entries) => {
      for (const entry of entries) {
        entry.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(".reveal")) io.observe(node);
          node.querySelectorAll(".reveal").forEach((el) => io.observe(el));
        });
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mutations.disconnect(); };
  }, []);
}
