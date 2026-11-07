-- Additive only: preserves existing products and category/brand values.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS goal text;
