# SSC App (Clean, with CSV Import)

**Home page** is an Ant Design tree table (browse + edit indicators inline).

**APIs:**
- `GET /api/framework` — hierarchical tree data
- `GET /api/export` — CSV export
- `POST /api/indicators` — create indicator
- `PUT /api/indicators/[id]` / `DELETE /api/indicators/[id]`
- `POST /api/import/pillars?mode=upsert|replace` — CSV import
- `POST /api/import/themes?mode=upsert|replace` — CSV import
- `POST /api/import/subthemes?mode=upsert|replace` — CSV import
- `POST /api/import/standards?mode=upsert|replace` — CSV import
- `POST /api/import/indicators?mode=upsert|replace` — CSV import

### CSV Columns

**pillars.csv**
- id (optional)
- code (optional, unique if used)
- name (required)
- description (optional)
- sort_order (optional number)

**themes.csv**
- id (optional)
- pillar_id OR pillar_code (one required)
- code (optional, unique if used)
- name (required)
- description (optional)
- sort_order (optional number)

**subthemes.csv**
- id (optional)
- theme_id OR theme_code (one required)
- code (optional, unique if used)
- name (required)
- description (optional)
- sort_order (optional number)

**standards.csv**
- id (optional)
- subtheme_id OR subtheme_code (one required)
- code (optional)
- description (required; this is the "standard statement")
- notes (optional)
- sort_order (optional number)

**indicators.csv**
- id (optional)
- (one parent ref) pillar_id|pillar_code|theme_id|theme_code|subtheme_id|subtheme_code|standard_id|standard_code
- code (optional)
- name (required)
- description (optional)
- is_default (optional boolean)
- weight (optional number)
- sort_order (optional number)

`mode=upsert` (default): insert new or update existing rows by `id` if provided, otherwise by `code` when available.  
`mode=replace`: clears the target table before importing.

## Env
`.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
