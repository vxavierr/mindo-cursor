-- Adicionar campo usuario_id à tabela lixeira_aprendizados
ALTER TABLE public.lixeira_aprendizados 
ADD COLUMN IF NOT EXISTS usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_lixeira_usuario_id ON public.lixeira_aprendizados(usuario_id);

-- Atualizar políticas RLS para incluir filtro por usuário
DROP POLICY IF EXISTS "Allow all operations on lixeira" ON public.lixeira_aprendizados;

-- Política para inserção: permitir inserção para usuários autenticados
CREATE POLICY "Enable insert for authenticated users only" ON public.lixeira_aprendizados
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Política para seleção: permitir visualização apenas dos próprios registros
CREATE POLICY "Enable select for own records only" ON public.lixeira_aprendizados
    FOR SELECT USING (auth.uid() = usuario_id);

-- Política para exclusão: permitir exclusão apenas dos próprios registros
CREATE POLICY "Enable delete for own records only" ON public.lixeira_aprendizados
    FOR DELETE USING (auth.uid() = usuario_id);

-- Comentário explicativo
COMMENT ON COLUMN public.lixeira_aprendizados.usuario_id IS 'ID do usuário proprietário do registro'; 