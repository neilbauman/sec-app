# SSC App (Clean Starter)

**Goal:** stable deploy on Vercel with Primary Framework Editor UI, no Supabase coupling yet.

## What's included
- `/auth/set-role` route to set `role` cookie (Dashboard has a link)
- `/framework/api/list` serves static demo data for pillars/themes/subthemes
- Primary editor UI in `components/PrimaryFrameworkCards.tsx` (default collapsed, tags, simple chevrons)
- `internalGet<T>()` returns parsed JSON to avoid Response typing issues
- Async `getCurrentRole()` compatible with Next 15 cookies()

## Dev notes
- Keep using the clean `/app/auth/*` path. The old `/_auth` is removed.
- Swap `/framework/api/list` to your real data later.
- When you reintroduce Supabase, do it behind `lib/supabaseServer.ts` (not shipping here).

## Scripts
- `npm run build` on Vercel should be green
- `npm run dev` locally if you want to try local

## Tailwind
Already configured (globals loaded via `app/layout.tsx`).

Enjoy 🚀
