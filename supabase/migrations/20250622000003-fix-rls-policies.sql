-- Corrigir políticas RLS para garantir que inserção funcione corretamente
-- Remover políticas existentes
DROP POLICY IF EXISTS "Allow public read access" ON public.revisoes;
DROP POLICY IF EXISTS "Allow public insert access" ON public.revisoes;
DROP POLICY IF EXISTS "Allow public update access" ON public.revisoes;
DROP POLICY IF EXISTS "Allow public delete access" ON public.revisoes;

-- Criar políticas mais específicas que permitem acesso público mas respeitam usuários autenticados
-- Política para leitura: usuários autenticados veem suas entradas, não autenticados veem entradas sem usuário
CREATE POLICY "Allow read access based on user" 
ON public.revisoes 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL AND usuario_id = auth.uid()) OR
  (auth.uid() IS NULL AND usuario_id IS NULL)
);

-- Política para inserção: qualquer pessoa pode inserir
CREATE POLICY "Allow insert for all" 
ON public.revisoes 
FOR INSERT 
WITH CHECK (true);

-- Política para atualização: usuários autenticados podem atualizar suas entradas, não autenticados podem atualizar entradas sem usuário
CREATE POLICY "Allow update based on user" 
ON public.revisoes 
FOR UPDATE 
USING (
  (auth.uid() IS NOT NULL AND usuario_id = auth.uid()) OR
  (auth.uid() IS NULL AND usuario_id IS NULL)
);

-- Política para exclusão: usuários autenticados podem excluir suas entradas, não autenticados podem excluir entradas sem usuário
CREATE POLICY "Allow delete based on user" 
ON public.revisoes 
FOR DELETE 
USING (
  (auth.uid() IS NOT NULL AND usuario_id = auth.uid()) OR
  (auth.uid() IS NULL AND usuario_id IS NULL)
);

-- Garantir que RLS está habilitado
ALTER TABLE public.revisoes ENABLE ROW LEVEL SECURITY;

-- Verificar se a tabela tem todos os campos necessários
DO $$
BEGIN
    -- Verificar se a coluna titulo existe, se não, criar
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'revisoes' AND column_name = 'titulo') THEN
        ALTER TABLE public.revisoes ADD COLUMN titulo text;
    END IF;
    
    -- Verificar se a coluna status existe, se não, criar
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'revisoes' AND column_name = 'status') THEN
        ALTER TABLE public.revisoes ADD COLUMN status text DEFAULT 'ativo';
    END IF;
    
    -- Verificar se a coluna hora_criacao existe, se não, criar
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'revisoes' AND column_name = 'hora_criacao') THEN
        ALTER TABLE public.revisoes ADD COLUMN hora_criacao timestamp with time zone DEFAULT now();
    END IF;
END $$; 