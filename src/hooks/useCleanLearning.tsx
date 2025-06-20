
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LearningEntry {
  id: string;
  numeroId: number;
  title: string;
  content: string;
  context?: string;
  tags: string[];
  createdAt: string;
  step: number;
  reviews: Array<{ 
    date: string; 
    questions?: string[]; 
    answers?: string[]; 
    step?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  }>;
}

export const useCleanLearning = () => {
  const [learningEntries, setLearningEntries] = useState<LearningEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Intervalos de revisão espaçada em dias
  const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60];

  // Helper function to safely convert Json to Review array
  const convertJsonToReviews = (jsonData: any) => {
    if (!jsonData) return [];
    if (!Array.isArray(jsonData)) return [];
    
    return jsonData.map((item: any) => ({
      date: item?.date || new Date().toISOString(),
      questions: Array.isArray(item?.questions) ? item.questions : [],
      answers: Array.isArray(item?.answers) ? item.answers : [],
      step: typeof item?.step === 'number' ? item.step : 0,
      difficulty: ['easy', 'medium', 'hard'].includes(item?.difficulty) ? item.difficulty : 'medium'
    }));
  };

  // Carregar entradas ativas
  const loadEntries = async () => {
    try {
      console.log('Carregando entradas...');
      const { data, error } = await supabase
        .from('revisoes')
        .select('*')
        .eq('status', 'ativo')
        .order('numero_id', { ascending: false });

      if (error) {
        console.error('Erro ao carregar entradas:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Verifique sua conexão e tente novamente",
          variant: "destructive"
        });
        return;
      }

      console.log('Entradas carregadas:', data);

      const entries: LearningEntry[] = data?.map(item => ({
        id: item.id,
        numeroId: item.numero_id,
        title: item.titulo || '',
        content: item.conteudo,
        context: item.contexto || '',
        tags: Array.isArray(item.tags) ? item.tags : [],
        createdAt: item.data_criacao || new Date().toISOString(),
        step: item.step || 0,
        reviews: convertJsonToReviews(item.revisoes)
      })) || [];

      setLearningEntries(entries);
    } catch (error) {
      console.error('Erro inesperado ao carregar entradas:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente recarregar a página",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar nova entrada
  const addLearningEntry = async (content: string, title: string, tags: string[], context?: string) => {
    try {
      console.log('Adicionando nova entrada...');
      const newEntry = {
        titulo: title,
        conteudo: content,
        contexto: context || null,
        tags: tags || [],
        step: 0,
        revisoes: [],
        data_criacao: new Date().toISOString(),
        data_ultima_revisao: new Date().toISOString(),
        usuario_id: null,
        status: 'ativo',
        hora_criacao: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('revisoes')
        .insert([newEntry])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar entrada:', error);
        toast({
          title: "Erro ao salvar",
          description: "Verifique sua conexão e tente novamente",
          variant: "destructive"
        });
        return;
      }

      console.log('Nova entrada criada:', data);

      const convertedEntry: LearningEntry = {
        id: data.id,
        numeroId: data.numero_id,
        title: data.titulo || '',
        content: data.conteudo,
        context: data.contexto || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        createdAt: data.data_criacao || new Date().toISOString(),
        step: data.step || 0,
        reviews: convertJsonToReviews(data.revisoes)
      };

      // Recarregar entradas para obter a lista atualizada com IDs corretos
      await loadEntries();

      toast({
        title: "Aprendizado salvo!",
        description: `Aprendizado #${String(data.numero_id).padStart(4, '0')} foi salvo com sucesso.`
      });
    } catch (error) {
      console.error('Erro inesperado ao adicionar entrada:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente",
        variant: "destructive"
      });
    }
  };

  // Excluir entrada diretamente (simplificado)
  const deleteEntry = async (entryId: string) => {
    try {
      console.log('Excluindo entrada:', entryId);
      
      // Remover otimisticamente da lista local primeiro
      const entryToDelete = learningEntries.find(e => e.id === entryId);
      if (entryToDelete) {
        setLearningEntries(prev => prev.filter(e => e.id !== entryId));
      }

      // Excluir do banco (o trigger reorganizará automaticamente os IDs)
      const { error } = await supabase
        .from('revisoes')
        .delete()
        .eq('id', entryId);

      if (error) {
        console.error('Erro ao excluir entrada:', error);
        // Reverter a exclusão otimista se houve erro
        if (entryToDelete) {
          setLearningEntries(prev => [...prev, entryToDelete].sort((a, b) => b.numeroId - a.numeroId));
        }
        toast({
          title: "Erro ao excluir",
          description: "Tente novamente",
          variant: "destructive"
        });
        return;
      }

      console.log('Entrada excluída com sucesso');
      
      // Recarregar entradas para obter os IDs reorganizados
      await loadEntries();

      toast({
        title: "Aprendizado excluído",
        description: "O aprendizado foi excluído permanentemente"
      });
    } catch (error) {
      console.error('Erro inesperado ao excluir entrada:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente",
        variant: "destructive"
      });
    }
  };

  // Completar revisão com sistema de espaçamento
  const completeReview = async (entryId: string, difficulty: 'easy' | 'medium' | 'hard', questions: string[], answers: string[]) => {
    try {
      console.log('Completando revisão:', entryId, difficulty);
      const entry = learningEntries.find(e => e.id === entryId);
      if (!entry) return;

      // Calcular próximo step baseado na dificuldade
      let nextStep = entry.step;
      
      switch (difficulty) {
        case 'easy':
          nextStep = Math.min(entry.step + 2, REVIEW_INTERVALS.length - 1);
          break;
        case 'medium':
          nextStep = Math.min(entry.step + 1, REVIEW_INTERVALS.length - 1);
          break;
        case 'hard':
          nextStep = Math.max(entry.step - 1, 0);
          break;
      }

      const newReview = {
        date: new Date().toISOString(),
        questions: questions || [],
        answers: answers || [],
        step: nextStep,
        difficulty
      };

      const updatedReviews = [...entry.reviews, newReview];

      const { error } = await supabase
        .from('revisoes')
        .update({
          step: nextStep,
          revisoes: updatedReviews,
          data_ultima_revisao: new Date().toISOString()
        })
        .eq('id', entryId);

      if (error) {
        console.error('Erro ao completar revisão:', error);
        toast({
          title: "Erro ao salvar revisão",
          description: "Tente novamente",
          variant: "destructive"
        });
        return;
      }

      // Atualizar estado local
      setLearningEntries(prev => 
        prev.map(e => 
          e.id === entryId 
            ? { ...e, step: nextStep, reviews: updatedReviews }
            : e
        )
      );

      const intervalDays = REVIEW_INTERVALS[nextStep];
      toast({
        title: "Revisão concluída!",
        description: `Próxima revisão em ${intervalDays} dias`
      });
    } catch (error) {
      console.error('Erro inesperado ao completar revisão:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente",
        variant: "destructive"
      });
    }
  };

  // Obter entradas de hoje
  const getTodaysEntries = () => {
    const today = new Date().toDateString();
    return learningEntries.filter(entry => 
      new Date(entry.createdAt).toDateString() === today
    );
  };

  useEffect(() => {
    loadEntries();
  }, []);

  return {
    learningEntries,
    todaysEntries: getTodaysEntries(),
    loading,
    addLearningEntry,
    deleteEntry,
    completeReview,
    refreshEntries: loadEntries
  };
};
