# SSC Clean Repo (no auth/roles)

Minimal Next.js (App Router + TypeScript + Tailwind) with a working **Primary Framework Editor**.

## Run
1. `npm install`
2. `npm run dev`

## Supabase (optional)
By default we use mock data. To pull real tables, set in Vercel (or `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
USE_SUPABASE=1
```

Expected tables (column names):
- `pillars(code text primary key, name text, description text)`
- `themes(code text primary key, pillar_code text, name text, description text)`
- `subthemes(code text primary key, theme_code text, name text, description text)`
