import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SpacedRepetitionEngine, ReviewData } from '@/utils/spacedRepetition';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';

export interface LearningEntry {
  id: string;
  numeroId: number;
  title: string;
  content: string;
  context?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  step: number;
  reviews: Array<{ 
    date: string; 
    questions?: string[]; 
    answers?: string[]; 
    step?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  }>;
  userId?: string;
}

export const useLearning = () => {
  const [learningEntries, setLearningEntries] = useState<LearningEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const ai = useEnhancedAI();

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

  // Helper function to serialize reviews
  const serializeReviews = (reviews: any[]): any => {
    try {
      return reviews;
    } catch {
      return [];
    }
  };

  // Carregar entradas ativas
  const loadEntries = async () => {
    try {
      setLoading(true);
      console.log('Carregando entradas ativas...');
      
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

      console.log('Entradas carregadas:', data);

      const entries: LearningEntry[] = data?.map(item => ({
        id: item.id,
        numeroId: item.numero_id,
        title: item.titulo || '',
        content: item.conteudo,
        context: item.contexto || '',
        tags: Array.isArray(item.tags) ? item.tags : [],
        createdAt: item.data_criacao || new Date().toISOString(),
        updatedAt: item.data_ultima_revisao,
        step: item.step || 0,
        reviews: convertJsonToReviews(item.revisoes),
        userId: item.usuario_id || undefined
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
        revisoes: serializeReviews([]),
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

      // Atualizar estado local
      const newLearningEntry: LearningEntry = {
        id: data.id,
        numeroId: data.numero_id,
        title: data.titulo,
        content: data.conteudo,
        context: data.contexto,
        tags: data.tags,
        createdAt: data.data_criacao,
        updatedAt: data.data_ultima_revisao,
        step: data.step,
        reviews: convertJsonToReviews(data.revisoes),
        userId: data.usuario_id
      };

      setLearningEntries(prev => [newLearningEntry, ...prev]);

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

  // Atualizar entrada existente
  const updateLearningEntry = async (entryId: string, updates: { 
    title?: string; 
    content?: string; 
    tags?: string[]; 
    context?: string; 
    reviews?: any[]; 
    step?: number 
  }) => {
    try {
      console.log('Atualizando entrada:', entryId, updates);
      
      const updateData: any = {};
      if (updates.title !== undefined) updateData.titulo = updates.title;
      if (updates.content !== undefined) updateData.conteudo = updates.content;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.context !== undefined) updateData.contexto = updates.context;
      if (updates.reviews !== undefined) updateData.revisoes = serializeReviews(updates.reviews);
      if (updates.step !== undefined) updateData.step = updates.step;
      updateData.data_ultima_revisao = new Date().toISOString();

      const { error } = await supabase
        .from('revisoes')
        .update(updateData)
        .eq('id', entryId);

      if (error) {
        console.error('Erro ao atualizar entrada:', error);
        toast({
          title: "Erro ao salvar alterações",
          description: "Verifique sua conexão e tente novamente",
          variant: "destructive"
        });
        return false;
      }

      // Atualizar estado local
      setLearningEntries(prev => 
        prev.map(entry => 
          entry.id === entryId 
            ? { 
                ...entry, 
                title: updates.title !== undefined ? updates.title : entry.title,
                content: updates.content !== undefined ? updates.content : entry.content,
                tags: updates.tags !== undefined ? updates.tags : entry.tags,
                context: updates.context !== undefined ? updates.context : entry.context,
                reviews: updates.reviews !== undefined ? updates.reviews : entry.reviews,
                step: updates.step !== undefined ? updates.step : entry.step,
                updatedAt: updateData.data_ultima_revisao
              }
            : entry
        )
      );

      toast({
        title: "Alterações salvas!",
        description: "O aprendizado foi atualizado com sucesso."
      });

      return true;
    } catch (error) {
      console.error('Erro inesperado ao atualizar entrada:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente",
        variant: "destructive"
      });
      return false;
    }
  };

  // Mover para lixeira (substituindo deleteEntry por compatibilidade com useTrashLearning)
  const deleteEntry = async (entryId: string) => {
    try {
      console.log('Movendo entrada para lixeira:', entryId);
      
      // Encontrar a entrada a ser movida
      const entryToMove = learningEntries.find(e => e.id === entryId);
      if (!entryToMove) {
        console.error('Entrada não encontrada:', entryId);
        return false;
      }

      // Remover otimisticamente da lista local primeiro
      setLearningEntries(prev => prev.filter(e => e.id !== entryId));

      // Converter entrada para formato da lixeira
      const entryForTrash = {
        conteudo: entryToMove.content,
        titulo: entryToMove.title,
        tags: entryToMove.tags,
        data_criacao: entryToMove.createdAt,
        contexto: entryToMove.context || '',
        step: entryToMove.step,
        revisoes: serializeReviews(entryToMove.reviews),
      };

      // Inserir na lixeira
      const { error: insertError } = await supabase
        .from('lixeira_aprendizados')
        .insert([entryForTrash]);

      if (insertError) {
        console.error('Erro ao mover para lixeira:', insertError);
        // Reverter a remoção otimista se houve erro
        setLearningEntries(prev => [...prev, entryToMove].sort((a, b) => b.numeroId - a.numeroId));
        toast({
          title: "Erro ao mover para lixeira",
          description: "Verifique sua conexão e tente novamente",
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
        toast({
          title: "Erro ao excluir",
          description: "Verifique sua conexão e tente novamente",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Aprendizado excluído",
        description: "O aprendizado foi movido para a lixeira."
      });

      return true;
    } catch (error) {
      console.error('Erro inesperado ao excluir entrada:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente",
        variant: "destructive"
      });
      return false;
    }
  };

  // Restaurar entrada da lixeira
  const restoreEntry = async (entryId: string) => {
    try {
      console.log('Restaurando entrada da lixeira:', entryId);
      
      // Buscar entrada na lixeira
      const { data: trashEntry, error: fetchError } = await supabase
        .from('lixeira_aprendizados')
        .select('*')
        .eq('id_lixeira', entryId)
        .single();

      if (fetchError || !trashEntry) {
        console.error('Erro ao buscar entrada na lixeira:', fetchError);
        toast({
          title: "Erro ao restaurar",
          description: "Entrada não encontrada na lixeira",
          variant: "destructive"
        });
        return false;
      }

      // Inserir de volta na tabela principal
      const { data: restoredEntry, error: insertError } = await supabase
        .from('revisoes')
        .insert([{
          titulo: trashEntry.titulo,
          conteudo: trashEntry.conteudo,
          contexto: trashEntry.contexto,
          tags: trashEntry.tags,
          step: trashEntry.step || 0,
          revisoes: trashEntry.revisoes,
          data_criacao: trashEntry.data_criacao,
          data_ultima_revisao: new Date().toISOString(),
          usuario_id: null,
          status: 'ativo',
          hora_criacao: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Erro ao restaurar entrada:', insertError);
        toast({
          title: "Erro ao restaurar",
          description: "Verifique sua conexão e tente novamente",
          variant: "destructive"
        });
        return false;
      }

      // Remover da lixeira
      const { error: deleteError } = await supabase
        .from('lixeira_aprendizados')
        .delete()
        .eq('id_lixeira', entryId);

      if (deleteError) {
        console.error('Erro ao remover da lixeira:', deleteError);
      }

      // Recarregar entradas para incluir a restaurada
      await loadEntries();

      toast({
        title: "Aprendizado restaurado",
        description: "O aprendizado foi restaurado com sucesso."
      });

      return true;
    } catch (error) {
      console.error('Erro inesperado ao restaurar entrada:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente",
        variant: "destructive"
      });
      return false;
    }
  };

  // Exclusão permanente da lixeira
  const permanentlyDeleteEntry = async (entryId: string) => {
    try {
      console.log('Excluindo entrada permanentemente da lixeira:', entryId);
      
      const { error } = await supabase
        .from('lixeira_aprendizados')
        .delete()
        .eq('id_lixeira', entryId);

      if (error) {
        console.error('Erro ao excluir permanentemente:', error);
        toast({
          title: "Erro ao excluir permanentemente",
          description: "Verifique sua conexão e tente novamente",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Aprendizado excluído permanentemente",
        description: "O aprendizado foi excluído definitivamente."
      });

      return true;
    } catch (error) {
      console.error('Erro inesperado ao excluir permanentemente:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente",
        variant: "destructive"
      });
      return false;
    }
  };

  // Completar revisão usando SpacedRepetitionEngine
  const completeReview = async (entryId: string, difficulty: 'easy' | 'medium' | 'hard', questions?: string[], answers?: string[]) => {
    try {
      console.log('Completando revisão:', entryId, difficulty);
      const entry = learningEntries.find(e => e.id === entryId);
      if (!entry) return;

      // Converter reviews para o formato esperado pelo SpacedRepetitionEngine
      const reviewHistory: ReviewData[] = entry.reviews.map(review => ({
        date: review.date,
        difficulty: review.difficulty || 'medium',
        correct: review.difficulty !== 'hard', // Assumir que não-hard = correto
        responseTime: undefined
      }));

      // Calcular próximo intervalo usando SpacedRepetitionEngine
      const { nextStep, intervalDays } = SpacedRepetitionEngine.calculateNextInterval(
        entry.step, 
        reviewHistory, 
        difficulty
      );

      const newReview = {
        date: new Date().toISOString(),
        questions: questions || [],
        answers: answers || [],
        step: nextStep,
        difficulty
      };

      const updatedReviews = [...entry.reviews, newReview];

      // Atualizar no banco usando updateLearningEntry
      await updateLearningEntry(entryId, {
        reviews: updatedReviews,
        step: nextStep
      });

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

  // Obter revisões de hoje usando SpacedRepetitionEngine
  const getReviewsToday = () => {
    // Converter entradas para o formato esperado pelo SpacedRepetitionEngine
    const entriesForReview = learningEntries.map(entry => ({
      id: entry.id,
      createdAt: entry.createdAt,
      step: entry.step,
      reviews: entry.reviews.map(review => ({
        date: review.date,
        difficulty: review.difficulty || 'medium',
        correct: review.difficulty !== 'hard',
        responseTime: undefined
      })) as ReviewData[]
    }));

    const reviewItems = SpacedRepetitionEngine.getItemsForReview(entriesForReview);
    const reviewIds = reviewItems.map(item => item.id);
    return learningEntries.filter(e => reviewIds.includes(e.id) && e.step !== -1);
  };

  // Integração com IA
  const improveText = ai.improveText;
  const generateTitleAndTags = ai.generateTitleAndTags;
  const transcribeAudio = ai.transcribeAudio;
  const isProcessing = ai.isProcessing;

  useEffect(() => {
    loadEntries();
  }, []);

  return {
    // Estado
    learningEntries,
    todaysEntries: getTodaysEntries(),
    reviewsToday: getReviewsToday(),
    loading,
    
    // CRUD básico
    addLearningEntry,
    updateLearningEntry,
    deleteEntry, // move para lixeira
    restoreEntry,
    permanentlyDeleteEntry,
    
    // Sistema de revisões
    completeReview,
    getTodaysEntries,
    getReviewsToday,
    
    // IA
    improveText,
    generateTitleAndTags,
    transcribeAudio,
    isProcessing,
    
    // Utilidades
    refreshEntries: loadEntries
  };
}; 