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
  reviews: any[];
  userId?: string;
}

function parseReviews(raw: any): any[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return []; }
  }
  return [];
}

function serializeReviews(reviews: any[]): string {
  try { return JSON.stringify(reviews); } catch { return '[]'; }
}

export const useLearningEngine = () => {
  const [learningEntries, setLearningEntries] = useState<LearningEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const ai = useEnhancedAI();

  // --- CRUD PRINCIPAL ---
  const loadEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('revisoes')
      .select('*')
      .order('numero_id', { ascending: false });
    if (error) {
      toast({ title: 'Erro ao carregar aprendizados', description: error.message });
      setLoading(false);
      return;
    }
    const entries: LearningEntry[] = (data || []).map((item: any) => ({
      id: item.id,
      numeroId: item.numero_id,
      title: item.titulo || '',
      content: item.conteudo,
      context: item.contexto || '',
      tags: Array.isArray(item.tags) ? item.tags : [],
      createdAt: item.data_criacao || new Date().toISOString(),
      updatedAt: item.data_ultima_revisao,
      step: item.step || 0,
      reviews: parseReviews(item.revisoes),
      userId: item.usuario_id || undefined,
    }));
    setLearningEntries(entries);
    setLoading(false);
  };

  useEffect(() => { loadEntries(); }, []);

  const addLearningEntry = async (content: string, title: string, tags: string[], context?: string) => {
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
    };
    const { data, error } = await supabase.from('revisoes').insert([newEntry]).select();
    if (error) {
      toast({ title: 'Erro ao adicionar aprendizado', description: error.message });
      return;
    }
    if (data && data[0]) {
      setLearningEntries(prev => [
        {
          id: data[0].id,
          numeroId: data[0].numero_id,
          title: data[0].titulo,
          content: data[0].conteudo,
          context: data[0].contexto,
          tags: data[0].tags,
          createdAt: data[0].data_criacao,
          updatedAt: data[0].data_ultima_revisao,
          step: data[0].step,
          reviews: parseReviews(data[0].revisoes),
          userId: data[0].usuario_id,
        },
        ...prev,
      ]);
    }
  };

  const updateLearningEntry = async (entryId: string, updates: { title?: string; content?: string; tags?: string[]; context?: string; reviews?: any[]; step?: number }) => {
    const updateData: any = {};
    if (updates.title !== undefined) updateData.titulo = updates.title;
    if (updates.content !== undefined) updateData.conteudo = updates.content;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.context !== undefined) updateData.contexto = updates.context;
    if (updates.reviews !== undefined) updateData.revisoes = serializeReviews(updates.reviews);
    if (updates.step !== undefined) updateData.step = updates.step;
    updateData.data_ultima_revisao = new Date().toISOString();
    const { error } = await supabase.from('revisoes').update(updateData).eq('id', entryId);
    if (error) {
      toast({ title: 'Erro ao atualizar aprendizado', description: error.message });
      return;
    }
    setLearningEntries(prev => prev.map(e => e.id === entryId ? { ...e, ...updates, updatedAt: updateData.data_ultima_revisao, reviews: updates.reviews ?? e.reviews, step: updates.step ?? e.step } : e));
  };

  // --- LIXEIRA ---
  const moveToTrash = async (entry: LearningEntry) => {
    // Monta o objeto para a lixeira
    const trashEntry = {
      conteudo: entry.content,
      titulo: entry.title,
      tags: entry.tags,
      data_criacao: entry.createdAt,
      contexto: entry.context || '',
      step: entry.step,
      revisoes: serializeReviews(entry.reviews),
    };
    // Insere na lixeira
    const { error: insertError } = await supabase.from('lixeira_aprendizados').insert([trashEntry]);
    if (insertError) {
      toast({ title: 'Erro ao mover para lixeira', description: insertError.message });
      return false;
    }
    // Remove da tabela principal
    const { error: deleteError } = await supabase.from('revisoes').delete().eq('id', entry.id);
    if (deleteError) {
      toast({ title: 'Erro ao remover da tabela principal', description: deleteError.message });
      return false;
    }
    setLearningEntries(prev => prev.filter(e => e.id !== entry.id));
    toast({ title: 'Movido para lixeira', description: `Aprendizado #${entry.numeroId} foi movido para a lixeira.` });
    return true;
  };

  // --- REVIEWS (SPACED REPETITION) ---
  const getTodaysEntries = () => {
    const today = new Date().toDateString();
    return learningEntries.filter(e => new Date(e.createdAt).toDateString() === today);
  };

  const getReviewsToday = () => {
    const reviewItems = SpacedRepetitionEngine.getItemsForReview(learningEntries);
    const reviewIds = reviewItems.map(item => item.id);
    return learningEntries.filter(e => reviewIds.includes(e.id) && e.step !== -1);
  };

  const completeReview = async (entryId: string, difficulty: 'easy' | 'medium' | 'hard', questions?: string[], answers?: string[]) => {
    const entry = learningEntries.find(e => e.id === entryId);
    if (!entry) return;
    const reviewHistory: ReviewData[] = Array.isArray(entry.reviews) ? entry.reviews.map((r: any) => ({ ...r })) : [];
    const { nextStep, intervalDays } = SpacedRepetitionEngine.calculateNextInterval(entry.step, difficulty, reviewHistory);
    const newReview = {
      date: new Date().toISOString(),
      difficulty,
      questions,
      answers
    };
    const updatedReviews = [...reviewHistory, newReview];
    await updateLearningEntry(entryId, { content: entry.content, title: entry.title, tags: entry.tags, context: entry.context, reviews: updatedReviews, step: nextStep });
  };

  // --- IA ---
  const improveText = ai.improveText;
  const generateTitleAndTags = ai.generateTitleAndTags;
  const transcribeAudio = ai.transcribeAudio;
  const isProcessing = ai.isProcessing;

  return {
    learningEntries,
    loading,
    addLearningEntry,
    updateLearningEntry,
    getTodaysEntries,
    getReviewsToday,
    completeReview,
    improveText,
    generateTitleAndTags,
    transcribeAudio,
    isProcessing,
    moveToTrash
  };
}; 