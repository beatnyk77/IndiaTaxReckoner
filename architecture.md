### High-Level Architecture Overview

- **Frontend**: Next.js 15 (App Router) — Server Components for 90% of v1 (blazing static tables), Client Components only where needed (search, filters, future sliders).
- **Backend/Database**: Supabase (Postgres + Auth + Edge Functions ready). Content lives in DB so you can update tables without code deploys (perfect for post-Budget tweaks).
- **Auth**: Supabase Auth (email + Google/OAuth) — disabled for v1 public read, but wired for premium later (saved scenarios, ad-free).
- **State & Data Flow**:
  - Server-side fetches (RSC + Supabase server client) → static or ISR (Incremental Static Regeneration).
  - Client-side: TanStack Query (React Query) for cached, optimistic search/filtering.
  - No global store bloat (Zustand only if you add multi-step planner in v2).
- **Deployment**:
  - Vercel (frontend + custom domain mahanka.com).
  - Supabase (DB + future Edge Functions for cron/AI).
  - One-click GitHub → Vercel + Supabase link.
- **Performance**: 100/100 Lighthouse possible. All tables render as static HTML where possible.
- **Security**: Row Level Security (RLS) = public read-only for v1. No API keys exposed.

### File & Folder Structure

```bash
mahanka-tax-reckoner/
├── app/                          # Next.js App Router
│   ├── (site)/                   # Main layout group
│   │   ├── layout.tsx            # Root layout + Navbar + Footer + DisclaimerModal
│   │   ├── page.tsx              # Homepage (hero + featured tables + search bar)
│   │   ├── tax-slabs/            # Dynamic route for slabs
│   │   │   └── page.tsx
│   │   ├── deductions-limits/
│   │   ├── depreciation-rates/
│   │   ├── tds-tcs-rates/
│   │   ├── cii-history/
│   │   ├── new-act-changes/      # "What's New in Income-tax Act 2025"
│   │   └── [category]/           # Catch-all for future tables
│   ├── api/                      # Server Actions (future)
│   │   └── search/route.ts       # Optional edge search
│   └── globals.css
├── components/                   # Reusable UI
│   ├── ui/                       # shadcn/ui components (Table, Card, SearchInput, etc.)
│   ├── reckoner/                 # Domain-specific
│   │   ├── TaxTable.tsx          # Renders any DB table with sorting/pagination
│   │   ├── AYSwitcher.tsx        # Tax Year selector (2025-26 vs 2026-27 etc.)
│   │   ├── SearchBar.tsx         # Live filter + natural language hint
│   │   └── DisclaimerModal.tsx
│   └── layout/                   # Navbar, Footer
├── lib/                          # Utilities & clients
│   ├── supabase/
│   │   ├── client.ts             # Browser client (supabase-js)
│   │   └── server.ts             # Server client (with service_role for ISR)
│   ├── utils.ts                  # formatTaxAmount, calculateEffectiveRate helpers
│   └── queries.ts                # Reusable Supabase query functions
├── types/                        # TypeScript definitions
│   └── index.ts                  # TaxTableRow, TaxSlab, DeductionLimit etc.
├── public/                       # Static assets
│   ├── favicon.ico
│   └── og-image.jpg              # SEO Open Graph
├── supabase/                     # Local dev & migrations (run via Supabase CLI)
│   ├── migrations/               # .sql files (auto-generated)
│   ├── seed.sql                  # Initial data for New Act 2025
│   └── config.toml
├── .env.local                    # Supabase URL + anon key
├── next.config.mjs               # Images, redirects, ISR config
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### What Each Part Does (Detailed Breakdown)

**app/**  
- All routes are Server Components by default → tables load instantly with no client JS on first paint.  
- `layout.tsx`: Wraps everything with Navbar (logo + "New Act 2025" badge + search), Footer (disclaimer + last-updated timestamp), and global disclaimer modal.  
- Individual pages (`tax-slabs/page.tsx` etc.): Fetch data via `lib/queries.ts` → pass to `<TaxTable />`. Uses `generateStaticParams` for static generation where possible.

**components/**  
- `TaxTable.tsx`: Generic, beautiful table (shadcn + TanStack Table) that accepts any category from DB. Supports export to CSV/PDF (via jsPDF).  
- `SearchBar.tsx`: Client component — uses TanStack Query to filter tables live + suggests "Try: slabs under new regime".

**lib/supabase/**  
- `server.ts`: Creates Supabase client with service_role key (used only in Server Components / API routes — never exposed to browser).  
- `client.ts`: Browser client with anon key (for auth + public reads in client components).  
- Connection flow: Server Component → `serverClient.from('tax_tables').select()` → JSON → React.

**types/**  
- Strict typing so you never mismatch a slab rate or AY.

**supabase/seed.sql**  
- One-time script to populate all v1 tables with official New Act 2025 data (slabs, depreciation blocks, TDS rates, CII, etc.). I’ll give you the full verified seed next.

### Where State Lives & How Services Connect

1. **Data (Tables & Content)**  
   - Lives in Supabase Postgres table `reckoner_content` (or separate tables per category for simplicity).  
   - Columns: `id`, `category` (e.g. "tax-slabs"), `tax_year` (e.g. "2026-27"), `data` (JSONB for flexible tables), `effective_from`, `notes`, `last_updated`.  
   - RLS policy: `CREATE POLICY "Public read" ON reckoner_content FOR SELECT USING (true);`

2. **Server-side Data Fetching (v1 core)**  
   - In every page:  
     ```tsx
     const { data } = await serverSupabase
       .from('reckoner_content')
       .select('*')
       .eq('category', 'tax-slabs')
       .eq('tax_year', '2026-27');
     ```
   - Revalidate every 3600s (ISR) or on-demand via Supabase webhook later.

3. **Client-side State**  
   - TanStack Query (installed via `npm i @tanstack/react-query`):  
     ```tsx
     const { data: filteredRows } = useQuery({
       queryKey: ['search', query],
       queryFn: () => filterTable(rows, query)
     });
     ```
   - Local UI state (search term, sort column) via `useState` or `useTable` from TanStack Table.

4. **Auth Flow (ready for v2)**  
   - `supabase.auth.signInWithOAuth({ provider: 'google' })` in a future /login page.  
   - Premium tables gated with `supabase.auth.getUser()` check.

5. **Future Services (already architected)**  
   - Gemini AI query → Supabase Edge Function (v2).  
   - Cron updates (Budget notifications) → GitHub Actions or Supabase pg_cron calling Edge Function.  
   - All point to the same Supabase project.

### Quick Setup Commands (do this today)

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --yes
npm i @supabase/supabase-js @tanstack/react-query shadcn-ui lucide-react jsPDF
npx shadcn-ui@latest init
# Then add components: table, input, card, etc.
```

**Environment Variables** (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # only for server
```

### Deployment Flow
1. Push to GitHub.
2. Vercel → import repo → add env vars → auto-deploys.
3. Point mahanka.com DNS (Vercel + Supabase already supports custom domains).

