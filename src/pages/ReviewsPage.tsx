import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '@/hooks/useLearning';
import { useAuth } from '@/contexts/AuthContext';
import MindoReviewScreen from '@/components/learning/MindoReviewScreen';

const ReviewsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    reviewsToday,
    completeReview,
    loading
  } = useLearning();

  const handleCompleteReview = async (
    entryId: string, 
    difficulty: 'easy' | 'medium' | 'hard', 
    questions: string[], 
    answers: string[]
  ) => {
    try {
      await completeReview(entryId, difficulty, questions, answers);
    } catch (error) {
      console.error('Erro ao completar revisão:', error);
    }
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  // Evita flash da tela "Tudo em dia!" enquanto carrega
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-purple-800 to-black relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-purple-700/30 to-black/90" />
        <div className="relative z-10 text-center space-y-6">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
          <span className="text-white">Carregando revisões...</span>
        </div>
      </div>
    );
  }

  return (
    <MindoReviewScreen 
      onNavigateHome={handleNavigateHome}
      reviews={reviewsToday.filter(e => e.step !== -1)}
      onCompleteReview={handleCompleteReview}
    />
  );
};

export default ReviewsPage;