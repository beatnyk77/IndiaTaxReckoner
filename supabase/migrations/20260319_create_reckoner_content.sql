-- ============================================================
-- Migration: Create reckoner_content table + RLS
-- Project: mahanka-tax-reckoner (kxfndismlosqfjizxqko)
-- Applied via: Supabase MCP apply_migration()
-- ============================================================

CREATE TABLE IF NOT EXISTS public.reckoner_content (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  category        TEXT          NOT NULL,
  tax_year        TEXT          NOT NULL,
  sub_category    TEXT          NOT NULL DEFAULT '',
  data            JSONB         NOT NULL DEFAULT '[]',
  effective_from  DATE,
  notes           TEXT,
  last_updated    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  is_active       BOOLEAN       NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_reckoner_category  ON public.reckoner_content (category);
CREATE INDEX IF NOT EXISTS idx_reckoner_tax_year  ON public.reckoner_content (tax_year);
CREATE INDEX IF NOT EXISTS idx_reckoner_cat_year  ON public.reckoner_content (category, tax_year);
CREATE INDEX IF NOT EXISTS idx_reckoner_is_active ON public.reckoner_content (is_active);

ALTER TABLE public.reckoner_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read-only"
  ON public.reckoner_content
  FOR SELECT
  USING (is_active = TRUE);
