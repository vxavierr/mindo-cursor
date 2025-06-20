
export interface ReviewData {
  date: string;
  difficulty: 'easy' | 'medium' | 'hard';
  responseTime?: number;
  correct: boolean;
}

export interface LearningStats {
  totalReviews: number;
  correctAnswers: number;
  averageResponseTime: number;
  retentionRate: number;
  lastReviewDate?: string;
  nextReviewDate: string;
  difficulty: number; // 0-1 (fácil-difícil)
}

export class SpacedRepetitionEngine {
  // Intervalos base em dias
  private static readonly BASE_INTERVALS = [1, 3, 7, 14, 30, 60, 120];
  
  // Fatores de ajuste baseados na dificuldade
  private static readonly DIFFICULTY_FACTORS = {
    easy: 1.3,
    medium: 1.0,
    hard: 0.8
  };

  /**
   * Calcula o próximo intervalo de revisão baseado no histórico
   */
  static calculateNextInterval(
    currentStep: number,
    reviewHistory: ReviewData[],
    lastDifficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ): { nextStep: number; intervalDays: number; nextReviewDate: Date } {
    let nextStep = Math.min(currentStep + 1, this.BASE_INTERVALS.length - 1);
    let baseInterval = this.BASE_INTERVALS[nextStep];

    // Analisar histórico recente (últimas 3 revisões)
    const recentReviews = reviewHistory.slice(-3);
    const recentPerformance = this.analyzePerformance(recentReviews);

    // Ajustar intervalo baseado na performance
    let adjustmentFactor = this.DIFFICULTY_FACTORS[lastDifficulty];
    
    // Ajuste adicional baseado na performance histórica
    if (recentPerformance.retentionRate > 0.9) {
      adjustmentFactor *= 1.2; // Acelerar se está indo muito bem
    } else if (recentPerformance.retentionRate < 0.7) {
      adjustmentFactor *= 0.7; // Desacelerar se está com dificuldade
      nextStep = Math.max(currentStep, 1); // Não regredir muito
    }

    const adjustedInterval = Math.round(baseInterval * adjustmentFactor);
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + adjustedInterval);

    // Reset para step anterior se performance muito ruim
    if (lastDifficulty === 'hard' && recentPerformance.retentionRate < 0.5) {
      nextStep = Math.max(currentStep - 1, 0);
      const resetInterval = Math.round(this.BASE_INTERVALS[nextStep] * 0.8);
      nextReviewDate.setDate(new Date().getDate() + resetInterval);
    }

    return {
      nextStep,
      intervalDays: adjustedInterval,
      nextReviewDate
    };
  }

  /**
   * Analisa a performance baseada no histórico de revisões
   */
  static analyzePerformance(reviews: ReviewData[]): {
    retentionRate: number;
    averageResponseTime: number;
    consistencyScore: number;
  } {
    if (reviews.length === 0) {
      return { retentionRate: 0.8, averageResponseTime: 0, consistencyScore: 0.5 };
    }

    const correctAnswers = reviews.filter(r => r.correct).length;
    const retentionRate = correctAnswers / reviews.length;

    const responseTimes = reviews
      .filter(r => r.responseTime)
      .map(r => r.responseTime!);
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 0;

    // Score de consistência baseado na variação das dificuldades
    const difficulties = reviews.map(r => r.difficulty);
    const consistencyScore = this.calculateConsistencyScore(difficulties);

    return {
      retentionRate,
      averageResponseTime,
      consistencyScore
    };
  }

  /**
   * Determina quais itens precisam ser revisados hoje
   */
  static getItemsForReview(
    learningEntries: Array<{
      id: string;
      createdAt: string;
      step: number;
      reviews: ReviewData[];
      lastReviewDate?: string;
    }>
  ): Array<{ id: string; priority: number; overdue: boolean }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return learningEntries
      .map(entry => {
        const lastReview = entry.reviews[entry.reviews.length - 1];
        const lastReviewDate = lastReview 
          ? new Date(lastReview.date)
          : new Date(entry.createdAt);
        
        const daysSinceLastReview = Math.floor(
          (today.getTime() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        const expectedInterval = this.BASE_INTERVALS[entry.step] || 1;
        const overdue = daysSinceLastReview >= expectedInterval;
        
        // Calcular prioridade (maior número = maior prioridade)
        let priority = 0;
        if (overdue) {
          priority = daysSinceLastReview - expectedInterval + 100;
          
          // Prioridade extra para itens com performance ruim
          const performance = this.analyzePerformance(entry.reviews);
          if (performance.retentionRate < 0.7) {
            priority += 50;
          }
        }

        return {
          id: entry.id,
          priority,
          overdue
        };
      })
      .filter(item => item.overdue)
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Calcula estatísticas de aprendizado
   */
  static calculateLearningStats(reviews: ReviewData[]): LearningStats {
    const performance = this.analyzePerformance(reviews);
    const lastReview = reviews[reviews.length - 1];
    
    // Calcular dificuldade baseada na performance
    let difficulty = 0.5; // neutro
    if (performance.retentionRate > 0.8) {
      difficulty = Math.max(0.2, difficulty - 0.2);
    } else if (performance.retentionRate < 0.6) {
      difficulty = Math.min(0.8, difficulty + 0.2);
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + 1); // placeholder

    return {
      totalReviews: reviews.length,
      correctAnswers: reviews.filter(r => r.correct).length,
      averageResponseTime: performance.averageResponseTime,
      retentionRate: performance.retentionRate,
      lastReviewDate: lastReview?.date,
      nextReviewDate: nextReviewDate.toISOString(),
      difficulty
    };
  }

  private static calculateConsistencyScore(difficulties: ('easy' | 'medium' | 'hard')[]): number {
    if (difficulties.length < 2) return 0.5;

    const difficultyValues = difficulties.map(d => {
      switch (d) {
        case 'easy': return 1;
        case 'medium': return 2;
        case 'hard': return 3;
        default: return 2;
      }
    });

    const avg = difficultyValues.reduce((a, b) => a + b, 0) / difficultyValues.length;
    const variance = difficultyValues.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / difficultyValues.length;
    
    // Normalizar para 0-1 (menor variância = maior consistência)
    return Math.max(0, 1 - variance / 2);
  }
}
