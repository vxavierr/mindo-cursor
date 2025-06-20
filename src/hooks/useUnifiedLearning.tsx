
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SpacedRepetitionEngine, ReviewData } from '@/utils/spacedRepetition';

interface LearningEntry {
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
  deletedAt?: string;
}

interface Review {
  date: string;
  questions?: string[];
  answers?: string[];
  step?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export const useUnifiedLearning = () => {
  const [learningEntries, setLearningEntries] = useState<LearningEntry[]>([]);
  const [deletedEntries, setDeletedEntries] = useState<LearningEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Helper function to safely convert Json to Review array
  const convertJsonToReviews = (jsonData: any): Review[] => {
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

  // Load entries from Supabase
  const loadEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('revisoes')
        .select('*')
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

      // Separate active and deleted entries
      const activeEntries: LearningEntry[] = [];
      const deletedEntries: LearningEntry[] = [];

      data?.forEach(item => {
        const entry: LearningEntry = {
          id: item.id,
          numeroId: item.numero_id,
          title: (item as any).titulo || '',
          content: item.conteudo,
          context: item.contexto || '',
          tags: Array.isArray(item.tags) ? item.tags : [],
          createdAt: item.data_criacao || new Date().toISOString(),
          step: item.step || 0,
          reviews: convertJsonToReviews(item.revisoes),
          deletedAt: (item as any).deleted_at
        };

        if ((item as any).deleted_at) {
          deletedEntries.push(entry);
        } else {
          activeEntries.push(entry);
        }
      });

      setLearningEntries(activeEntries);
      setDeletedEntries(deletedEntries);
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

  // Add new entry
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
        deleted_at: null
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

      // Convert and add to list
      const convertedEntry: LearningEntry = {
        id: data.id,
        numeroId: data.numero_id,
        title: (data as any).titulo || '',
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

  // Soft delete entry (move to trash)
  const deleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('revisoes')
        .update({ deleted_at: new Date().toISOString() } as any)
        .eq('id', entryId);

      if (error) {
        console.error('Erro ao excluir entrada:', error);
        toast({
          title: "Erro ao excluir",
          description: "Tente novamente",
          variant: "destructive"
        });
        return;
      }

      // Move entry from active to deleted
      const entryToDelete = learningEntries.find(e => e.id === entryId);
      if (entryToDelete) {
        setLearningEntries(prev => prev.filter(e => e.id !== entryId));
        setDeletedEntries(prev => [...prev, { ...entryToDelete, deletedAt: new Date().toISOString() }]);
        
        toast({
          title: "Aprendizado movido para lixeira",
          description: "Você pode restaurá-lo a qualquer momento"
        });
      }
    } catch (error) {
      console.error('Erro inesperado ao excluir entrada:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente",
        variant: "destructive"
      });
    }
  };

  // Restore entry from trash
  const restoreEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('revisoes')
        .update({ deleted_at: null } as any)
        .eq('id', entryId);

      if (error) {
        console.error('Erro ao restaurar entrada:', error);
        toast({
          title: "Erro ao restaurar",
          description: "Tente novamente",
          variant: "destructive"
        });
        return;
      }

      // Move entry from deleted to active
      const entryToRestore = deletedEntries.find(e => e.id === entryId);
      if (entryToRestore) {
        setDeletedEntries(prev => prev.filter(e => e.id !== entryId));
        setLearningEntries(prev => [{ ...entryToRestore, deletedAt: undefined }, ...prev]);
        
        toast({
          title: "Aprendizado restaurado!",
          description: "O aprendizado foi movido de volta para a lista ativa"
        });
      }
    } catch (error) {
      console.error('Erro inesperado ao restaurar entrada:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente",
        variant: "destructive"
      });
    }
  };

  // Permanently delete entry
  const permanentlyDeleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('revisoes')
        .delete()
        .eq('id', entryId);

      if (error) {
        console.error('Erro ao excluir permanentemente:', error);
        toast({
          title: "Erro ao excluir permanentemente",
          description: "Tente novamente",
          variant: "destructive"
        });
        return;
      }

      setDeletedEntries(prev => prev.filter(e => e.id !== entryId));
      
      toast({
        title: "Aprendizado excluído permanentemente",
        description: "Esta ação não pode ser desfeita"
      });
    } catch (error) {
      console.error('Erro inesperado ao excluir permanentemente:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente",
        variant: "destructive"
      });
    }
  };

  // Complete review with advanced spaced repetition
  const completeReview = async (entryId: string, difficulty: 'easy' | 'medium' | 'hard', questions?: string[], answers?: string[]) => {
    try {
      const entry = learningEntries.find(e => e.id === entryId);
      if (!entry) return;

      // Convert reviews to ReviewData format for SpacedRepetitionEngine
      const reviewHistory: ReviewData[] = entry.reviews.map(r => ({
        date: r.date,
        difficulty: r.difficulty || 'medium',
        correct: true, // Assume correct for existing reviews
        responseTime: undefined
      }));

      // Calculate next review using advanced algorithm
      const { nextStep, intervalDays } = SpacedRepetitionEngine.calculateNextInterval(
        entry.step,
        reviewHistory,
        difficulty
      );

      const newReview: Review = {
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

      // Update local state
      setLearningEntries(prev => 
        prev.map(e => 
          e.id === entryId 
            ? { ...e, step: nextStep, reviews: updatedReviews }
            : e
        )
      );

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

  // Get today's entries
  const getTodaysEntries = () => {
    const today = new Date().toDateString();
    return learningEntries.filter(entry => 
      new Date(entry.createdAt).toDateString() === today
    );
  };

  // Get entries that need review using advanced algorithm
  const getReviewsToday = () => {
    const itemsForReview = SpacedRepetitionEngine.getItemsForReview(
      learningEntries.map(entry => ({
        id: entry.id,
        createdAt: entry.createdAt,
        step: entry.step,
        reviews: entry.reviews.map(r => ({
          date: r.date,
          difficulty: r.difficulty || 'medium',
          correct: true
        })),
        lastReviewDate: entry.reviews[entry.reviews.length - 1]?.date
      }))
    );

    return itemsForReview
      .map(item => learningEntries.find(e => e.id === item.id)!)
      .filter(Boolean)
      .sort((a, b) => b.step - a.step); // Prioritize higher steps
  };

  useEffect(() => {
    loadEntries();
  }, []);

  return {
    learningEntries,
    deletedEntries,
    todaysEntries: getTodaysEntries(),
    reviewsToday: getReviewsToday(),
    loading,
    addLearningEntry,
    deleteEntry,
    restoreEntry,
    permanentlyDeleteEntry,
    completeReview,
    refreshEntries: loadEntries
  };
};
