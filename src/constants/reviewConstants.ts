/**
 * Constants for review system
 * Consolidates duplicated constants across review components
 */

export const DIFFICULTY_OPTIONS = [
  { 
    value: 'easy' as const, 
    label: 'Fácil', 
    color: 'from-green-500 to-emerald-500',
    description: 'Lembrei facilmente',
    icon: '😊'
  },
  { 
    value: 'medium' as const, 
    label: 'Médio', 
    color: 'from-yellow-500 to-orange-500',
    description: 'Lembrei com algum esforço',
    icon: '🤔'
  },
  { 
    value: 'hard' as const, 
    label: 'Difícil', 
    color: 'from-red-500 to-pink-500',
    description: 'Não consegui lembrar',
    icon: '😅'
  }
] as const;

export const GRADIENT_BACKGROUNDS = {
  primary: 'bg-gradient-to-br from-purple-900 via-purple-800 to-black',
  secondary: 'bg-gradient-to-br from-blue-900 via-blue-800 to-black',
  success: 'bg-gradient-to-br from-green-900 via-green-800 to-black',
  warning: 'bg-gradient-to-br from-orange-900 via-orange-800 to-black',
  error: 'bg-gradient-to-br from-red-900 via-red-800 to-black'
} as const;

export const REVIEW_MESSAGES = {
  easy: {
    title: 'Excelente! 🎉',
    description: 'Você está dominando este conteúdo!'
  },
  medium: {
    title: 'Bom trabalho! 👍',
    description: 'Continue praticando para melhorar ainda mais.'
  },
  hard: {
    title: 'Não desista! 💪',
    description: 'A repetição é a chave para o aprendizado.'
  }
} as const;

export const STEP_INTERVALS = {
  0: 1, // 1 day
  1: 3, // 3 days
  2: 7, // 1 week
  3: 14, // 2 weeks
  4: 30, // 1 month
  5: 60, // 2 months
  6: 120, // 4 months
  7: 240 // 8 months
} as const;

export const PROGRESS_COLORS = {
  beginner: 'from-red-500 to-orange-500',
  intermediate: 'from-yellow-500 to-green-500',
  advanced: 'from-green-500 to-blue-500',
  expert: 'from-blue-500 to-purple-500'
} as const;

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  }
} as const;

export const TIMER_SETTINGS = {
  defaultDuration: 900, // 15 minutes
  warningThreshold: 300, // 5 minutes
  criticalThreshold: 60 // 1 minute
} as const;

export type DifficultyType = typeof DIFFICULTY_OPTIONS[number]['value'];
export type GradientType = keyof typeof GRADIENT_BACKGROUNDS;
export type AnimationVariantType = keyof typeof ANIMATION_VARIANTS;