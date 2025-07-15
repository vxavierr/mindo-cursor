'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  RefreshCw, 
  Calendar, 
  Target, 
  Clock, 
  CheckCircle, 
  X, 
  ArrowRight,
  Eye,
  Brain,
  Zap,
  Star,
  Timer,
  BookOpen
} from 'lucide-react';
import { LearningEntry } from './types/review';

interface ReviewScreenMobileProps {
  reviews: LearningEntry[];
  onCompleteReview: (entryId: string, difficulty: 'easy' | 'medium' | 'hard', questions: string[], answers: string[]) => void;
  onClose: () => void;
}

export default function ReviewScreenMobile({ reviews, onCompleteReview, onClose }: ReviewScreenMobileProps) {
  const [currentReview, setCurrentReview] = useState(1);
  const totalReviews = reviews.length;
  const [showContent, setShowContent] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [timer, setTimer] = useState(0);

  // Get current review data
  const currentReviewData = reviews[currentReview - 1];

  const difficultyOptions = [
    { 
      id: 'easy', 
      label: 'Fácil', 
      color: 'from-green-500 to-emerald-500',
      description: 'Lembrei facilmente',
      nextReview: '7 dias'
    },
    { 
      id: 'medium', 
      label: 'Médio', 
      color: 'from-yellow-500 to-orange-500',
      description: 'Lembrei com esforço',
      nextReview: '3 dias'
    },
    { 
      id: 'hard', 
      label: 'Difícil', 
      color: 'from-red-500 to-pink-500',
      description: 'Esqueci ou foi difícil',
      nextReview: '1 dia'
    }
  ];

  useEffect(() => {
    if (showContent) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showContent]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDaysFromCreation = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleStartReview = () => {
    setShowContent(true);
    setTimer(0);
  };

  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    setSelectedDifficulty(difficulty);
    setIsAnswering(true);
    
    // Generate questions for the review
    const questions = [
      `O que eu sei sobre "${currentReviewData.title}"?`,
      `Por que este conteúdo é importante ou verdadeiro?`,
      `Como posso aplicar ou exemplificar este conhecimento na prática?`
    ];

    // For now, use empty answers - in a real implementation, this would be user input
    const answers = ['', '', ''];
    
    // Simulate API call
    setTimeout(() => {
      onCompleteReview(currentReviewData.id, difficulty, questions, answers);
      
      if (currentReview < totalReviews) {
        setCurrentReview(prev => prev + 1);
        setShowContent(false);
        setSelectedDifficulty(null);
        setIsAnswering(false);
        setTimer(0);
      } else {
        // Review session complete
        onClose();
      }
    }, 1500);
  };

  const skipReview = () => {
    if (currentReview < totalReviews) {
      setCurrentReview(prev => prev + 1);
      setShowContent(false);
      setSelectedDifficulty(null);
      setIsAnswering(false);
      setTimer(0);
    } else {
      onClose();
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-black relative overflow-hidden z-50">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-purple-700/30 to-black/90" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6 p-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                Tudo em dia! 🎉
              </h2>
              <p className="text-white/70 mb-4 text-sm">
                Você não tem revisões pendentes hoje.
              </p>
              <p className="text-xs text-white/50">
                Continue aprendendo e volte depois para suas próximas revisões!
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentReviewData) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 min-h-screen w-full bg-gradient-to-br from-purple-900 via-purple-800 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-purple-700/30 to-black/90" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Top glow effect */}
      <motion.div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pt-12 pb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <button onClick={onClose} className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            <div className="flex items-center space-x-2 text-white">
              <RefreshCw className="w-5 h-5" />
              <span className="font-medium">Revisão {currentReview} de {totalReviews}</span>
            </div>
            
            <button onClick={onClose} className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentReview / totalReviews) * 100}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full border-2 border-white/20" />
          </div>
        </motion.div>

        {/* Review Content */}
        <div className="flex-1 px-6">
          {!showContent ? (
            /* Review Preview */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Review Card */}
              <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-white/60" />
                    <span className="text-white/60 text-sm">
                      {new Date(currentReviewData.createdAt).toLocaleDateString('pt-BR')} • {getDaysFromCreation(currentReviewData.createdAt)} dias atrás
                    </span>
                  </div>
                  <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                    <span className="text-blue-400 text-sm font-medium">Step {currentReviewData.step + 1}</span>
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-white mb-6 leading-tight">
                  {currentReviewData.title}
                </h1>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-white/60">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span className="text-sm">{currentReviewData.reviews.length + 1}ª revisão</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Próxima em alguns dias</span>
                    </div>
                  </div>

                  <div className="text-white/70 text-center py-8">
                    <Brain className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-lg mb-2">Tente se lembrar do conteúdo</p>
                    <p className="text-sm text-white/50">
                      Quando estiver pronto, clique para revelar
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartReview}
                  className="w-full relative group"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 h-14 rounded-2xl transition-all duration-300 flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-white font-semibold">
                      <Eye className="w-5 h-5" />
                      <span>Iniciar Revisão</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={skipReview}
                  className="w-full bg-white/5 backdrop-blur-sm border border-white/10 h-12 rounded-2xl flex items-center justify-center text-white/70 hover:text-white transition-colors"
                >
                  Pular Esta
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* Review Content Display */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Timer */}
              <div className="flex items-center justify-center space-x-2 text-white/60">
                <Timer className="w-4 h-4" />
                <span className="text-sm font-mono">{formatTime(timer)}</span>
              </div>

              {/* Content Card */}
              <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 text-sm">Conteúdo para revisar:</span>
                  <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                    <span className="text-blue-400 text-sm font-medium">Step {currentReviewData.step + 1}</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-4">
                  {currentReviewData.title}
                </h2>

                <div className="bg-white/5 rounded-2xl p-4 mb-6">
                  <p className="text-white/90 leading-relaxed text-base">
                    {currentReviewData.content}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentReviewData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="text-center text-white/70 text-sm">
                  Leia o conteúdo acima e prepare-se para responder três perguntas baseadas em técnicas de aprendizagem comprovadas.
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-center">
                  Como foi relembrar este conteúdo?
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {difficultyOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDifficultySelect(option.id as 'easy' | 'medium' | 'hard')}
                      disabled={isAnswering}
                      className={`relative group p-4 rounded-2xl border transition-all duration-300 ${
                        selectedDifficulty === option.id
                          ? 'border-white/30 bg-white/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-10 rounded-2xl`} />
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="text-left">
                          <div className="text-white font-medium mb-1">{option.label}</div>
                          <div className="text-white/60 text-sm">{option.description}</div>
                        </div>
                        <div className="text-white/60 text-sm">
                          Próxima: {option.nextReview}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {isAnswering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 flex flex-col items-center space-y-4">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-white">Processando resposta...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 