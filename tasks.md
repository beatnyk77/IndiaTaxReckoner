**Here is your complete, ultra-granular MVP build plan.**  
Every single task is **one concern only**, **tiny**, **fully testable**, and written so you can copy-paste it directly to your engineering LLM (or Antigravity/Stitch) one at a time.  

After each task you run `npm run dev`, check the exact success criteria, and only then move to the next.  
Total: 28 tasks → you can finish the entire static v1 in 2–3 weekends even if you test after every step.

---

### Phase 0: Environment (Tasks 1–3)

**Task 1: Create fresh Next.js 15 project**  
Start: Empty folder on your machine  
End: You can run `npm run dev` and see the default Next.js page at http://localhost:3000  
Steps:  
1. Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --yes`  
2. Delete `app/globals.css` content (leave file) and `app/page.tsx` content (we’ll rebuild)  
3. Commit: “chore: init next.js 15 app router”

**Task 2: Add all production dependencies**  
Start: After Task 1  
End: `npm ls` shows @supabase/supabase-js, @tanstack/react-query, lucide-react, jspdf, shadcn-ui components ready  
Steps:  
1. Run: `npm i @supabase/supabase-js @tanstack/react-query lucide-react jspdf`  
2. Run: `npx shadcn@latest init` (accept all defaults)  
3. Commit: “chore: add core deps + shadcn init”

**Task 3: Setup environment variables skeleton**  
Start: After Task 2  
End: `.env.local` exists and Next.js reads it without error  
Steps:  
1. Create `.env.local` with exactly these 4 lines:  
   ```
   NEXT_PUBLIC_SUPABASE_URL=  
   NEXT_PUBLIC_SUPABASE_ANON_KEY=  
   SUPABASE_SERVICE_ROLE_KEY=  
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```  
2. Add `.env.local` to `.gitignore` (if not already)  
3. Commit: “chore: env skeleton”

---

### Phase 1: Supabase Project & Schema (Tasks 4–8)

**Task 4: Create Supabase project (manual)**  
Start: Browser open  
End: You have a new Supabase project URL and keys  
Steps:  
1. Go to supabase.com → New Project → name it “mahanka-tax-reckoner”  
2. Note down: Project URL, anon key, service_role key  
3. Paste them into `.env.local` (leave quotes empty for now — we fill after Task 5)  
4. Commit: “docs: supabase project created”

**Task 5: Install Supabase CLI & link locally**  
Start: After Task 4  
End: `supabase status` shows your project linked  
Steps:  
1. Run `npm i -g supabase`  
2. Run `supabase login`  
3. Run `supabase link --project-ref YOUR_PROJECT_REF`  
4. Commit: “chore: supabase cli linked”

**Task 6: Create reckoner_content table + RLS**  
Start: After Task 5  
End: Table exists in Supabase dashboard + RLS allows public SELECT  
Steps:  
1. Create file `supabase/migrations/20260314_create_reckoner_content.sql`  
2. Paste the exact schema I gave you earlier (id, category, tax_year, data JSONB, effective_from, notes, last_updated)  
3. Add RLS policy: `CREATE POLICY "Public read-only" ON reckoner_content FOR SELECT USING (true);`  
4. Run `supabase db push`  
5. Verify in dashboard: table exists, policy active  
6. Commit: “db: create reckoner_content table + public RLS”

**Task 7: Seed v1 data (New Income-tax Act 2025)**  
Start: After Task 6  
End: 5+ rows visible in Supabase table (slabs, deductions, depreciation, TDS, CII)  
Steps:  
1. Create `supabase/seed.sql`  
2. Paste the verified JSONB data for AY 2027-28 (I’ll give you the full file content in next message if you say “drop seed now”)  
3. Run `supabase db reset` (or manually insert via dashboard for safety)  
4. Verify: open Supabase table → see rows for category = 'tax-slabs', 'deductions-limits', etc.  
5. Commit: “db: seed official New Act 2025 data”

**Task 8: Add Supabase client helpers**  
Start: After Task 7  
End: Two files in `lib/supabase/` and import works without error  
Steps:  
1. Create `lib/supabase/server.ts` (service_role client)  
2. Create `lib/supabase/client.ts` (anon browser client)  
3. Create `lib/queries.ts` with one function `getReckonerTable(category: string, taxYear?: string)`  
4. Commit: “lib: supabase clients + query helper”

---

### Phase 2: Core UI Foundation (Tasks 9–14)

**Task 9: Setup root layout + global styles**  
Start: After Task 8  
End: Navbar + Footer visible, dark theme ready  
Steps:  
1. Replace `app/layout.tsx` with the layout I described (Navbar with “Direct Tax Reckoner – New Act 2025” badge)  
2. Add Tailwind dark mode + shadcn globals  
3. Commit: “ui: root layout + navbar/footer skeleton”

**Task 10: Create reusable TaxTable component**  
Start: After Task 9  
End: `<TaxTable data={sampleRows} />` renders a beautiful sortable table on /test page  
Steps:  
1. Create `components/reckoner/TaxTable.tsx` using shadcn Table + @tanstack/react-table  
2. Add CSV export button using jsPDF  
3. Commit: “ui: TaxTable component + export”

**Task 11: Create SearchBar component**  
Start: After Task 10  
End: Typing in search filters table live (client-side)  
Steps:  
1. Create `components/reckoner/SearchBar.tsx` + wrap with TanStack Query  
2. Add to a temporary /test page  
3. Commit: “ui: SearchBar + TanStack Query setup”

**Task 12: Create DisclaimerModal**  
Start: After Task 11  
End: Modal shows on first load + “I understand” button  
Steps:  
1. Create `components/reckoner/DisclaimerModal.tsx` (use shadcn Dialog)  
2. Add to layout so it appears once per session  
3. Commit: “ui: mandatory disclaimer modal”

**Task 13: Create AYSwitcher component**  
Start: After Task 12  
End: Dropdown switches between “2026-27” and “2027-28” (even if only one year has data)  
Steps:  
1. Create `components/reckoner/AYSwitcher.tsx`  
2. Make it control query param `?year=2027-28`  
3. Commit: “ui: AYSwitcher”

**Task 14: Add types**  
Start: After Task 13  
End: No TypeScript errors anywhere  
Steps:  
1. Create `types/index.ts` with `ReckonerRow`, `TaxSlab`, etc.  
2. Commit: “types: full TypeScript definitions”

---

### Phase 3: Pages & Data Fetching (Tasks 15–22)

**Task 15: Build homepage**  
Start: After Task 14  
End: http://localhost:3000 shows hero + 4 featured cards linking to sections  
Steps:  
1. Replace `app/page.tsx` with homepage (hero + cards)  
2. Commit: “pages: homepage”

**Task 16: Build /tax-slabs page**  
Start: After Task 15  
End: /tax-slabs shows official new-regime slabs table (static fetch)  
Steps:  
1. Create `app/tax-slabs/page.tsx`  
2. Fetch via server component using `getReckonerTable('tax-slabs', '2027-28')`  
3. Pass to `<TaxTable />` + `<AYSwitcher />`  
4. Commit: “pages: tax-slabs (first live table)”

**Task 17: Build /deductions-limits page**  
Start: After Task 16  
End: Exact same pattern, different category  
Steps: Repeat pattern for deductions-limits  
Commit: “pages: deductions-limits”

**Task 18–21:** Repeat the exact same 3-step pattern for:  
- depreciation-rates  
- tds-tcs-rates  
- cii-history  
(One task per page — each only 10–15 lines of code)

**Task 22: Build /new-act-changes page**  
Start: After Task 21  
End: Static markdown-style page with top 10 changes summary  
Steps:  
1. Create `app/new-act-changes/page.tsx` (hardcoded content for v1)  
2. Commit: “pages: new-act-changes summary”

---

### Phase 4: Polish & Launch (Tasks 23–28)

**Task 23: Add ISR revalidation**  
Start: After Task 22  
End: Tables revalidate every hour (for future cron)  
Steps:  
1. Add `revalidate = 3600` to every page  
2. Commit: “perf: ISR every hour”

**Task 24: Add SEO metadata + sitemap**  
Start: After Task 23  
End: Google can crawl “new tax slabs AY 2027-28”  
Steps:  
1. Add generateMetadata to each page + robots.txt + sitemap.ts  
2. Commit: “seo: metadata + sitemap”

**Task 25: Add PWA manifest**  
Start: After Task 24  
End: Installable on mobile (CAs love offline)  
Steps:  
1. Add manifest.json + service worker stub  
2. Commit: “pwa: basic manifest”

**Task 26: Local Supabase data sync test**  
Start: After Task 25  
End: Change one rate in Supabase → refresh page → see update (no code deploy)  
Steps:  
1. Edit one row in dashboard  
2. Verify live update  
3. Commit: “test: db-driven content confirmed”

**Task 27: Vercel deployment**  
Start: After Task 26  
End: Site live at your temporary Vercel URL  
Steps:  
1. Push to GitHub → connect Vercel → add env vars  
2. Set custom domain preview (mahanka.com later)  
3. Commit: “deploy: vercel live”

**Task 28: Final checklist & launch**  
Start: After Task 27  
End: You can share mahanka.com link  
Steps:  
1. Add last-updated timestamp footer  
2. Test on mobile + Lighthouse 95+  
3. Add “Feedback” button (mailto or simple form)  
4. Commit: “v1 shipped – static Direct Tax Reckoner New Act 2025”

---
