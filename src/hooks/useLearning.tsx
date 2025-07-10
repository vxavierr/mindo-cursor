import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SpacedRepetitionEngine, ReviewData } from '@/utils/spacedRepetition';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { useAuth } from '@/contexts/AuthContext';

export interface LearningEntry {
  id: string;
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
  const { user } = useAuth();

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
      
      let query = supabase
        .from('revisoes')
        .select('*')
        .order('data_criacao', { ascending: false });

      // Se o usuário estiver logado, filtrar por usuário
      if (user?.id) {
        query = query.eq('usuario_id', user.id);
      } else {
        // Se não estiver logado, mostrar apenas entradas sem usuário
        query = query.is('usuario_id', null);
      }

      const { data, error } = await query;

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
      console.log('Usuário atual:', user?.id || 'Não autenticado');
      
      const agora = new Date().toISOString();
      const newEntry = {
        titulo: title,
        conteudo: content,
        contexto: context || null,
        tags: tags || [],
        step: 0,
        revisoes: serializeReviews([]),
        data_criacao: agora,
        data_ultima_revisao: agora,
        usuario_id: user?.id || null,
        status: 'ativo',
        hora_criacao: agora
      };

      // Log do objeto antes de inserir
      console.log('📝 Inserindo nova entrada - Objeto:', JSON.stringify(newEntry, null, 2));
      console.log('📝 Verificação - titulo presente:', !!newEntry.titulo);
      console.log('📝 Verificação - conteudo presente:', !!newEntry.conteudo);
      console.log('📝 Verificação - usuario_id presente:', !!newEntry.usuario_id);
      console.log('📝 Verificação - usuario_id valor:', newEntry.usuario_id);

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
        description: "Aprendizado foi salvo com sucesso."
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

      let query = supabase
        .from('revisoes')
        .update(updateData)
        .eq('id', entryId);

      // Se o usuário estiver logado, verificar se a entrada pertence a ele
      if (user?.id) {
        query = query.eq('usuario_id', user.id);
      } else {
        // Se não estiver logado, verificar se a entrada não tem usuário
        query = query.is('usuario_id', null);
      }

      const { error } = await query;

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
        console.error('Entrada não encontrada na lista local:', entryId);
        toast({
          title: "Erro",
          description: "Aprendizado não encontrado",
          variant: "destructive"
        });
        return false;
      }

      // 1. PRIMEIRO: Inserir na lixeira (usando UUID como id_lixeira)
      const agora = new Date().toISOString();
      const entryForTrash = {
        id_lixeira: entryToMove.id, // UUID original preservado
        conteudo: entryToMove.content,
        titulo: entryToMove.title || null,
        contexto: entryToMove.context || null,
        tags: entryToMove.tags || [],
        step: entryToMove.step,
        revisoes: serializeReviews(entryToMove.reviews),
        data_criacao: entryToMove.createdAt,
        data_exclusao: agora,
        hora_exclusao: agora,
        usuario_id: entryToMove.userId || null, // Manter o usuario_id original
      };

      console.log('🗑️ Inserindo na lixeira:', { 
        id_lixeira: entryForTrash.id_lixeira, 
        usuario_id: entryForTrash.usuario_id 
      });

      const { error: insertError } = await supabase
        .from('lixeira_aprendizados')
        .insert([entryForTrash]);

      if (insertError) {
        console.error('Erro ao inserir na lixeira:', insertError);
        toast({
          title: "Erro ao mover para lixeira",
          description: `Falha na inserção: ${insertError.message}`,
          variant: "destructive"
        });
        return false;
      }

      // 2. SEGUNDO: Remover da tabela principal (usando apenas o UUID)
      console.log('🗑️ Removendo da tabela principal:', entryToMove.id);
      
      let deleteQuery = supabase
        .from('revisoes')
        .delete()
        .eq('id', entryToMove.id); // Usar UUID direto

      // Aplicar filtro de usuário apenas se o usuário estiver logado
      if (user?.id && entryToMove.userId) {
        deleteQuery = deleteQuery.eq('usuario_id', user.id);
      } else if (!user?.id && !entryToMove.userId) {
        // Para usuários não logados, filtrar entradas sem usuário
        deleteQuery = deleteQuery.is('usuario_id', null);
      }

      const { error: deleteError, count } = await deleteQuery;

      if (deleteError) {
        console.error('Erro ao remover da tabela principal:', deleteError);
        // Tentar remover da lixeira para reverter
        await supabase
          .from('lixeira_aprendizados')
          .delete()
          .eq('id_lixeira', entryToMove.id);
        
        toast({
          title: "Erro ao remover da tabela principal",
          description: `Falha na remoção: ${deleteError.message}`,
          variant: "destructive"
        });
        return false;
      }

      // 3. TERCEIRO: Atualizar estado local (remoção otimista)
      setLearningEntries(prev => prev.filter(e => e.id !== entryId));

      toast({
        title: "Aprendizado excluído",
        description: "O aprendizado foi movido para a lixeira com sucesso."
      });

      console.log('✅ Entrada movida para lixeira com sucesso:', entryToMove.id);
      return true;

    } catch (error) {
      console.error('Erro inesperado ao mover para lixeira:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns segundos",
        variant: "destructive"
      });
      return false;
    }
  };

  // Restaurar entrada da lixeira
  const restoreEntry = async (entryId: string) => {
    try {
      console.log('Restaurando entrada da lixeira:', entryId);
      
      // 1. PRIMEIRO: Buscar entrada na lixeira usando UUID
      let query = supabase
        .from('lixeira_aprendizados')
        .select('*')
        .eq('id_lixeira', entryId); // Usar UUID diretamente

      // Aplicar filtro de usuário se necessário
      if (user?.id) {
        // Se usuário logado, filtrar por sua propriedade
        query = query.eq('usuario_id', user.id);
      } else {
        // Se não logado, apenas entradas sem usuário
        query = query.is('usuario_id', null);
      }

      const { data: trashEntry, error: fetchError } = await query.single();

      if (fetchError || !trashEntry) {
        console.error('Erro ao buscar na lixeira:', fetchError);
        toast({
          title: "Erro ao restaurar",
          description: "Aprendizado não encontrado na lixeira ou sem permissão",
          variant: "destructive"
        });
        return false;
      }

      console.log('🔄 Restaurando entrada:', { 
        id_lixeira: trashEntry.id_lixeira,
        usuario_id: trashEntry.usuario_id
      });

      // 2. SEGUNDO: Inserir de volta na tabela principal com UUID original
      const agora = new Date().toISOString();
      const restoredData = {
        id: trashEntry.id_lixeira, // Restaurar com UUID original
        titulo: trashEntry.titulo,
        conteudo: trashEntry.conteudo,
        contexto: trashEntry.contexto,
        tags: trashEntry.tags || [],
        step: trashEntry.step || 0,
        revisoes: trashEntry.revisoes,
        data_criacao: trashEntry.data_criacao,
        data_ultima_revisao: agora,
        usuario_id: trashEntry.usuario_id, // Manter o usuario_id original
        status: 'ativo',
        hora_criacao: agora
      };

      const { data: restoredEntry, error: insertError } = await supabase
        .from('revisoes')
        .insert([restoredData])
        .select()
        .single();

      if (insertError) {
        console.error('Erro ao restaurar entrada:', insertError);
        toast({
          title: "Erro ao restaurar",
          description: `Falha na restauração: ${insertError.message}`,
          variant: "destructive"
        });
        return false;
      }

      // 3. TERCEIRO: Remover da lixeira usando UUID
      const { error: deleteError } = await supabase
        .from('lixeira_aprendizados')
        .delete()
        .eq('id_lixeira', entryId);

      if (deleteError) {
        console.error('Erro ao remover da lixeira:', deleteError);
        // Tentar reverter a inserção na tabela principal
        await supabase
          .from('revisoes')
          .delete()
          .eq('id', trashEntry.id_lixeira);
        
        toast({
          title: "Erro ao limpar lixeira",
          description: "Restauração revertida por falha na limpeza",
          variant: "destructive"
        });
        return false;
      }

      // 4. QUARTO: Recarregar entradas para incluir a restaurada
      await loadEntries();

      toast({
        title: "Aprendizado restaurado",
        description: "O aprendizado foi restaurado com sucesso."
      });

      console.log('✅ Entrada restaurada com sucesso:', entryId);
      return true;

    } catch (error) {
      console.error('Erro inesperado ao restaurar entrada:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns segundos",
        variant: "destructive"
      });
      return false;
    }
  };

  // Exclusão permanente da lixeira
  const permanentlyDeleteEntry = async (entryId: string) => {
    try {
      console.log('Excluindo permanentemente da lixeira:', entryId);
      
      // Excluir da lixeira usando UUID diretamente
      let deleteQuery = supabase
        .from('lixeira_aprendizados')
        .delete()
        .eq('id_lixeira', entryId); // Usar UUID direto

      // Aplicar filtro de usuário se necessário
      if (user?.id) {
        // Se usuário logado, verificar propriedade
        deleteQuery = deleteQuery.eq('usuario_id', user.id);
      } else {
        // Se não logado, apenas entradas sem usuário
        deleteQuery = deleteQuery.is('usuario_id', null);
      }

      const { error, count } = await deleteQuery;

      if (error) {
        console.error('Erro ao excluir permanentemente:', error);
        toast({
          title: "Erro ao excluir permanentemente",
          description: `Falha na exclusão: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

      if (count === 0) {
        toast({
          title: "Aprendizado não encontrado",
          description: "O aprendizado pode já ter sido excluído ou você não tem permissão",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Aprendizado excluído permanentemente",
        description: "O aprendizado foi excluído definitivamente da lixeira."
      });

      console.log('✅ Entrada excluída permanentemente:', entryId);
      return true;

    } catch (error) {
      console.error('Erro inesperado ao excluir permanentemente:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns segundos",
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
  }, [user?.id]);

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