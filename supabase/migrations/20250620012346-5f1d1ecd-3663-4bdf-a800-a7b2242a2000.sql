
-- Adicionar coluna numero_id como SERIAL para auto-incremento
ALTER TABLE public.revisoes ADD COLUMN numero_id SERIAL;

-- Criar índice único na nova coluna numero_id
CREATE UNIQUE INDEX idx_revisoes_numero_id ON public.revisoes(numero_id);

-- Atualizar registros existentes para ter números sequenciais baseados na data de criação
WITH numbered_rows AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY data_criacao) as row_num
  FROM public.revisoes
)
UPDATE public.revisoes 
SET numero_id = numbered_rows.row_num
FROM numbered_rows 
WHERE public.revisoes.id = numbered_rows.id;

-- Garantir que o próximo valor da sequência seja correto
SELECT setval('revisoes_numero_id_seq', (SELECT MAX(numero_id) FROM public.revisoes));
