
-- Primeiro, vamos ajustar a tabela existente para seguir exatamente os critérios do sistema
-- Remover colunas desnecessárias e ajustar estrutura
ALTER TABLE public.revisoes DROP COLUMN IF EXISTS titulo;
ALTER TABLE public.revisoes DROP COLUMN IF EXISTS completed;

-- Ajustar campos existentes para garantir consistência
ALTER TABLE public.revisoes ALTER COLUMN conteudo SET NOT NULL;
ALTER TABLE public.revisoes ALTER COLUMN step SET DEFAULT 0;
ALTER TABLE public.revisoes ALTER COLUMN step SET NOT NULL;
ALTER TABLE public.revisoes ALTER COLUMN tags SET DEFAULT '{}';
ALTER TABLE public.revisoes ALTER COLUMN tags SET NOT NULL;
ALTER TABLE public.revisoes ALTER COLUMN revisoes SET DEFAULT '[]';
ALTER TABLE public.revisoes ALTER COLUMN revisoes SET NOT NULL;
ALTER TABLE public.revisoes ALTER COLUMN data_criacao SET DEFAULT now();
ALTER TABLE public.revisoes ALTER COLUMN data_criacao SET NOT NULL;
ALTER TABLE public.revisoes ALTER COLUMN data_ultima_revisao SET DEFAULT now();
ALTER TABLE public.revisoes ALTER COLUMN data_ultima_revisao SET NOT NULL;

-- Adicionar constraint para garantir que step não seja negativo e não exceda 5
ALTER TABLE public.revisoes ADD CONSTRAINT check_step_range CHECK (step >= 0 AND step <= 5);

-- Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_revisoes_step ON public.revisoes(step);
CREATE INDEX IF NOT EXISTS idx_revisoes_data_criacao ON public.revisoes(data_criacao);
CREATE INDEX IF NOT EXISTS idx_revisoes_data_ultima_revisao ON public.revisoes(data_ultima_revisao);
CREATE INDEX IF NOT EXISTS idx_revisoes_tags ON public.revisoes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_revisoes_usuario_id ON public.revisoes(usuario_id);

-- Adicionar comentários na tabela para documentação
COMMENT ON TABLE public.revisoes IS 'Tabela para armazenar aprendizados com sistema de revisão espaçada';
COMMENT ON COLUMN public.revisoes.id IS 'Identificador único do aprendizado';
COMMENT ON COLUMN public.revisoes.conteudo IS 'Conteúdo principal do aprendizado';
COMMENT ON COLUMN public.revisoes.contexto IS 'Contexto opcional onde o aprendizado foi adquirido';
COMMENT ON COLUMN public.revisoes.tags IS 'Array de tags para categorização';
COMMENT ON COLUMN public.revisoes.step IS 'Etapa atual na revisão espaçada (0-5)';
COMMENT ON COLUMN public.revisoes.data_criacao IS 'Data de criação do aprendizado';
COMMENT ON COLUMN public.revisoes.data_ultima_revisao IS 'Data da última revisão realizada';
COMMENT ON COLUMN public.revisoes.revisoes IS 'Histórico de revisões em formato JSON';
COMMENT ON COLUMN public.revisoes.usuario_id IS 'ID do usuário (nullable para uso sem login)';
