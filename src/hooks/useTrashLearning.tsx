
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

interface TrashEntry {
  id_lixeira: string;
  conteudo: string;
  titulo?: string;
  tags: string[];
  data_criacao: string;
  data_exclusao: string;
  hora_exclusao: string;
  contexto?: string;
  step: number;
  revisoes: any[];
}

export const useTrashLearning = () => {
  const [trashEntries, setTrashEntries] = useState<TrashEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Helper function to safely convert Json to array
  const convertJsonToArray = (jsonData: Json): any[] => {
    if (!jsonData) return [];
    if (Array.isArray(jsonData)) return jsonData;
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // Carregar entradas da lixeira
  const loadTrashEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('lixeira_aprendizados')
        .select('*')
        .order('data_exclusao', { ascending: false });

      if (error) {
        console.error('Erro ao carregar lixeira:', error);
        return;
      }

      const formattedEntries: TrashEntry[] = data?.map(item => ({
        id_lixeira: item.id_lixeira,
        conteudo: item.conteudo,
        titulo: item.titulo || undefined,
        tags: Array.isArray(item.tags) ? item.tags : [],
        data_criacao: item.data_criacao,
        data_exclusao: item.data_exclusao,
        hora_exclusao: item.hora_exclusao,
        contexto: item.contexto || undefined,
        step: item.step || 0,
        revisoes: convertJsonToArray(item.revisoes)
      })) || [];

      setTrashEntries(formattedEntries);
    } catch (error) {
      console.error('Erro inesperado ao carregar lixeira:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mover aprendizado para lixeira
  const moveToTrash = async (entryId: string, entry: any) => {
    try {
      // Inserir na lixeira
      const { error: insertError } = await supabase
        .from('lixeira_aprendizados')
        .insert([{
          conteudo: entry.content,
          titulo: entry.title,
          tags: entry.tags,
          data_criacao: entry.createdAt,
          contexto: entry.context,
          step: entry.step,
          revisoes: entry.reviews
        }]);

      if (insertError) {
        console.error('Erro ao mover para lixeira:', insertError);
        toast({
          title: "Erro ao excluir",
          description: "Tente novamente",
          variant: "destructive"
        });
        return false;
      }

      // Remover da tabela principal
      const { error: deleteError } = await supabase
        .from('revisoes')
        .delete()
        .eq('id', entryId);

      if (deleteError) {
        console.error('Erro ao remover da tabela principal:', deleteError);
        return false;
      }

      toast({
        title: "Aprendizado movido para lixeira",
        description: "Você pode restaurá-lo a qualquer momento"
      });

      return true;
    } catch (error) {
      console.error('Erro inesperado ao mover para lixeira:', error);
      return false;
    }
  };

  // Restaurar da lixeira
  const restoreFromTrash = async (trashId: string, entry: TrashEntry) => {
    try {
      // Inserir de volta na tabela principal
      const { error: insertError } = await supabase
        .from('revisoes')
        .insert([{
          conteudo: entry.conteudo,
          titulo: entry.titulo,
          tags: entry.tags,
          data_criacao: entry.data_criacao,
          contexto: entry.contexto,
          step: entry.step,
          revisoes: entry.revisoes,
          data_ultima_revisao: new Date().toISOString(),
          status: 'ativo'
        }]);

      if (insertError) {
        console.error('Erro ao restaurar:', insertError);
        toast({
          title: "Erro ao restaurar",
          description: "Tente novamente",
          variant: "destructive"
        });
        return false;
      }

      // Remover da lixeira
      const { error: deleteError } = await supabase
        .from('lixeira_aprendizados')
        .delete()
        .eq('id_lixeira', trashId);

      if (deleteError) {
        console.error('Erro ao remover da lixeira:', deleteError);
        return false;
      }

      setTrashEntries(prev => prev.filter(e => e.id_lixeira !== trashId));
      
      toast({
        title: "Aprendizado restaurado!",
        description: "O aprendizado foi movido de volta para a lista ativa"
      });

      return true;
    } catch (error) {
      console.error('Erro inesperado ao restaurar:', error);
      return false;
    }
  };

  // Excluir permanentemente
  const deletePermanently = async (trashId: string) => {
    try {
      const { error } = await supabase
        .from('lixeira_aprendizados')
        .delete()
        .eq('id_lixeira', trashId);

      if (error) {
        console.error('Erro ao excluir permanentemente:', error);
        toast({
          title: "Erro ao excluir permanentemente",
          description: "Tente novamente",
          variant: "destructive"
        });
        return false;
      }

      setTrashEntries(prev => prev.filter(e => e.id_lixeira !== trashId));
      
      toast({
        title: "Aprendizado excluído permanentemente",
        description: "Esta ação não pode ser desfeita"
      });

      return true;
    } catch (error) {
      console.error('Erro inesperado ao excluir permanentemente:', error);
      return false;
    }
  };

  useEffect(() => {
    loadTrashEntries();
  }, []);

  return {
    trashEntries,
    loading,
    moveToTrash,
    restoreFromTrash,
    deletePermanently,
    refreshTrash: loadTrashEntries
  };
};
