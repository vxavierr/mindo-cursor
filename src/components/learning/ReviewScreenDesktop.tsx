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
  BookOpen,
  Settings,
  Bell,
  User,
  Grid,
  List,
  Filter,
  ChevronDown,
  Activity,
  Award,
  BarChart3,
  TrendingUp,
  Users,
  Search,
  Plus,
  MessageCircle,
  Globe
} from 'lucide-react';
import { LearningEntry } from './types/review';

interface ReviewScreenDesktopProps {
  reviews: LearningEntry[];
  onCompleteReview: (entryId: string, difficulty: 'easy' | 'medium' | 'hard', questions: string[], answers: string[]) => void;
  onClose: () => void;
}

export default function ReviewScreenDesktop({ reviews, onCompleteReview, onClose }: ReviewScreenDesktopProps) {
  const [currentReview, setCurrentReview] = useState(1);
  const [totalReviews] = useState(reviews.length);
  const [showContent, setShowContent] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedTab, setSelectedTab] = useState('reviews');
  const [showNotifications, setShowNotifications] = useState(false);

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

  const upcomingReviews = reviews.slice(currentReview).slice(0, 4).map((review, index) => ({
    id: review.id,
    title: review.title,
    category: "Aprendizado",
    time: index === 0 ? "Próximo" : `Em ${index + 1}`,
    difficulty: "medium" as const
  }));

  const quickActions = [
    { label: 'Pular Revisão', icon: ArrowRight, color: 'from-blue-500 to-cyan-500' },
    { label: 'Pausar Sessão', icon: Clock, color: 'from-orange-500 to-red-500' },
    { label: 'Estatísticas', icon: BarChart3, color: 'from-purple-500 to-violet-500' },
    { label: 'Configurações', icon: Settings, color: 'from-green-500 to-emerald-500' }
  ];

  const notifications = [
    { id: 1, type: 'review', message: 'Próxima revisão em 30 minutos', time: '2min' },
    { id: 2, type: 'achievement', message: 'Você completou 10 revisões hoje!', time: '5min' },
    { id: 3, type: 'reminder', message: 'Lembrete: Estudar React às 16h', time: '1h' }
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
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Tudo em dia! 🎉
              </h2>
              <p className="text-white/70 mb-4 text-lg">
                Você não tem revisões pendentes hoje.
              </p>
              <p className="text-white/50">
                Continue aprendendo e volte depois para suas próximas revisões!
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
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
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Top glow effect */}
      <motion.div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple-400/20 blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 h-screen flex">
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 bg-black/40 backdrop-blur-2xl border-r border-white/10 p-6 flex flex-col fixed left-0 top-0 h-full"
        >
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Mindo</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 mb-8">
            {[
              { icon: BookOpen, label: 'Dashboard', id: 'home' },
              { icon: RefreshCw, label: 'Revisões', id: 'reviews', active: true },
              { icon: Search, label: 'Explorar', id: 'search' },
              { icon: TrendingUp, label: 'Progresso', id: 'progress' },
              { icon: Users, label: 'Comunidade', id: 'community' },
              { icon: Settings, label: 'Configurações', id: 'settings' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  item.active 
                    ? 'bg-white/10 text-white border border-white/20' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Review Progress */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 mb-6 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/60 text-sm">Progresso da Sessão</span>
              <span className="text-white font-medium">{currentReview}/{totalReviews}</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentReview / totalReviews) * 100}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide">Ações Rápidas</h3>
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => action.label === 'Pular Revisão' && skipReview()}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-white/80 hover:text-white transition-all group"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} opacity-80 group-hover:opacity-100 flex items-center justify-center`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex ml-80 h-screen overflow-hidden">
          {/* Review Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-8 pt-8 pb-6 border-b border-white/10 flex-shrink-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button onClick={onClose} className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Sessão de Revisão</h1>
                    <p className="text-white/70">Revisão {currentReview} de {totalReviews}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {showContent && (
                    <div className="flex items-center space-x-2 text-white/60 bg-black/40 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/10">
                      <Timer className="w-4 h-4" />
                      <span className="font-mono">{formatTime(timer)}</span>
                    </div>
                  )}
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 relative"
                    >
                      <Bell className="w-5 h-5 text-white" />
                      {notifications.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                          className="absolute right-0 mt-2 w-80 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 p-4 z-50"
                        >
                          <h3 className="font-semibold text-white mb-3">Notificações</h3>
                          <div className="space-y-2">
                            {notifications.map(notification => (
                              <div key={notification.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                                <p className="text-white/90 text-sm">{notification.message}</p>
                                <span className="text-white/60 text-xs">{notification.time}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <button onClick={onClose} className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Review Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {!showContent ? (
                /* Review Preview */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto"
                >
                  {/* Review Card */}
                  <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-white/60" />
                        <span className="text-white/60 text-sm">
                          {new Date(currentReviewData.createdAt).toLocaleDateString('pt-BR')} • {getDaysFromCreation(currentReviewData.createdAt)} dias atrás
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                          <span className="text-blue-400 text-sm font-medium">Step {currentReviewData.step + 1}</span>
                        </div>
                        <div className="px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">
                          <span className="text-purple-400 text-sm font-medium">Aprendizado</span>
                        </div>
                      </div>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-8 leading-tight">
                      {currentReviewData.title}
                    </h1>

                    <div className="grid grid-cols-2 gap-8 mb-8">
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
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((currentReviewData.step + 1) * 20, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-white/70 text-center">
                        <Brain className="w-20 h-20 text-white/30 mx-auto mb-4" />
                        <p className="text-xl mb-2">Tente se lembrar do conteúdo</p>
                        <p className="text-sm text-white/50">
                          Quando estiver pronto, clique para revelar
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 max-w-2xl mx-auto">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleStartReview}
                      className="flex-1 relative group"
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 h-16 rounded-2xl transition-all duration-300 flex items-center justify-center">
                        <div className="flex items-center space-x-3 text-white font-semibold text-lg">
                          <Eye className="w-6 h-6" />
                          <span>Iniciar Revisão</span>
                          <ArrowRight className="w-6 h-6" />
                        </div>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={skipReview}
                      className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 h-16 rounded-2xl flex items-center justify-center text-white/70 hover:text-white transition-colors text-lg font-medium"
                    >
                      Pular Esta Revisão
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                /* Review Content Display */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto"
                >
                  {/* Content Card */}
                  <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-white/60">Conteúdo para revisar:</span>
                      <div className="flex items-center space-x-3">
                        <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                          <span className="text-blue-400 text-sm font-medium">Step {currentReviewData.step + 1}</span>
                        </div>
                        <div className="px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">
                          <span className="text-purple-400 text-sm font-medium">Aprendizado</span>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-6">
                      {currentReviewData.title}
                    </h2>

                    <div className="bg-white/5 rounded-2xl p-6 mb-6">
                      <p className="text-white/90 leading-relaxed text-lg">
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

                    <div className="text-center text-white/70">
                      Leia o conteúdo acima e prepare-se para responder três perguntas baseadas em técnicas de aprendizagem comprovadas.
                    </div>
                  </div>

                  {/* Difficulty Selection */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-white text-center">
                      Como foi relembrar este conteúdo?
                    </h3>

                    <div className="grid grid-cols-3 gap-4">
                      {difficultyOptions.map((option) => (
                        <motion.button
                          key={option.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDifficultySelect(option.id as 'easy' | 'medium' | 'hard')}
                          disabled={isAnswering}
                          className={`relative group p-6 rounded-2xl border transition-all duration-300 ${
                            selectedDifficulty === option.id
                              ? 'border-white/30 bg-white/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-10 rounded-2xl`} />
                          <div className="relative z-10 text-center">
                            <div className="text-white font-semibold text-xl mb-2">{option.label}</div>
                            <div className="text-white/60 mb-3">{option.description}</div>
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
          </div>

          {/* Right Sidebar - Upcoming Reviews */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 bg-black/40 backdrop-blur-2xl border-l border-white/10 p-6 overflow-y-auto"
          >
            <h3 className="text-xl font-bold text-white mb-6">Próximas Revisões</h3>
            
            <div className="space-y-4">
              {upcomingReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 rounded-lg bg-white/10 text-white/80 text-xs font-medium">
                      {review.category}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${
                      review.difficulty === 'easy' ? 'bg-green-500' :
                      review.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  </div>
                  <h4 className="text-white font-medium mb-2 text-sm">{review.title}</h4>
                  <div className="flex items-center space-x-1 text-white/60 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{review.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
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
  );
} 