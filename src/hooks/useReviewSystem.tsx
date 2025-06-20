
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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
}

export const useReviewSystem = (learningEntries: LearningEntry[]) => {
  const [reviewsToday, setReviewsToday] = useState<LearningEntry[]>([]);
  const { toast } = useToast();

  // Intervalos de revisão espaçada em dias
  const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60];

  // Calcular quais entradas precisam de revisão
  const calculateReviewsNeeded = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entriesToReview = learningEntries.filter(entry => {
      const createdDate = new Date(entry.createdAt);
      createdDate.setHours(0, 0, 0, 0);

      // Se tem revisões, usar a data da última revisão
      let lastReviewDate = createdDate;
      if (entry.reviews && entry.reviews.length > 0) {
        const lastReview = entry.reviews[entry.reviews.length - 1];
        lastReviewDate = new Date(lastReview.date);
        lastReviewDate.setHours(0, 0, 0, 0);
      }

      const daysSinceLastReview = Math.floor(
        (today.getTime() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const currentStep = Math.min(entry.step, REVIEW_INTERVALS.length - 1);
      const requiredInterval = REVIEW_INTERVALS[currentStep];

      return daysSinceLastReview >= requiredInterval;
    });

    // Ordenar por prioridade: mais antigos primeiro, depois por step menor
    const sortedEntries = entriesToReview.sort((a, b) => {
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);
      
      // Primeiro por data de criação (mais antigos primeiro)
      if (aDate.getTime() !== bDate.getTime()) {
        return aDate.getTime() - bDate.getTime();
      }
      
      // Depois por step (menores primeiro - precisam de mais revisão)
      return a.step - b.step;
    });

    setReviewsToday(sortedEntries);
  };

  // Calcular próxima data de revisão baseada na dificuldade
  const calculateNextReviewDate = (currentStep: number, difficulty: 'easy' | 'medium' | 'hard') => {
    let nextStep = currentStep;
    
    switch (difficulty) {
      case 'easy':
        // Se foi fácil, avança um step extra
        nextStep = Math.min(currentStep + 2, REVIEW_INTERVALS.length - 1);
        break;
      case 'medium':
        // Avança normalmente
        nextStep = Math.min(currentStep + 1, REVIEW_INTERVALS.length - 1);
        break;
      case 'hard':
        // Se foi difícil, repete o step atual ou volta um
        nextStep = Math.max(currentStep - 1, 0);
        break;
    }

    const interval = REVIEW_INTERVALS[nextStep];
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);

    return {
      nextStep,
      nextDate: nextDate.toISOString(),
      intervalDays: interval
    };
  };

  // Obter estatísticas de revisão
  const getReviewStats = () => {
    const totalEntries = learningEntries.length;
    const reviewedToday = learningEntries.filter(entry => {
      const today = new Date().toDateString();
      return entry.reviews.some(review => 
        new Date(review.date).toDateString() === today
      );
    }).length;

    const pendingReviews = reviewsToday.length;
    
    const avgStep = totalEntries > 0 
      ? learningEntries.reduce((sum, entry) => sum + entry.step, 0) / totalEntries
      : 0;

    return {
      totalEntries,
      reviewedToday,
      pendingReviews,
      averageStep: Math.round(avgStep * 10) / 10
    };
  };

  useEffect(() => {
    calculateReviewsNeeded();
  }, [learningEntries]);

  return {
    reviewsToday,
    calculateNextReviewDate,
    getReviewStats,
    refreshReviews: calculateReviewsNeeded
  };
};
