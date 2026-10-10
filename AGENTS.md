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
