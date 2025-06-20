
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTrashLearning } from './useTrashLearning';

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
  const { moveToTrash } = useTrashLearning();

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

      setLearningEntries(prev => [convertedEntry, ...prev]);
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

  // Excluir entrada (mover para lixeira) - agora com reorganização automática
  const deleteEntry = async (entryId: string) => {
    const entry = learningEntries.find(e => e.id === entryId);
    if (!entry) return;

    const success = await moveToTrash(entryId, entry);
    if (success) {
      // Remover da lista local - a reorganização será feita automaticamente pelo trigger
      setLearningEntries(prev => prev.filter(e => e.id !== entryId));
      
      // Recarregar a lista para obter os IDs reorganizados
      setTimeout(() => {
        loadEntries();
      }, 500);
    }
  };

  // Completar revisão com sistema de espaçamento
  const completeReview = async (entryId: string, difficulty: 'easy' | 'medium' | 'hard', questions: string[], answers: string[]) => {
    try {
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
