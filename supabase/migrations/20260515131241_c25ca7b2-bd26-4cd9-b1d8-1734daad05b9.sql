
-- Add evento_id and make lugar_id optional so favoritos can reference either
ALTER TABLE public.favoritos ADD COLUMN IF NOT EXISTS evento_id uuid REFERENCES public.eventos(id) ON DELETE CASCADE;
ALTER TABLE public.favoritos ALTER COLUMN lugar_id DROP NOT NULL;

-- Ensure exactly one of lugar_id / evento_id is set
ALTER TABLE public.favoritos DROP CONSTRAINT IF EXISTS favoritos_target_chk;
ALTER TABLE public.favoritos ADD CONSTRAINT favoritos_target_chk CHECK (
  (lugar_id IS NOT NULL)::int + (evento_id IS NOT NULL)::int = 1
);

-- Prevent duplicates per user
CREATE UNIQUE INDEX IF NOT EXISTS favoritos_user_lugar_uidx ON public.favoritos(user_id, lugar_id) WHERE lugar_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS favoritos_user_evento_uidx ON public.favoritos(user_id, evento_id) WHERE evento_id IS NOT NULL;
