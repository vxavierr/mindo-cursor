export interface LearningEntry {
  id: string;
  title: string;
  content: string;
  context?: string;
  tags: string[];
  createdAt: string;
  step: number;
  reviews?: Array<{ 
    date: string; 
    difficulty?: 'easy' | 'medium' | 'hard';
  }>;
  // Novos campos para lógica avançada
  consecutiveDifficult?: number;
  consecutiveEasy?: number; 
  totalEasyInHistory?: number;
  visualProgress?: number;
  isProtected?: boolean;
}

export type LearningStatus = 'new' | 'normal' | 'easy' | 'difficult';

export interface LearningStatusInfo {
  status: LearningStatus;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface LearningState {
  currentStep: number;
  consecutiveDifficult: number;
  consecutiveEasy: number;
  totalEasyInHistory: number;
  visualProgress: number;
  isProtected: boolean;
}

export const getLearningStatus = (
  step: number,
  lastReview?: Date,
  difficulty?: 'easy' | 'normal' | 'difficult'
): LearningStatus => {
  if (step === 0) return 'new';
  if (difficulty === 'easy' && step >= 3) return 'easy';
  if (difficulty === 'difficult') return 'difficult';
  return 'normal';
};

export const getStatusInfo = (status: LearningStatus): LearningStatusInfo => {
  switch (status) {
    case 'new':
      return {
        status: 'new',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-300'
      };
    case 'easy':
      return {
        status: 'easy',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-300'
      };
    case 'difficult':
      return {
        status: 'difficult',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-300'
      };
    default:
      return {
        status: 'normal',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-300'
      };
  }
};

export const getStatusDot = (status: LearningStatus): string => {
  switch (status) {
    case 'new':
      return 'bg-blue-500';
    case 'easy':
      return 'bg-green-500';
    case 'difficult':
      return 'bg-red-500';
    default:
      return 'bg-yellow-500';
  }
};

export const formatBrazilianDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const getRelativeDate = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffTime = today.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'hoje';
  if (diffDays === 1) return 'ontem';
  if (diffDays > 1) return `${diffDays} dias atrás`;
  
  // Para datas futuras
  if (diffDays === -1) return 'amanhã';
  if (diffDays < -1) return `em ${Math.abs(diffDays)} dias`;
  
  return formatBrazilianDate(date);
};

export const calculateProgress = (currentStep: number, totalSteps: number = 7): number => {
  if (totalSteps === 0) return 0;
  return Math.min((currentStep / totalSteps) * 100, 100);
};

export const getProgressColor = (progress: number): string => {
  if (progress >= 80) return 'bg-green-500';
  if (progress >= 60) return 'bg-blue-500';
  if (progress >= 40) return 'bg-yellow-500';
  if (progress >= 20) return 'bg-orange-500';
  return 'bg-red-500';
};

export const limitTags = (tags: string[], maxTags: number = 3): string[] => {
  return tags.slice(0, maxTags);
};

export const validateTags = (tags: string[]): { isValid: boolean; error?: string } => {
  if (tags.length > 3) {
    return {
      isValid: false,
      error: 'Máximo de 3 tags permitido'
    };
  }
  
  const emptyTags = tags.filter(tag => !tag.trim());
  if (emptyTags.length > 0) {
    return {
      isValid: false,
      error: 'Tags não podem estar vazias'
    };
  }
  
  return { isValid: true };
};

/**
 * Verifica se o aprendizado tem proteção baseado em acertos
 */
export const hasProtection = (consecutiveEasy: number, totalEasyInHistory: number): boolean => {
  return consecutiveEasy >= 3 || totalEasyInHistory >= 4;
};

/**
 * Calcula o threshold de reset baseado na proteção
 */
export const getResetThreshold = (isProtected: boolean): number => {
  return isProtected ? 6 : 4; // 6 "difíceis" se protegido, 4 se não
};

/**
 * Calcula penalidade de progresso de forma gradativa
 */
export const calculateProgressPenalty = (
  currentProgress: number,
  consecutiveDifficult: number,
  isProtected: boolean
): number => {
  
  if (isProtected) {
    // Penalidade mais suave com proteção: -5%, -7%, -9%, -11%, -13%
    const protectedPenalties = [5, 7, 9, 11, 13];
    const penalty = protectedPenalties[consecutiveDifficult - 1] || 15;
    return Math.max(currentProgress - penalty, 0);
  } else {
    // Penalidade normal sem proteção: -8%, -12%, -15%
    const normalPenalties = [8, 12, 15];
    const penalty = normalPenalties[consecutiveDifficult - 1] || 100; // 4ª vez = reset
    
    if (consecutiveDifficult >= 4) {
      return 0; // Reset total na 4ª vez
    }
    
    return Math.max(currentProgress - penalty, 0);
  }
};

/**
 * Processa resposta de dificuldade e atualiza estado do aprendizado
 */
export const handleDifficultyResponse = (
  entry: LearningEntry,
  difficulty: 'easy' | 'medium' | 'hard'
): LearningEntry => {
  
  // Inicializar campos se não existirem
  const currentState = {
    consecutiveDifficult: entry.consecutiveDifficult || 0,
    consecutiveEasy: entry.consecutiveEasy || 0,
    totalEasyInHistory: entry.totalEasyInHistory || 0,
    visualProgress: entry.visualProgress || calculateProgress(entry.step),
    isProtected: entry.isProtected || false
  };

  const newState = { ...currentState };
  let newStep = entry.step;

  switch (difficulty) {
    case 'easy':
      newStep = Math.min(entry.step + 1, 6);
      newState.consecutiveEasy++;
      newState.totalEasyInHistory++;
      newState.consecutiveDifficult = 0; // Reset contador de difíceis
      newState.visualProgress = calculateProgress({ ...entry, step: newStep });
      break;
      
    case 'medium':
      newStep = Math.min(entry.step + 1, 6);
      newState.consecutiveEasy = 0;
      newState.consecutiveDifficult = 0;
      newState.visualProgress = calculateProgress({ ...entry, step: newStep });
      break;
      
    case 'hard':
      newState.consecutiveDifficult++;
      newState.consecutiveEasy = 0;
      newState.isProtected = hasProtection(currentState.consecutiveEasy, currentState.totalEasyInHistory);
      
      const resetThreshold = getResetThreshold(newState.isProtected);
      
      if (newState.consecutiveDifficult >= resetThreshold) {
        // Reset total
        newStep = 0;
        newState.consecutiveDifficult = 0;
        newState.isProtected = false;
        newState.visualProgress = 0;
      } else {
        // Mantém step, mas aplica penalidade gradativa no progresso visual
        newStep = entry.step; // Mantém step atual
        const currentProgress = calculateProgress(entry.step);
        newState.visualProgress = calculateProgressPenalty(
          currentProgress,
          newState.consecutiveDifficult,
          newState.isProtected
        );
      }
      break;
  }

  return {
    ...entry,
    step: newStep,
    consecutiveDifficult: newState.consecutiveDifficult,
    consecutiveEasy: newState.consecutiveEasy,
    totalEasyInHistory: newState.totalEasyInHistory,
    visualProgress: newState.visualProgress,
    isProtected: newState.isProtected
  };
};

/**
 * Inicializa campos da lógica avançada para aprendizados existentes
 */
export const initializeAdvancedFields = (entry: LearningEntry): LearningEntry => {
  return {
    ...entry,
    consecutiveDifficult: entry.consecutiveDifficult || 0,
    consecutiveEasy: entry.consecutiveEasy || 0,
    totalEasyInHistory: entry.totalEasyInHistory || 0,
    visualProgress: entry.visualProgress || calculateProgress(entry.step),
    isProtected: entry.isProtected || false
  };
}; 