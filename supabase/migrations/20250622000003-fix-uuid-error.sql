-- Fix para erro "record 'new' has no field 'uuid'"
-- Remove qualquer trigger ou função que esteja tentando acessar campo uuid

-- Drop triggers que podem estar tentando acessar campo uuid
DROP TRIGGER IF EXISTS set_uuid_on_revisoes ON public.revisoes;
DROP TRIGGER IF EXISTS set_uuid_on_lixeira ON public.lixeira_aprendizados;
DROP TRIGGER IF EXISTS trigger_set_uuid_revisoes ON public.revisoes;
DROP TRIGGER IF EXISTS trigger_set_uuid_lixeira ON public.lixeira_aprendizados;

-- Drop functions que podem estar tentando acessar campo uuid  
DROP FUNCTION IF EXISTS generate_uuid_for_revisoes();
DROP FUNCTION IF EXISTS generate_uuid_for_lixeira();
DROP FUNCTION IF EXISTS set_uuid_for_revisoes();
DROP FUNCTION IF EXISTS set_uuid_for_lixeira();

-- Remove colunas uuid se existirem (podem ter sido criadas por engano)
ALTER TABLE public.revisoes DROP COLUMN IF EXISTS uuid;
ALTER TABLE public.lixeira_aprendizados DROP COLUMN IF EXISTS uuid;

-- Remove indexes uuid se existirem
DROP INDEX IF EXISTS idx_revisoes_uuid;
DROP INDEX IF EXISTS idx_lixeira_uuid; 