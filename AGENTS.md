<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Prototype architecture
- Keep catalog data in a browser-safe shared module and presentational components separate from the home route so the independent prototype can be adapted without Base44 access.
- Use only external WhatsApp links for commercial inquiries; no checkout is implemented.
- Use Cloud-backed product reads through one shared query and authenticated server functions for product mutations, preserving the existing presentation.
- Authorize administration with a protected role plus a verified Google identity check in database functions and RLS, never user-editable metadata.
- Store new product photos in private Storage and resolve signed read URLs for the public catalog because public buckets are workspace-blocked.
- Store the optional alternative photo separately from the cover and resolve both through the shared product query; all product cards share the same photo transition so gallery behavior stays consistent.
- Normalize brand matching in the shared catalog filter; all desktop and touch brand shortcuts use the home selection callback so empty-result brands remain real filters.
- Selected brand lives in the URL (`/?marca=Armaf`); rails, mobile marquee and catalog chips share the same `filterProducts` (normalized brand match). Brands from the database that are missing from the decorative rail lists are appended to the shorter column.
- Fragrance notes, decant prices and FAQ answers are plain editable TS data (`fragrance-profiles.ts`, `variants.ts`, `Faq.tsx`); never invent values, a product without an entry simply shows no pyramid/selector.
- The bag is client-only (localStorage `leal-cart-v1`) and ends in a wa.me link; there is no checkout.
