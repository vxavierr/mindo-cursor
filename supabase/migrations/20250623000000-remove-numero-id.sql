-- Migration: Remove numero_id column and related objects
-- Remove the numero_id field that was used for manual ChatGPT commands
-- Now using direct UI interactions, so this field is no longer needed

-- 1. Remove trigger and reorganization function
DROP TRIGGER IF EXISTS trigger_reorganizar_ids ON public.revisoes;
DROP FUNCTION IF EXISTS reorganizar_ids_revisoes();

-- 2. Remove unique index
DROP INDEX IF EXISTS idx_revisoes_numero_id;

-- 3. Remove sequence
DROP SEQUENCE IF EXISTS revisoes_numero_id_seq;

-- 4. Remove numero_id column
ALTER TABLE public.revisoes DROP COLUMN IF EXISTS numero_id;

-- 5. Add comment to document the change
COMMENT ON TABLE public.revisoes IS 'Tabela para armazenar aprendizados com sistema de revisão espaçada - numero_id removido em favor de UI direta'; 