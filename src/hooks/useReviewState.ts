import { useState, useEffect, useCallback } from 'react';
import { LearningEntry } from '@/hooks/useLearning';
import { DifficultyType, TIMER_SETTINGS } from '@/constants/reviewConstants';
import { formatTime } from '@/utils/timeUtils';

interface UseReviewStateProps {
  initialReviews: LearningEntry[];
  timerDuration?: number;
  onComplete?: () => void;
}

export interface ReviewState {
  currentIndex: number;
  currentReview: LearningEntry | null;
  timeSpent: number;
  formattedTime: string;
  answers: string[];
  questions: string[];
  selectedDifficulty: DifficultyType | null;
  isTimerRunning: boolean;
  isLastReview: boolean;
  progress: number;
  totalReviews: number;
}

export interface ReviewActions {
  nextReview: () => void;
  previousReview: () => void;
  setAnswer: (index: number, answer: string) => void;
  setQuestion: (index: number, question: string) => void;
  addQuestion: () => void;
  removeQuestion: (index: number) => void;
  setSelectedDifficulty: (difficulty: DifficultyType) => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  reset: () => void;
  skipReview: () => void;
}

/**
 * Custom hook for managing review state and actions
 * Consolidates repeated review logic across components
 */
export const useReviewState = ({
  initialReviews,
  timerDuration = TIMER_SETTINGS.defaultDuration,
  onComplete
}: UseReviewStateProps): [ReviewState, ReviewActions] => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [answers, setAnswers] = useState<string[]>(['']);
  const [questions, setQuestions] = useState<string[]>(['']);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyType | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timeSpent < timerDuration) {
      interval = setInterval(() => {
        setTimeSpent(prev => {
          const newTime = prev + 1;
          if (newTime >= timerDuration) {
            setIsTimerRunning(false);
            onComplete?.();
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timeSpent, timerDuration, onComplete]);

  // Computed values
  const currentReview = initialReviews[currentIndex] || null;
  const isLastReview = currentIndex === initialReviews.length - 1;
  const progress = initialReviews.length > 0 ? ((currentIndex + 1) / initialReviews.length) * 100 : 0;
  const formattedTime = formatTime(timeSpent);

  // Actions
  const nextReview = useCallback(() => {
    if (currentIndex < initialReviews.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedDifficulty(null);
      setAnswers(['']);
      setQuestions(['']);
    } else {
      onComplete?.();
    }
  }, [currentIndex, initialReviews.length, onComplete]);

  const previousReview = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedDifficulty(null);
      setAnswers(['']);
      setQuestions(['']);
    }
  }, [currentIndex]);

  const setAnswer = useCallback((index: number, answer: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = answer;
      return newAnswers;
    });
  }, []);

  const setQuestion = useCallback((index: number, question: string) => {
    setQuestions(prev => {
      const newQuestions = [...prev];
      newQuestions[index] = question;
      return newQuestions;
    });
  }, []);

  const addQuestion = useCallback(() => {
    setQuestions(prev => [...prev, '']);
    setAnswers(prev => [...prev, '']);
  }, []);

  const removeQuestion = useCallback((index: number) => {
    if (questions.length > 1) {
      setQuestions(prev => prev.filter((_, i) => i !== index));
      setAnswers(prev => prev.filter((_, i) => i !== index));
    }
  }, [questions.length]);

  const startTimer = useCallback(() => {
    setIsTimerRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsTimerRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeSpent(0);
    setIsTimerRunning(false);
  }, []);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setTimeSpent(0);
    setAnswers(['']);
    setQuestions(['']);
    setSelectedDifficulty(null);
    setIsTimerRunning(false);
  }, []);

  const skipReview = useCallback(() => {
    nextReview();
  }, [nextReview]);

  const state: ReviewState = {
    currentIndex,
    currentReview,
    timeSpent,
    formattedTime,
    answers,
    questions,
    selectedDifficulty,
    isTimerRunning,
    isLastReview,
    progress,
    totalReviews: initialReviews.length
  };

  const actions: ReviewActions = {
    nextReview,
    previousReview,
    setAnswer,
    setQuestion,
    addQuestion,
    removeQuestion,
    setSelectedDifficulty,
    startTimer,
    stopTimer,
    resetTimer,
    reset,
    skipReview
  };

  return [state, actions];
};