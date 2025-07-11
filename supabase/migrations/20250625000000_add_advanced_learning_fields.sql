-- Migração para adicionar campos da lógica avançada de aprendizado
-- Data: 2025-06-25
-- Descrição: Adiciona campos para implementar penalidade gradativa e sistema de proteção

-- Adicionar novos campos na tabela revisoes
ALTER TABLE revisoes 
ADD COLUMN IF NOT EXISTS consecutive_difficult INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS consecutive_easy INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_easy_history INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS visual_progress DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS is_protected BOOLEAN DEFAULT FALSE;

-- Adicionar comentários para documentar os campos
COMMENT ON COLUMN revisoes.consecutive_difficult IS 'Contador de revisões difíceis consecutivas';
COMMENT ON COLUMN revisoes.consecutive_easy IS 'Contador de revisões fáceis consecutivas';
COMMENT ON COLUMN revisoes.total_easy_history IS 'Total de revisões fáceis no histórico';
COMMENT ON COLUMN revisoes.visual_progress IS 'Progresso visual (pode diferir do step real)';
COMMENT ON COLUMN revisoes.is_protected IS 'Se o aprendizado tem proteção por bons acertos';

-- Adicionar os mesmos campos na tabela lixeira_aprendizados para consistência
ALTER TABLE lixeira_aprendizados 
ADD COLUMN IF NOT EXISTS consecutive_difficult INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS consecutive_easy INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_easy_history INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS visual_progress DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS is_protected BOOLEAN DEFAULT FALSE;

-- Adicionar comentários na tabela lixeira também
COMMENT ON COLUMN lixeira_aprendizados.consecutive_difficult IS 'Contador de revisões difíceis consecutivas';
COMMENT ON COLUMN lixeira_aprendizados.consecutive_easy IS 'Contador de revisões fáceis consecutivas';
COMMENT ON COLUMN lixeira_aprendizados.total_easy_history IS 'Total de revisões fáceis no histórico';
COMMENT ON COLUMN lixeira_aprendizados.visual_progress IS 'Progresso visual (pode diferir do step real)';
COMMENT ON COLUMN lixeira_aprendizados.is_protected IS 'Se o aprendizado tem proteção por bons acertos';

-- Criar índices para melhorar performance em consultas
CREATE INDEX IF NOT EXISTS idx_revisoes_consecutive_difficult ON revisoes(consecutive_difficult);
CREATE INDEX IF NOT EXISTS idx_revisoes_is_protected ON revisoes(is_protected);

-- Atualizar entradas existentes com valores padrão apropriados
UPDATE revisoes 
SET 
  consecutive_difficult = 0,
  consecutive_easy = 0,
  total_easy_history = 0,
  is_protected = FALSE
WHERE consecutive_difficult IS NULL;

-- Comentário final da migração
COMMENT ON TABLE revisoes IS 'Tabela de aprendizados com sistema avançado de penalidade gradativa'; 