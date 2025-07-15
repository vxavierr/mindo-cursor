'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  Globe,
  Tag,
  MessageSquare,
  Mic,
  MicOff,
  Type,
  Edit3,
  AlertCircle,
  Lightbulb,
  Send,
  RotateCcw,
  HelpCircle,
  Wrench,
  Play
} from 'lucide-react';
import { LearningEntry } from './types/review';
import { toast } from '@/hooks/use-toast';
import { formatTime, getDaysFromCreation } from '@/utils/timeUtils';
import { DIFFICULTY_OPTIONS, GRADIENT_BACKGROUNDS } from '@/constants/reviewConstants';
import BackdropCard from '@/components/ui/BackdropCard';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';

interface MindoReviewScreenProps {
  onNavigateHome?: () => void; // Opcional para manter compatibilidade
  reviews: LearningEntry[];
  onCompleteReview: (entryId: string, difficulty: 'easy' | 'medium' | 'hard', questions: string[], answers: string[]) => void;
}

export default function MindoReviewScreen({ onNavigateHome, reviews, onCompleteReview }: MindoReviewScreenProps) {
  const navigate = useNavigate();
  
  // Estados principais do sistema de revisão (baseado no ReviewModal)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedTab, setSelectedTab] = useState('reviews');
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Estados para o sistema de perguntas individuais
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions] = useState(3);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [inputMode, setInputMode] = useState('text');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para funcionalidade de áudio
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isImprovingText, setIsImprovingText] = useState(false);
  
  // Hook de IA
  const { transcribeAudio, improveText, isProcessing } = useEnhancedAI();

  // Dados da revisão atual
  const currentReview = reviews[currentIndex];
  const totalReviews = reviews.length;

  // Função para gerar perguntas (mesma do ReviewModal)
  const generateQuestions = (content: string, title?: string) => {
    const topicReference = title ? `"${title}"` : 'este tema';
    
    return [
      `O que eu sei sobre ${topicReference}?`,
      `Por que este conteúdo é importante ou verdadeiro?`,
      `Como posso aplicar ou exemplificar este conhecimento na prática?`
    ];
  };

  // Função para iniciar revisão (mesma do ReviewModal)
  const startReview = () => {
    if (!currentReview) return;
    
    const generatedQuestions = generateQuestions(currentReview.content, currentReview.title);
    setQuestions(generatedQuestions);
    setAnswers(new Array(generatedQuestions.length).fill(''));
    setQuestionIndex(0);
    setCurrentAnswer('');
    setCurrentQuestion(1);
    setAnswer('');
    setIsRecording(false);
    setInputMode('text');
    setIsSubmitting(false);
    setTimer(0);
    setShowQuestions(true);
  };

  // Funções para navegação entre perguntas
  const handleNextQuestion = () => {
    if (answer.trim()) {
      setIsSubmitting(true);
      
      // Para gravação se estiver ativa
      if (isRecording) {
        stopRecording();
      }
      
      // Salva a resposta atual
      const newAnswers = [...answers];
      newAnswers[currentQuestion - 1] = answer.trim();
      setAnswers(newAnswers);
      
      setTimeout(() => {
        if (currentQuestion < totalQuestions) {
          setCurrentQuestion(prev => prev + 1);
          setAnswer('');
          setTimer(0);
          // Reset audio states
          setInputMode('text');
          setRecordingTime(0);
          setIsTranscribing(false);
        } else {
          // Todas as perguntas foram respondidas, vai para seleção de dificuldade
          handleQuestionsComplete(newAnswers);
        }
        setIsSubmitting(false);
      }, 1500);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 1) {
      // Para gravação se estiver ativa
      if (isRecording) {
        stopRecording();
      }
      
      setCurrentQuestion(prev => prev - 1);
      setAnswer(answers[currentQuestion - 2] || '');
      setTimer(0);
      // Reset audio states
      setInputMode('text');
      setRecordingTime(0);
      setIsTranscribing(false);
    }
  };

  const handleQuestionsComplete = (finalAnswers: string[]) => {
    // Finaliza as perguntas e vai para seleção de dificuldade
    setQuestions(generateQuestions(currentReview.content, currentReview.title));
    setAnswers(finalAnswers);
    setCurrentQuestion(4); // Indica que passou das perguntas
    setAnswer(''); // Limpa a resposta para mostrar a seleção de dificuldade
  };

  // Funções para input de voz
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { 
        mimeType: 'audio/webm;codecs=opus' 
      });
      
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        await handleAudioTranscription(audioBlob);
        
        // Parar todas as faixas de áudio
        stream.getTracks().forEach(track => track.stop());
      };
      
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      toast({
        title: "Gravação iniciada",
        description: "Fale naturalmente e clique novamente para parar."
      });
      
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      toast({
        title: "Erro de acesso",
        description: "Não foi possível acessar o microfone. Verifique as permissões.",
        variant: "destructive"
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setRecordingTime(0);
    }
  };
  
  const toggleRecording = () => {
    if (!isRecording) {
      setInputMode('voice');
      startRecording();
    } else {
      stopRecording();
    }
  };
  
  const handleAudioTranscription = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const transcribedText = await transcribeAudio(audioBlob);
      if (transcribedText) {
        setAnswer(prev => prev + (prev ? ' ' : '') + transcribedText);
        toast({
          title: "Transcrição concluída!",
          description: "Sua fala foi convertida em texto com sucesso."
        });
      }
    } catch (error) {
      console.error('Erro na transcrição:', error);
      toast({
        title: "Erro na transcrição",
        description: "Não foi possível transcrever o áudio. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsTranscribing(false);
    }
  };
  
  const handleImproveText = async () => {
    if (!answer.trim()) {
      toast({
        title: "Texto vazio",
        description: "Digite ou grave algum texto antes de aprimorar.",
        variant: "destructive"
      });
      return;
    }
    
    setIsImprovingText(true);
    try {
      const improvedText = await improveText(answer);
      if (improvedText) {
        setAnswer(improvedText);
        toast({
          title: "Texto aprimorado!",
          description: "Seu texto foi melhorado com IA."
        });
      }
    } catch (error) {
      console.error('Erro ao aprimorar texto:', error);
      toast({
        title: "Erro no aprimoramento",
        description: "Não foi possível aprimorar o texto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsImprovingText(false);
    }
  };

  const switchToTextMode = () => {
    if (isRecording) {
      stopRecording();
    }
    setInputMode('text');
  };

  // Dados mocados para as perguntas
  const questionsData = [
    {
      id: 1,
      question: `O que eu sei sobre "${currentReview?.title || 'este tema'}"?`,
      type: 'open',
      placeholder: 'Digite sua resposta aqui...',
      hints: [
        'Pense nos conceitos principais do conteúdo',
        'Quais são os pontos mais importantes?',
        'O que você lembra imediatamente?'
      ],
      icon: MessageSquare,
      iconColor: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      typeLabel: 'Pergunta Aberta',
      subtitle: 'Digite sua resposta aqui...'
    },
    {
      id: 2,
      question: 'Por que este conteúdo é importante ou verdadeiro?',
      type: 'analysis',
      placeholder: 'Digite sua resposta aqui...',
      hints: [
        'Explique o valor do conhecimento',
        'Cite evidências ou exemplos',
        'Conecte com o mundo real',
        'Justifique a importância'
      ],
      icon: HelpCircle,
      iconColor: 'from-orange-500/20 to-red-500/20',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      typeLabel: 'Pergunta Analítica',
      subtitle: 'Analise a relevância e veracidade do conteúdo estudado'
    },
    {
      id: 3,
      question: 'Como posso aplicar ou exemplificar este conhecimento na prática?',
      type: 'practical',
      placeholder: 'Digite sua resposta aqui...',
      hints: [
        'Cite exemplos específicos',
        'Descreva situações reais',
        'Explique o processo de aplicação',
        'Conecte com sua experiência'
      ],
      icon: Wrench,
      iconColor: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      typeLabel: 'Pergunta Prática',
      subtitle: 'Conecte o conhecimento com situações reais e exemplos práticos'
    }
  ];

  const currentQuestionData = questionsData[currentQuestion - 1];
  const progressPercentage = currentQuestion > totalQuestions ? 100 : (currentQuestion / totalQuestions) * 100;

  // Dados para o progresso das perguntas
  const questionSteps = [
    { id: 1, title: "Conceitos Principais", completed: currentQuestion > 1, current: currentQuestion === 1 },
    { id: 2, title: "Importância", completed: currentQuestion > 2, current: currentQuestion === 2 },
    { id: 3, title: "Aplicação Prática", completed: currentQuestion > 3, current: currentQuestion === 3 }
  ];

  const questionQuickActions = [
    { label: 'Pular Pergunta', icon: ArrowRight, color: 'from-blue-500 to-cyan-500' },
    { label: 'Pausar Sessão', icon: Clock, color: 'from-orange-500 to-red-500' },
    { label: 'Dicas Extras', icon: Lightbulb, color: 'from-yellow-500 to-amber-500' },
    { label: 'Reiniciar', icon: RotateCcw, color: 'from-green-500 to-emerald-500' }
  ];

  const questionNotifications = [
    { id: 1, type: 'question', message: 'Próxima pergunta será sobre aplicação prática', time: '1min' },
    { id: 2, type: 'tip', message: 'Dica: Resposta deve ter pelo menos 50 palavras', time: '2min' },
    { id: 3, type: 'timer', message: 'Tempo médio por pergunta: 3min', time: '5min' }
  ];

  // Função para completar revisão (baseada no ReviewModal)
  const completeReview = (finalAnswers: string[], difficulty: 'easy' | 'medium' | 'hard') => {
    if (!currentReview) return;

    onCompleteReview(currentReview.id, difficulty, questions, finalAnswers);
    
    toast({
      title: "Revisão concluída!",
      description: "Revisão concluída com sucesso."
    });

    if (currentIndex < reviews.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetReviewState();
    } else {
      toast({
        title: "Parabéns! 🎉",
        description: "Todas as revisões foram concluídas!"
      });
      // Usar React Router ou callback como fallback
      if (onNavigateHome) {
        onNavigateHome();
      } else {
        navigate('/');
      }
    }
  };

  // Função para resetar estado da revisão
  const resetReviewState = () => {
    setShowQuestions(false);
    setQuestions([]);
    setAnswers([]);
    setCurrentAnswer('');
    setQuestionIndex(0);
    setSelectedDifficulty(null);
    setIsAnswering(false);
    setTimer(0);
  };

  // Função para pular revisão
  const skipReview = () => {
    if (currentIndex < reviews.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetReviewState();
    } else {
      // Usar React Router ou callback como fallback
      if (onNavigateHome) {
        onNavigateHome();
      } else {
        navigate('/');
      }
    }
  };

  // Local difficulty options specifically for the third question
  const difficultyOptions = [
    { 
      id: 'hard', 
      label: 'Difícil', 
      color: 'bg-red-500/20 border-red-500 text-red-400',
      hoverColor: 'hover:border-red-500/50 hover:text-red-400',
      baseColor: 'bg-white/5 border-white/10 text-white/70'
    },
    { 
      id: 'medium', 
      label: 'Médio', 
      color: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
      hoverColor: 'hover:border-yellow-500/50 hover:text-yellow-400',
      baseColor: 'bg-white/5 border-white/10 text-white/70'
    },
    { 
      id: 'easy', 
      label: 'Fácil', 
      color: 'bg-green-500/20 border-green-500 text-green-400',
      hoverColor: 'hover:border-green-500/50 hover:text-green-400',
      baseColor: 'bg-white/5 border-white/10 text-white/70'
    }
  ];

  // Próximas revisões baseadas nos dados reais
  const upcomingReviews = reviews.slice(currentIndex + 1).slice(0, 4).map((review, index) => ({
    id: review.id,
    title: review.title || 'Sem título',
    category: review.tags[0] || 'Aprendizado',
    time: index === 0 ? "Próximo" : `${index + 1}º`,
    difficulty: "medium" as const
  }));

  const sidebarQuickActions = [
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
    if (showQuestions && currentQuestion <= totalQuestions) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showQuestions, currentQuestion, totalQuestions]);
  
  // Timer para gravação de áudio
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Using shared formatTime utility - removed duplicate function

  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    setSelectedDifficulty(difficulty);
    setIsAnswering(true);

    // Completar revisão com a dificuldade selecionada
    setTimeout(() => {
      const finalAnswers = new Array(questions.length).fill('Resposta não fornecida');
      completeReview(finalAnswers, difficulty);
    }, 1500);
  };

  // Verificar se há revisões para mostrar
  if (reviews.length === 0) {
    return (
      <div className={`min-h-screen w-full ${GRADIENT_BACKGROUNDS.primary} relative overflow-hidden flex items-center justify-center`}>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-purple-700/30 to-black/90" />
        <div className="relative z-10 text-center space-y-6 p-8">
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
            onClick={() => onNavigateHome ? onNavigateHome() : navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!currentReview) {
    return null;
  }

  return (
    <div className={`min-h-screen w-full ${GRADIENT_BACKGROUNDS.primary} relative overflow-hidden`}>
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
        <BackdropCard 
          className="w-80 border-r border-white/10 p-6 flex flex-col fixed left-0 top-0 h-full !rounded-r-3xl !rounded-l-none"
          variant="default"
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
                onClick={() => {
                  setSelectedTab(item.id);
                  if (item.id === 'home') {
                    onNavigateHome ? onNavigateHome() : navigate('/');
                  }
                }}
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
          <BackdropCard className="p-4 mb-6">
            {showQuestions && currentQuestion <= totalQuestions ? (
              // Modo perguntas - mostra progresso das perguntas
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/60 text-sm">Progresso das Perguntas</span>
                  <span className="text-white font-medium">{currentQuestion}/{totalQuestions}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                {/* Question Steps */}
                <div className="space-y-2">
                  <AnimatePresence mode="sync">
                    {questionSteps.map((q, index) => {
                      const shouldShow = index < currentQuestion || 
                                       (index === currentQuestion && currentQuestion <= totalQuestions);
                      
                      if (!shouldShow && index > currentQuestion) return null;
                      
                      const isCompleted = index < currentQuestion - 1;
                      const isCurrent = index === currentQuestion - 1;
                      const isNext = index === currentQuestion && currentQuestion <= totalQuestions;
                      
                      return (
                        <motion.div
                          key={q.id}
                          initial={{ opacity: 0, x: -20, height: 0 }}
                          animate={{ 
                            opacity: isCompleted ? 0.4 : isCurrent ? 1 : isNext ? 0.6 : 0.3,
                            x: 0,
                            height: "auto"
                          }}
                          exit={{ 
                            opacity: 0, 
                            x: -20, 
                            height: 0,
                            transition: { duration: 0.3 }
                          }}
                          transition={{ 
                            duration: 0.5,
                            ease: "easeOut"
                          }}
                          className={`flex items-center space-x-3 p-2 rounded-lg transition-all overflow-hidden ${
                            isCurrent 
                              ? 'bg-white/10 border border-white/20 scale-105' 
                              : isCompleted 
                                ? 'bg-green-500/10 border border-green-500/20' 
                                : 'bg-white/5'
                          }`}
                        >
                          <motion.div 
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              isCompleted 
                                ? 'bg-green-500' 
                                : isCurrent 
                                  ? 'bg-blue-500' 
                                  : 'bg-white/20'
                            }`}
                            animate={{
                              scale: isCurrent ? [1, 1.1, 1] : 1
                            }}
                            transition={{
                              duration: 2,
                              repeat: isCurrent ? Infinity : 0,
                              ease: "easeInOut"
                            }}
                          >
                            <AnimatePresence mode="wait">
                              {isCompleted ? (
                                <motion.div
                                  key="check"
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 180 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </motion.div>
                              ) : (
                                <motion.span
                                  key="number"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  className="text-white text-xs font-medium"
                                >
                                  {q.id}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.div>
                          <span className={`text-sm font-medium transition-all ${
                            isCurrent ? 'text-white' : isCompleted ? 'text-green-400' : 'text-white/60'
                          }`}>
                            {q.title}
                          </span>
                          {isCurrent && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto"
                            >
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              // Modo normal - mostra progresso da sessão
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/60 text-sm">Progresso da Sessão</span>
                  <span className="text-white font-medium">{currentIndex + 1}/{totalReviews}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / totalReviews) * 100}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </>
            )}
          </BackdropCard>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide">Ações Rápidas</h3>
            {sidebarQuickActions.map((action, index) => (
              <BackdropCard key={action.label} hover size="sm">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-3 text-white/80 hover:text-white transition-all group"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} opacity-80 group-hover:opacity-100 flex items-center justify-center`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </motion.button>
              </BackdropCard>
            ))}
          </div>
        </BackdropCard>

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
                  {showQuestions && currentQuestion <= totalQuestions ? (
                    // Botão para pergunta anterior
                    <button 
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestion === 1}
                      className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 disabled:opacity-50"
                    >
                      <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                  ) : (
                    // Botão para voltar ao home
                    <button 
                      onClick={() => onNavigateHome ? onNavigateHome() : navigate('/')}
                      className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                    >
                      <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                  )}
                  <div>
                    {showQuestions && currentQuestion <= totalQuestions ? (
                      <>
                        <h1 className="text-3xl font-bold text-white">Pergunta {currentQuestion}</h1>
                        <p className="text-white/70">Revisão {currentIndex + 1} de {totalReviews}</p>
                      </>
                    ) : (
                      <>
                        <h1 className="text-3xl font-bold text-white">Sessão de Revisão</h1>
                        <p className="text-white/70">Revisão {currentIndex + 1} de {totalReviews}</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {showQuestions && (
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
                      {(showQuestions && currentQuestion <= totalQuestions ? questionNotifications : notifications).length > 0 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full" />
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
                          <h3 className="font-semibold text-white mb-3">
                            {showQuestions && currentQuestion <= totalQuestions ? 'Dicas e Notificações' : 'Notificações'}
                          </h3>
                          <div className="space-y-2">
                            {(showQuestions && currentQuestion <= totalQuestions ? questionNotifications : notifications).map(notification => (
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
                  
                  <button 
                    onClick={() => onNavigateHome ? onNavigateHome() : navigate('/')}
                    className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Review Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {!showQuestions ? (
                /* Review Preview */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto"
                >
                  {/* Review Card */}
                  <BackdropCard className="p-8 mb-8 shadow-2xl" size="lg">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-white/60" />
                        <span className="text-white/60 text-sm">
                          {new Date(currentReview.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit'
                          })}
                          • {getDaysFromCreation(currentReview.createdAt)} dias atrás
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                          <span className="text-blue-400 text-sm font-medium">Step {currentReview.step + 1}</span>
                        </div>
                        {currentReview.tags[0] && (
                          <div className="px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">
                            <span className="text-purple-400 text-sm font-medium">{currentReview.tags[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-8 leading-tight">
                      {currentReview.title || 'Revisão de Aprendizado'}
                    </h1>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 text-white/60">
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4" />
                            <span className="text-sm">{currentReview.reviews.length + 1}ª revisão</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Em revisão</span>
                          </div>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((currentReview.step + 1) * 15, 100)}%` }}
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

                    {/* Conteúdo da Revisão */}
                    <BackdropCard variant="glass" className="p-6 mb-6">
                      <p className="text-white/90 leading-relaxed text-lg whitespace-pre-wrap">
                        {currentReview.content}
                      </p>
                    </BackdropCard>

                    {/* Contexto */}
                    {currentReview.context && (
                      <div className="mb-6">
                        <p className="text-white/70 text-sm">
                          <strong className="text-white/90">Contexto:</strong> {currentReview.context}
                        </p>
                      </div>
                    )}

                    {/* Tags */}
                    {currentReview.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {currentReview.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </BackdropCard>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 max-w-2xl mx-auto">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={startReview}
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
              ) : currentQuestion < 3 ? (
                /* Questions 1 and 2 Display */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-5xl mx-auto h-full flex flex-col"
                >
                  {/* Question Card */}
                  <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl mb-4">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentQuestionData?.iconColor} flex items-center justify-center border ${currentQuestionData?.borderColor}`}>
                          {currentQuestionData?.icon && <currentQuestionData.icon className={`w-6 h-6 ${currentQuestionData.textColor}`} />}
                        </div>
                        <div>
                          <div className={`${currentQuestionData?.textColor} text-sm font-medium`}>{currentQuestionData?.typeLabel}</div>
                          <div className="text-white/60 text-sm">{currentReview.tags[0] || 'Aprendizado'} • Step {currentReview.step + 1}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {currentReview.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                        {currentQuestionData?.question}
                      </h1>
                      <p className="text-white/60 text-lg">
                        {currentQuestionData?.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Answer Input */}
                  <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl flex-1 flex flex-col min-h-[240px]">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-white font-medium text-lg">
                        {currentQuestionData?.type === 'analysis' ? 'Sua análise:' : 
                         currentQuestionData?.type === 'practical' ? 'Sua aplicação prática:' : 'Sua resposta:'}
                      </span>
                      
                      {/* Input Mode Toggle */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={switchToTextMode}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                            inputMode === 'text' 
                              ? 'bg-white/10 border-white/20 text-white' 
                              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                          }`}
                        >
                          <Type className="w-4 h-4" />
                          <span className="text-sm font-medium">Texto</span>
                        </button>
                        <button
                          onClick={toggleRecording}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                            inputMode === 'voice' 
                              ? 'bg-red-500/20 border-red-500/30 text-red-400' 
                              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                          }`}
                        >
                          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          <span className="text-sm font-medium">Voz</span>
                        </button>
                      </div>
                    </div>

                    {/* Input Area */}
                    <div className="flex-1 flex flex-col">
                      {inputMode === 'text' ? (
                        <textarea
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder={currentQuestionData?.placeholder}
                          className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/40 resize-none focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 text-lg leading-relaxed"
                          rows={4}
                        />
                      ) : (
                        <div className="flex-1 flex flex-col">
                          {/* Mostrar texto transcrito se existir */}
                          {answer.trim() && (
                            <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white/70 text-sm">Texto transcrito:</span>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={handleImproveText}
                                  disabled={isImprovingText || isProcessing}
                                  className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-md text-white text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isImprovingText ? (
                                    <>
                                      <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                                      <span>Aprimorando...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Lightbulb className="w-3 h-3" />
                                      <span>Aprimorar</span>
                                    </>
                                  )}
                                </motion.button>
                              </div>
                              <p className="text-white text-sm leading-relaxed">
                                {answer}
                              </p>
                              <div className="flex items-center space-x-3 mt-2 text-xs text-white/60">
                                <span>{answer.length} caracteres</span>
                                <span>~{Math.ceil(answer.split(' ').length)} palavras</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                              <motion.button
                                onClick={toggleRecording}
                                disabled={isTranscribing}
                                animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ duration: 1, repeat: Infinity }}
                                className={`w-24 h-24 rounded-full border-4 mb-6 mx-auto flex items-center justify-center transition-all ${
                                  isRecording 
                                    ? 'border-red-500 bg-red-500/20 hover:bg-red-500/30' 
                                    : isTranscribing
                                      ? 'border-blue-500 bg-blue-500/20'
                                      : 'border-white/30 bg-white/5 hover:bg-white/10'
                                } ${isTranscribing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                {isTranscribing ? (
                                  <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                                ) : (
                                  <Mic className={`w-10 h-10 ${isRecording ? 'text-red-400' : 'text-white/60'}`} />
                                )}
                              </motion.button>
                              
                              {isRecording && (
                                <div className="mb-4">
                                  <div className="bg-red-500/20 rounded-full px-3 py-1 inline-flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    <span className="text-red-400 text-sm font-mono">
                                      {formatTime(recordingTime)}
                                    </span>
                                  </div>
                                </div>
                              )}
                              
                              <p className="text-white text-xl mb-2">
                                {isTranscribing ? 
                                  'Transcrevendo áudio...' :
                                  isRecording ? 
                                    (currentQuestionData?.type === 'analysis' ? 'Gravando sua análise...' : 
                                     currentQuestionData?.type === 'practical' ? 'Gravando aplicação prática...' : 
                                     'Gravando sua resposta...') : 
                                    'Clique para gravar'
                                }
                              </p>
                              <p className="text-white/60">
                                {isTranscribing ?
                                  'Aguarde enquanto convertemos sua fala em texto' :
                                  isRecording ? 
                                    (currentQuestionData?.type === 'analysis' ? 'Explique a importância do conteúdo' : 
                                     currentQuestionData?.type === 'practical' ? 'Descreva exemplos e situações práticas' : 
                                     'Fale naturalmente sobre o tópico') : 
                                    (currentQuestionData?.type === 'analysis' ? 'Use sua voz para analisar o material' : 
                                     currentQuestionData?.type === 'practical' ? 'Use sua voz para explicar aplicações' : 
                                     'Use sua voz para responder à pergunta')
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Character Count & Actions */}
                    {inputMode === 'text' && (
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                        <div className="flex items-center space-x-4 text-sm text-white/60">
                          <span>{answer.length} caracteres</span>
                          <span>~{Math.ceil(answer.split(' ').length)} palavras</span>
                          {answer.length > 0 && (
                            <div className="flex items-center space-x-1 text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              <span>Pronto para enviar</span>
                            </div>
                          )}
                        </div>
                        
                        {answer.trim() && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleImproveText}
                            disabled={isImprovingText || isProcessing}
                            className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-white text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isImprovingText ? (
                              <>
                                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Aprimorando...</span>
                              </>
                            ) : (
                              <>
                                <Lightbulb className="w-3 h-3" />
                                <span>Aprimorar com IA</span>
                              </>
                            )}
                          </motion.button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestion === 1}
                      className="flex items-center space-x-2 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white/70 hover:text-white transition-colors disabled:opacity-50"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Anterior</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNextQuestion}
                      disabled={!answer.trim() || isSubmitting}
                      className="flex-1 relative group"
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className={`relative overflow-hidden h-14 rounded-2xl transition-all duration-300 flex items-center justify-center font-semibold text-lg ${
                        answer.trim() && !isSubmitting
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : 'bg-white/10 text-white/50 cursor-not-allowed'
                      }`}>
                        <AnimatePresence mode="wait">
                          {isSubmitting ? (
                            <motion.div
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center space-x-3"
                            >
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>
                              {currentQuestionData?.type === 'analysis' ? 'Processando análise...' : 
                               currentQuestionData?.type === 'practical' ? 'Processando aplicação...' : 
                               'Processando resposta...'}
                            </span>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="next"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center space-x-3"
                            >
                              <Send className="w-5 h-5" />
                              <span>
                                {currentQuestion === totalQuestions ? 'Finalizar' : 'Próxima Pergunta'}
                              </span>
                              <ArrowRight className="w-5 h-5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              ) : currentQuestion === 3 ? (
                /* Third Question with Difficulty Selection */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-5xl mx-auto h-full flex flex-col"
                >
                  {/* Question Card */}
                  <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl mb-4">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentQuestionData?.iconColor} flex items-center justify-center border ${currentQuestionData?.borderColor}`}>
                          {currentQuestionData?.icon && <currentQuestionData.icon className={`w-6 h-6 ${currentQuestionData.textColor}`} />}
                        </div>
                        <div>
                          <div className={`${currentQuestionData?.textColor} text-sm font-medium`}>{currentQuestionData?.typeLabel}</div>
                          <div className="text-white/60 text-sm">{currentReview.tags[0] || 'Aprendizado'} • Step {currentReview.step + 1}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {currentReview.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                        {currentQuestionData?.question}
                      </h1>
                      <p className="text-white/60 text-lg">
                        {currentQuestionData?.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Answer Input */}
                  <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl flex-1 flex flex-col min-h-[180px] mb-4">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-white font-medium text-lg">
                        {currentQuestionData?.type === 'analysis' ? 'Sua análise:' : 
                         currentQuestionData?.type === 'practical' ? 'Sua aplicação prática:' : 'Sua resposta:'}
                      </span>
                      
                      {/* Input Mode Toggle */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={switchToTextMode}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                            inputMode === 'text' 
                              ? 'bg-white/10 border-white/20 text-white' 
                              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                          }`}
                        >
                          <Type className="w-4 h-4" />
                          <span className="text-sm font-medium">Texto</span>
                        </button>
                        <button
                          onClick={toggleRecording}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                            inputMode === 'voice' 
                              ? 'bg-red-500/20 border-red-500/30 text-red-400' 
                              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                          }`}
                        >
                          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          <span className="text-sm font-medium">Voz</span>
                        </button>
                      </div>
                    </div>

                    {/* Input Area */}
                    <div className="flex-1 flex flex-col">
                      {inputMode === 'text' ? (
                        <textarea
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder={currentQuestionData?.placeholder}
                          className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/40 resize-none focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 text-lg leading-relaxed"
                          rows={4}
                        />
                      ) : (
                        <div className="flex-1 flex flex-col">
                          {/* Mostrar texto transcrito se existir */}
                          {answer.trim() && (
                            <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white/70 text-sm">Texto transcrito:</span>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={handleImproveText}
                                  disabled={isImprovingText || isProcessing}
                                  className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-md text-white text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isImprovingText ? (
                                    <>
                                      <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                                      <span>Aprimorando...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Lightbulb className="w-3 h-3" />
                                      <span>Aprimorar</span>
                                    </>
                                  )}
                                </motion.button>
                              </div>
                              <p className="text-white text-sm leading-relaxed">
                                {answer}
                              </p>
                              <div className="flex items-center space-x-3 mt-2 text-xs text-white/60">
                                <span>{answer.length} caracteres</span>
                                <span>~{Math.ceil(answer.split(' ').length)} palavras</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                              <motion.button
                                onClick={toggleRecording}
                                disabled={isTranscribing}
                                animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ duration: 1, repeat: Infinity }}
                                className={`w-24 h-24 rounded-full border-4 mb-6 mx-auto flex items-center justify-center transition-all ${
                                  isRecording 
                                    ? 'border-red-500 bg-red-500/20 hover:bg-red-500/30' 
                                    : isTranscribing
                                      ? 'border-blue-500 bg-blue-500/20'
                                      : 'border-white/30 bg-white/5 hover:bg-white/10'
                                } ${isTranscribing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                {isTranscribing ? (
                                  <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                                ) : (
                                  <Mic className={`w-10 h-10 ${isRecording ? 'text-red-400' : 'text-white/60'}`} />
                                )}
                              </motion.button>
                              
                              {isRecording && (
                                <div className="mb-4">
                                  <div className="bg-red-500/20 rounded-full px-3 py-1 inline-flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    <span className="text-red-400 text-sm font-mono">
                                      {formatTime(recordingTime)}
                                    </span>
                                  </div>
                                </div>
                              )}
                              
                              <p className="text-white text-xl mb-2">
                                {isTranscribing ? 
                                  'Transcrevendo áudio...' :
                                  isRecording ? 
                                    (currentQuestionData?.type === 'analysis' ? 'Gravando sua análise...' : 
                                     currentQuestionData?.type === 'practical' ? 'Gravando aplicação prática...' : 
                                     'Gravando sua resposta...') : 
                                    'Clique para gravar'
                                }
                              </p>
                              <p className="text-white/60">
                                {isTranscribing ?
                                  'Aguarde enquanto convertemos sua fala em texto' :
                                  isRecording ? 
                                    (currentQuestionData?.type === 'analysis' ? 'Explique a importância do conteúdo' : 
                                     currentQuestionData?.type === 'practical' ? 'Descreva exemplos e situações práticas' : 
                                     'Fale naturalmente sobre o tópico') : 
                                    (currentQuestionData?.type === 'analysis' ? 'Use sua voz para analisar o material' : 
                                     currentQuestionData?.type === 'practical' ? 'Use sua voz para explicar aplicações' : 
                                     'Use sua voz para responder à pergunta')
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Character Count & Actions */}
                    {inputMode === 'text' && (
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                        <div className="flex items-center space-x-4 text-sm text-white/60">
                          <span>{answer.length} caracteres</span>
                          <span>~{Math.ceil(answer.split(' ').length)} palavras</span>
                          {answer.length > 0 && (
                            <div className="flex items-center space-x-1 text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              <span>Pronto para enviar</span>
                            </div>
                          )}
                        </div>
                        
                        {answer.trim() && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleImproveText}
                            disabled={isImprovingText || isProcessing}
                            className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-white text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isImprovingText ? (
                              <>
                                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Aprimorando...</span>
                              </>
                            ) : (
                              <>
                                <Lightbulb className="w-3 h-3" />
                                <span>Aprimorar com IA</span>
                              </>
                            )}
                          </motion.button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Difficulty Selection - Only for Question 3 */}
                  <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl mb-4">
                    <div className="mb-4">
                      <h3 className="text-white font-medium text-lg mb-2">Qual foi a dificuldade desta pergunta?</h3>
                      <p className="text-white/60 text-sm">Esta informação nos ajuda a calibrar futuras revisões</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {difficultyOptions.map((option) => (
                        <motion.button
                          key={option.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedDifficulty(option.id)}
                          className={`h-14 rounded-2xl border-2 font-semibold transition-all duration-300 flex items-center justify-center ${
                            selectedDifficulty === option.id
                              ? option.color
                              : `${option.baseColor} ${option.hoverColor}`
                          }`}
                        >
                          <span className="text-lg">{option.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePreviousQuestion}
                      className="flex items-center space-x-2 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white/70 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Anterior</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (answer.trim() && selectedDifficulty) {
                          setIsSubmitting(true);
                          const finalAnswers = [...answers];
                          finalAnswers[currentQuestion - 1] = answer.trim();
                          
                          setTimeout(() => {
                            completeReview(finalAnswers, selectedDifficulty as 'easy' | 'medium' | 'hard');
                          }, 2000);
                        }
                      }}
                      disabled={!answer.trim() || !selectedDifficulty || isSubmitting}
                      className="flex-1 relative group"
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className={`relative overflow-hidden h-14 rounded-2xl transition-all duration-300 flex items-center justify-center font-semibold text-lg ${
                        answer.trim() && selectedDifficulty && !isSubmitting
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white/10 text-white/50 cursor-not-allowed'
                      }`}>
                        <AnimatePresence mode="wait">
                          {isSubmitting ? (
                            <motion.div
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center space-x-3"
                            >
                              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Finalizando sessão...</span>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="finish"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center space-x-3"
                            >
                              <Star className="w-6 h-6" />
                              <span>Finalizar Revisão</span>
                              <CheckCircle className="w-6 h-6" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              ) : currentQuestion === 3 ? (
                /* Third Question with Difficulty Selection */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-5xl mx-auto h-full flex flex-col"
                >
                  {/* Question Card */}
                  <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl mb-4">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentQuestionData?.iconColor} flex items-center justify-center border ${currentQuestionData?.borderColor}`}>
                          {currentQuestionData?.icon && <currentQuestionData.icon className={`w-6 h-6 ${currentQuestionData.textColor}`} />}
                        </div>
                        <div>
                          <div className={`${currentQuestionData?.textColor} text-sm font-medium`}>{currentQuestionData?.typeLabel}</div>
                          <div className="text-white/60 text-sm">{currentReview.tags[0] || 'Aprendizado'} • Step {currentReview.step + 1}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {currentReview.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                        {currentQuestionData?.question}
                      </h1>
                      <p className="text-white/60 text-lg">
                        {currentQuestionData?.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Answer Input */}
                  <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl flex-1 flex flex-col min-h-[180px] mb-4">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-white font-medium text-lg">
                        {currentQuestionData?.type === 'practical' ? 'Sua aplicação prática:' : 'Sua resposta:'}
                      </span>
                      
                      {/* Input Mode Toggle */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={switchToTextMode}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                            inputMode === 'text' 
                              ? 'bg-white/10 border-white/20 text-white' 
                              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                          }`}
                        >
                          <Type className="w-4 h-4" />
                          <span className="text-sm font-medium">Texto</span>
                        </button>
                        <button
                          onClick={toggleRecording}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                            inputMode === 'voice' 
                              ? 'bg-red-500/20 border-red-500/30 text-red-400' 
                              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                          }`}
                        >
                          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          <span className="text-sm font-medium">Voz</span>
                        </button>
                      </div>
                    </div>

                    {/* Input Area */}
                    <div className="flex-1 flex flex-col">
                      {inputMode === 'text' ? (
                        <textarea
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder={currentQuestionData?.placeholder}
                          className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/40 resize-none focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 text-lg leading-relaxed"
                          rows={4}
                        />
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-center">
                            <motion.div
                              animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ duration: 1, repeat: Infinity }}
                              className={`w-24 h-24 rounded-full border-4 mb-6 mx-auto flex items-center justify-center ${
                                isRecording 
                                  ? 'border-red-500 bg-red-500/20' 
                                  : 'border-white/30 bg-white/5'
                              }`}
                            >
                              <Mic className={`w-10 h-10 ${isRecording ? 'text-red-400' : 'text-white/60'}`} />
                            </motion.div>
                            <p className="text-white text-xl mb-2">
                              {isRecording ? 'Gravando aplicação prática...' : 'Clique para gravar'}
                            </p>
                            <p className="text-white/60">
                              {isRecording ? 'Descreva exemplos e situações práticas' : 'Use sua voz para explicar aplicações'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Character Count & Actions */}
                    {inputMode === 'text' && (
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                        <div className="flex items-center space-x-4 text-sm text-white/60">
                          <span>{answer.length} caracteres</span>
                          <span>~{Math.ceil(answer.split(' ').length)} palavras</span>
                          {answer.length > 0 && (
                            <div className="flex items-center space-x-1 text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              <span>Pronto para enviar</span>
                            </div>
                          )}
                        </div>
                        
                        {answer.trim() && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleImproveText}
                            disabled={isImprovingText || isProcessing}
                            className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-white text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isImprovingText ? (
                              <>
                                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Aprimorando...</span>
                              </>
                            ) : (
                              <>
                                <Lightbulb className="w-3 h-3" />
                                <span>Aprimorar com IA</span>
                              </>
                            )}
                          </motion.button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Difficulty Selection */}
                  <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl mb-4">
                    <div className="mb-4">
                      <h3 className="text-white font-medium text-lg mb-2">Qual foi a dificuldade desta pergunta?</h3>
                      <p className="text-white/60 text-sm">Esta informação nos ajuda a calibrar futuras revisões</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {difficultyOptions.map((option) => (
                        <motion.button
                          key={option.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedDifficulty(option.id)}
                          className={`h-14 rounded-2xl border-2 font-semibold transition-all duration-300 flex items-center justify-center ${
                            selectedDifficulty === option.id
                              ? option.color
                              : `${option.baseColor} ${option.hoverColor}`
                          }`}
                        >
                          <span className="text-lg">{option.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePreviousQuestion}
                      className="flex items-center space-x-2 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white/70 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Anterior</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (answer.trim() && selectedDifficulty) {
                          setIsSubmitting(true);
                          const finalAnswers = [...answers];
                          finalAnswers[currentQuestion - 1] = answer.trim();
                          
                          setTimeout(() => {
                            completeReview(finalAnswers, selectedDifficulty as 'easy' | 'medium' | 'hard');
                          }, 2000);
                        }
                      }}
                      disabled={!answer.trim() || !selectedDifficulty || isSubmitting}
                      className="flex-1 relative group"
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className={`relative overflow-hidden h-14 rounded-2xl transition-all duration-300 flex items-center justify-center font-semibold text-lg ${
                        answer.trim() && selectedDifficulty && !isSubmitting
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white/10 text-white/50 cursor-not-allowed'
                      }`}>
                        <AnimatePresence mode="wait">
                          {isSubmitting ? (
                            <motion.div
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center space-x-3"
                            >
                              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Finalizando sessão...</span>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="finish"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center space-x-3"
                            >
                              <Star className="w-6 h-6" />
                              <span>Finalizar Revisão</span>
                              <CheckCircle className="w-6 h-6" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                /* Difficulty Selection after questions */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-white text-center">
                      Como foi relembrar este conteúdo?
                    </h3>

                    <div className="grid grid-cols-3 gap-4">
                      {DIFFICULTY_OPTIONS.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDifficultySelect(option.value)}
                          disabled={isAnswering}
                          className={`relative group p-6 rounded-2xl border transition-all duration-300 ${
                            selectedDifficulty === option.value
                              ? 'border-white/30 bg-white/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-10 rounded-2xl`} />
                          <div className="relative z-10 text-center">
                            <div className="text-white font-semibold text-xl mb-2">{option.label}</div>
                            <div className="text-white/60 mb-3">{option.description}</div>
                            <div className="text-white/60 text-sm">
                              Próxima: {option.value === 'easy' ? '7 dias' : option.value === 'medium' ? '3 dias' : '1 dia'}
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
              <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-white text-lg">
                {currentQuestion <= totalQuestions && currentQuestionData?.type === 'analysis' ? 'Analisando sua resposta...' : 
                 currentQuestion <= totalQuestions && currentQuestionData?.type === 'practical' ? 'Processando aplicação...' : 
                 currentQuestion > totalQuestions ? 'Finalizando sua revisão...' : 'Processando resposta...'}
              </span>
              <span className="text-white/60 text-sm">Aguarde um momento</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 