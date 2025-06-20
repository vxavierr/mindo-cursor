
-- Remover todas as políticas RLS existentes da tabela revisoes
DROP POLICY IF EXISTS "Enable read access for all users" ON public.revisoes;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.revisoes;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.revisoes;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.revisoes;

-- Criar novas políticas que permitem acesso público (sem autenticação)
-- Política para leitura: qualquer pessoa pode ler
CREATE POLICY "Allow public read access" 
ON public.revisoes 
FOR SELECT 
USING (true);

-- Política para inserção: qualquer pessoa pode inserir
CREATE POLICY "Allow public insert access" 
ON public.revisoes 
FOR INSERT 
WITH CHECK (true);

-- Política para atualização: qualquer pessoa pode atualizar
CREATE POLICY "Allow public update access" 
ON public.revisoes 
FOR UPDATE 
USING (true);

-- Política para exclusão: qualquer pessoa pode excluir
CREATE POLICY "Allow public delete access" 
ON public.revisoes 
FOR DELETE 
USING (true);
