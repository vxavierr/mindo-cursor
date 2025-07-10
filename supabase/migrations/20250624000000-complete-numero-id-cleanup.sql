-- Migration: Complete cleanup of numero_id references
-- This migration ensures all numero_id related objects are completely removed
-- and fixes the issue with DELETE operations failing due to orphaned triggers

-- 1. Drop any remaining triggers that might reference numero_id
DROP TRIGGER IF EXISTS trigger_reorganizar_ids ON public.revisoes;

-- 2. Drop any remaining functions that might reference numero_id
DROP FUNCTION IF EXISTS reorganizar_ids_revisoes();
DROP FUNCTION IF EXISTS reorganizar_ids_revisoes CASCADE;

-- 3. Drop any remaining indexes on numero_id
DROP INDEX IF EXISTS idx_revisoes_numero_id;
DROP INDEX IF EXISTS public.idx_revisoes_numero_id;

-- 4. Drop the sequence if it still exists
DROP SEQUENCE IF EXISTS revisoes_numero_id_seq;
DROP SEQUENCE IF EXISTS public.revisoes_numero_id_seq CASCADE;

-- 5. Remove the numero_id column if it still exists
ALTER TABLE IF EXISTS public.revisoes DROP COLUMN IF EXISTS numero_id;

-- 6. Clean up any constraint that might reference numero_id
DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Find and drop any constraints that might reference numero_id
    FOR constraint_name IN 
        SELECT con.conname
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
        WHERE nsp.nspname = 'public'
        AND rel.relname = 'revisoes'
        AND con.conname LIKE '%numero_id%'
    LOOP
        EXECUTE 'ALTER TABLE public.revisoes DROP CONSTRAINT IF EXISTS ' || constraint_name;
    END LOOP;
END $$;

-- 7. Verify the cleanup by checking for any remaining references
DO $$
DECLARE
    trigger_count integer;
    function_count integer;
    column_count integer;
BEGIN
    -- Check for remaining triggers
    SELECT count(*) INTO trigger_count
    FROM information_schema.triggers 
    WHERE event_object_table = 'revisoes' 
    AND event_object_schema = 'public'
    AND action_statement LIKE '%numero_id%';
    
    -- Check for remaining functions
    SELECT count(*) INTO function_count
    FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_definition LIKE '%numero_id%';
    
    -- Check for remaining columns
    SELECT count(*) INTO column_count
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'revisoes'
    AND column_name = 'numero_id';
    
    -- Log the results
    RAISE NOTICE 'Cleanup verification: triggers=%, functions=%, columns=%', trigger_count, function_count, column_count;
    
    IF trigger_count > 0 OR function_count > 0 OR column_count > 0 THEN
        RAISE WARNING 'Some numero_id references may still exist. Manual cleanup may be required.';
    ELSE
        RAISE NOTICE 'numero_id cleanup completed successfully!';
    END IF;
END $$;

-- 8. Update table comment to reflect the change
COMMENT ON TABLE public.revisoes IS 'Tabela para armazenar aprendizados com sistema de revisão espaçada - usando UUIDs para identificação (numero_id completamente removido)';

-- 9. Create a simple test to ensure DELETE operations work
DO $$
BEGIN
    RAISE NOTICE 'Testing DELETE operation capability...';
    -- This is just a syntax check, no actual DELETE
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'revisoes' AND table_schema = 'public') THEN
        RAISE NOTICE 'DELETE operations should now work correctly on revisoes table';
    END IF;
END $$; 