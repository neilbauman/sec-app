# SSC Editor (Clean, No Auth)

This repository is a clean baseline to get the **Primary Framework Editor** working without any authentication/role logic.

## What's included
- App Router (Next.js 15)
- Mock API at `/framework/api/list`
- Simple dashboard and editor pages
- No auth, no cookies
- `lucide-react` preinstalled to avoid missing module errors

## Run locally
```bash
npm i
cp .env.example .env.local
npm run dev
```
Visit:
- http://localhost:3000/dashboard
- http://localhost:3000/admin/framework/primary/editor

## Deploy to Vercel
1. Create a new Vercel project, import this repo.
2. Add **Environment Variable**: `NEXT_PUBLIC_BASE_URL` = your Vercel URL (e.g. `https://your-project.vercel.app`).
3. Deploy.

## Hook up real data (later)
- Replace the mock in `app/framework/api/list/route.ts` with your Supabase query, then point the editor to it.
- Keep `lib/internalFetch` as-is to avoid cookie/header issues until auth is reintroduced deliberately.
