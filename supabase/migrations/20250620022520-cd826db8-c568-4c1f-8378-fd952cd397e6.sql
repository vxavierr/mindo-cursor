
-- Criar tabela de lixeira separada para aprendizados excluídos
CREATE TABLE IF NOT EXISTS public.lixeira_aprendizados (
  id_lixeira UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conteudo TEXT NOT NULL,
  titulo TEXT,
  tags TEXT[] DEFAULT '{}',
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL,
  data_exclusao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  hora_exclusao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  contexto TEXT,
  step INTEGER DEFAULT 0,
  revisoes JSONB DEFAULT '[]'
);

-- Remover coluna deleted_at da tabela principal (não precisamos mais de soft delete)
ALTER TABLE revisoes DROP COLUMN IF EXISTS deleted_at;

-- Adicionar campos para melhor organização
ALTER TABLE revisoes ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ativo';
ALTER TABLE revisoes ADD COLUMN IF NOT EXISTS hora_criacao TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Criar índices para performance (usando IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_lixeira_data_exclusao ON lixeira_aprendizados(data_exclusao);
CREATE INDEX IF NOT EXISTS idx_revisoes_status ON revisoes(status);
