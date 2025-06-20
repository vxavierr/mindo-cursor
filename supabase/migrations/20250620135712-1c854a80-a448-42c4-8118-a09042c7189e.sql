
-- 1. Corrigir a sequência de IDs para refletir o próximo valor correto
SELECT setval('revisoes_numero_id_seq', (SELECT COALESCE(MAX(numero_id), 0) + 1 FROM public.revisoes));

-- 2. Criar função para reorganizar IDs automaticamente
CREATE OR REPLACE FUNCTION reorganizar_ids_revisoes()
RETURNS TRIGGER AS $$
BEGIN
    -- Reorganizar os numero_id sequencialmente após uma exclusão
    WITH numbered_rows AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY data_criacao) as new_numero_id
        FROM public.revisoes
        WHERE status = 'ativo'
    )
    UPDATE public.revisoes 
    SET numero_id = numbered_rows.new_numero_id
    FROM numbered_rows 
    WHERE public.revisoes.id = numbered_rows.id;
    
    -- Atualizar a sequência para o próximo valor correto
    PERFORM setval('revisoes_numero_id_seq', (SELECT COALESCE(MAX(numero_id), 0) + 1 FROM public.revisoes));
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 3. Criar trigger que executa a reorganização após exclusões
DROP TRIGGER IF EXISTS trigger_reorganizar_ids ON public.revisoes;
CREATE TRIGGER trigger_reorganizar_ids
    AFTER DELETE ON public.revisoes
    FOR EACH STATEMENT
    EXECUTE FUNCTION reorganizar_ids_revisoes();

-- 4. Verificar e ajustar políticas RLS para lixeira_aprendizados
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.lixeira_aprendizados;
DROP POLICY IF EXISTS "Enable select for authenticated users only" ON public.lixeira_aprendizados;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.lixeira_aprendizados;

-- Criar políticas RLS mais permissivas para a lixeira (permitir acesso sem autenticação)
CREATE POLICY "Allow all operations on lixeira" ON public.lixeira_aprendizados
    FOR ALL USING (true) WITH CHECK (true);

-- 5. Reorganizar IDs existentes imediatamente
WITH numbered_rows AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY data_criacao) as new_numero_id
    FROM public.revisoes
    WHERE status = 'ativo'
)
UPDATE public.revisoes 
SET numero_id = numbered_rows.new_numero_id
FROM numbered_rows 
WHERE public.revisoes.id = numbered_rows.id;

-- 6. Garantir que a sequência está correta
SELECT setval('revisoes_numero_id_seq', (SELECT COALESCE(MAX(numero_id), 0) + 1 FROM public.revisoes));
