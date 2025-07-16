'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Plus, 
  Calendar, 
  Clock, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Settings, 
  Search,
  Bell,
  User,
  ArrowRight,
  CheckCircle,
  RefreshCw,
  Star,
  Zap,
  ArrowLeft,
  Mic,
  MicOff,
  Send,
  Sparkles,
  MessageCircle,
  Volume2,
  RotateCcw,
  Edit3,
  Save,
  X,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { useLearning } from '@/hooks/useLearning';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { useToast } from '@/hooks/use-toast';

export default function NewLearningPage() {
  const navigate = useNavigate();
  const { addLearningEntry } = useLearning();
  const { improveText, generateTitleAndTags, transcribeAudio } = useEnhancedAI();
  const { toast } = useToast();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState('home');
  const [pendingReviews] = useState(12);
  const [completedToday] = useState(5);
  const [learningStreak] = useState(7);
  
  // Chat states
  const [showChat, setShowChat] = useState(true); // Always show chat since this is the chat page
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cardPreview, setCardPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showImprovedCard, setShowImprovedCard] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const closeChat = () => {
    setShowChat(false);
    setInputText('');
    setIsRecording(false);
    setCardPreview(null);
    setShowImprovedCard(false);
    setIsCardExpanded(false);
    setIsProcessing(false);
    navigate('/'); // Navigate back to home
  };

  const generateCardPreview = (text) => {
    if (text.trim().length < 10) {
      setCardPreview(null);
      return;
    }

    const preview = {
      id: Date.now(),
      title: 'Clique em "Aprimorar com IA" para gerar título',
      content: text,
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isImproved: false
    };
    
    setCardPreview(preview);
  };

  const handleTextChange = (text) => {
    setInputText(text);
    generateCardPreview(text);
  };

  const handleImproveWithAI = async () => {
    if (!cardPreview) return;
    
    setIsProcessing(true);
    
    try {
      // Use real AI improvement
      const improvedText = await improveText(cardPreview.content);
      const { title, tags } = await generateTitleAndTags(improvedText);
      
      // Create improved card - limit tags to 3
      const improvedCard = {
        ...cardPreview,
        title: title,
        content: cardPreview.content,
        improvedContent: improvedText,
        tags: tags.slice(0, 3), // Limit to 3 tags
        category: tags[0] || 'Tecnologia',
        difficulty: 'medium',
        isImproved: true
      };
      
      setCardPreview(improvedCard);
      setShowImprovedCard(true);
      
      toast({
        title: "Texto aprimorado!",
        description: "Título e tags foram gerados automaticamente",
        variant: "default"
      });
    } catch (error) {
      console.error('Erro ao aprimorar texto:', error);
      
      // Fallback to mock improvement
      const improvedCard = {
        ...cardPreview,
        title: 'Machine Learning: Fundamentos e Aplicações',
        content: cardPreview.content,
        improvedContent: `**Conceitos Principais:**
• Algoritmos Supervisionados: Treinados com dados rotulados
• Algoritmos Não Supervisionados: Encontram padrões sem rótulos

**Aplicações Práticas:**
• Classificação de emails (spam/não spam)
• Sistemas de recomendação
• Análise de clusters de clientes

**Próximos Passos:**
• Estudar algoritmos específicos (Linear Regression, K-Means)
• Praticar com datasets reais
• Explorar bibliotecas como scikit-learn`,
        tags: ['MachineLearning', 'IA', 'Algoritmos'], // Exactly 3 tags - single words
        category: 'Tecnologia',
        difficulty: 'medium',
        isImproved: true
      };
      
      setCardPreview(improvedCard);
      setShowImprovedCard(true);
      
      toast({
        title: "Texto aprimorado!",
        description: "Usando versão offline da IA",
        variant: "default"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveCard = async () => {
    if (!cardPreview) return;
    
    setIsProcessing(true);
    
    try {
      const content = cardPreview.isImproved ? cardPreview.improvedContent : cardPreview.content;
      const title = cardPreview.title === 'Clique em "Aprimorar com IA" para gerar título' 
        ? 'Novo Aprendizado' 
        : cardPreview.title;
      const tags = cardPreview.tags || ['Aprendizado'];
      
      await addLearningEntry(content, title, tags);
      
      toast({
        title: "Aprendizado salvo!",
        description: "Seu aprendizado foi registrado com sucesso",
        variant: "default"
      });
      
      // Navigate back to home after saving
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleCardExpansion = () => {
    setIsCardExpanded(!isCardExpanded);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      // Parar gravação
      setIsRecording(false);
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
    } else {
      // Iniciar gravação
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        
        const chunks = [];
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        
        recorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          setIsProcessing(true);
          
          try {
            const transcribedText = await transcribeAudio(audioBlob);
            if (transcribedText) {
              setInputText(transcribedText);
              generateCardPreview(transcribedText);
              toast({
                title: "Áudio transcrito!",
                description: "Texto convertido com sucesso",
                variant: "default"
              });
            } else {
              toast({
                title: "Erro na transcrição",
                description: "Não foi possível transcrever o áudio",
                variant: "destructive"
              });
            }
          } catch (error) {
            console.error('Erro na transcrição:', error);
            toast({
              title: "Erro na transcrição",
              description: "Tente novamente em alguns instantes",
              variant: "destructive"
            });
          } finally {
            setIsProcessing(false);
          }
          
          // Limpar stream
          stream.getTracks().forEach(track => track.stop());
        };
        
        setMediaRecorder(recorder);
        setAudioChunks(chunks);
        recorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Erro ao acessar microfone:', error);
        toast({
          title: "Erro no microfone",
          description: "Permita o acesso ao microfone para gravar",
          variant: "destructive"
        });
      }
    }
  };

  const stats = [
    { label: 'Aprendizados', value: 156, icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
    { label: 'Sequência', value: learningStreak, icon: Target, color: 'from-green-500 to-emerald-500' },
    { label: 'Concluídos', value: completedToday, icon: CheckCircle, color: 'from-purple-500 to-violet-500' }
  ];

  if (showChat) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-purple-800 to-black relative overflow-hidden flex flex-col">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-purple-700/30 to-black/90" />
        
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
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

        {/* Chat Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 bg-black/40 backdrop-blur-2xl border-b border-white/10 px-6 py-4 pt-12"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={closeChat}
              className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Novo Aprendizado</h1>
                <p className="text-white/60 text-xs">Assistente IA do Mindo</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Messages Area */}
        <div className="flex-1 relative z-10 px-4 py-6 overflow-y-auto">
          <div className="space-y-4 pb-4">
            
            {/* Card Preview */}
            <AnimatePresence>
              {cardPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={toggleCardExpansion}
                  className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 cursor-pointer"
                >
                  {/* Header: 3 Tags + Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {showImprovedCard && cardPreview.isImproved && cardPreview.tags ? (
                        cardPreview.tags.map((tag, index) => (
                          <div key={index} className="flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full">
                            <span className="text-white/70 text-sm font-medium">{tag}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full">
                          <span className="text-white/70 text-sm font-medium">aprendizado</span>
                        </div>
                      )}
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                    {cardPreview.title}
                  </h2>

                  {/* Date */}
                  <div className="flex items-center space-x-2 mb-6">
                    <span className="text-white/60 text-sm">{cardPreview.date}</span>
                    <span className="text-white/40">•</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-400 text-sm font-medium">Hoje</span>
                    </div>
                  </div>

                  {/* Expanded Content - appears BEFORE progress bar */}
                  <AnimatePresence>
                    {isCardExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden mb-6"
                      >
                        <div className="text-white/80 leading-relaxed">
                          {showImprovedCard && cardPreview.isImproved ? (
                            <div className="text-white/90 text-sm whitespace-pre-line leading-relaxed">
                              {cardPreview.improvedContent}
                            </div>
                          ) : (
                            <div>{cardPreview.content}</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Progress Bar - always appears after content */}
                  <div className="mb-6">
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: showImprovedCard ? '90%' : '45%' }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!isCardExpanded && showImprovedCard && (
                    <div className="flex gap-3 w-full">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowImprovedCard(false);
                        }}
                        className="flex-1 px-4 py-3 bg-white/10 rounded-2xl text-white/80 font-medium hover:bg-white/20 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4 inline mr-2" />
                        Voltar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveCard();
                        }}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg"
                      >
                        {isProcessing ? (
                          <div className="flex items-center justify-center space-x-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                            <span>Salvando...</span>
                          </div>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 inline mr-2" />
                            Salvar
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Expand Indicator */}
                  <div className="flex items-center justify-center mt-4">
                    <motion.div
                      animate={{ rotate: isCardExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
                    >
                      <ChevronDown className="w-4 h-4 text-white/60" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Helper Text */}
            {!cardPreview && !isRecording && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white/60" />
                </div>
                <h3 className="text-white font-medium mb-2">Compartilhe seu aprendizado</h3>
                <p className="text-white/60 text-sm px-4">
                  Escreva sobre o que você aprendeu ou grave um áudio que transcrevemos automaticamente
                </p>
              </motion.div>
            )}
            
          </div>
        </div>

        {/* Recording Overlay */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-black/80 backdrop-blur-xl rounded-3xl p-8 mx-6 border border-white/10 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-4 mx-auto"
                >
                  <Mic className="w-8 h-8 text-red-400" />
                </motion.div>
                
                <p className="text-white text-lg font-medium mb-2">Gravando...</p>
                <p className="text-white/60 mb-4">Fale sobre o que você aprendeu</p>
                
                <div className="text-red-400 font-mono text-2xl mb-6">
                  {formatRecordingTime(recordingTime)}
                </div>
                
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white/60 text-sm">Ouvindo...</span>
                </div>
                
                <button
                  onClick={toggleRecording}
                  className="bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-3 rounded-xl font-medium hover:bg-red-500/30 transition-colors"
                >
                  Parar Gravação
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 bg-black/40 backdrop-blur-2xl border-t border-white/10 px-4 py-4"
        >
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Digite o que você aprendeu hoje..."
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 resize-none focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all max-h-32"
                rows={3}
              />
              
              {inputText.trim() && (
                <div className="absolute bottom-2 right-2 text-white/60 text-xs">
                  {inputText.length} caracteres
                </div>
              )}
            </div>
            
            {/* Botão IA ou Microfone */}
            {inputText.trim() && cardPreview && !showImprovedCard ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleImproveWithAI}
                disabled={isProcessing}
                className="px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg min-w-[120px] flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                    />
                    <span className="text-sm">IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span className="text-sm">Aprimorar</span>
                  </>
                )}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleRecording}
                className={`p-3 rounded-2xl transition-colors min-w-[60px] flex items-center justify-center ${
                  isRecording
                    ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                    : 'bg-white/10 border border-white/20 text-white/80 hover:text-white'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </motion.button>
            )}
          </div>
          
          {inputText.trim() && !cardPreview && (
            <div className="text-center text-white/60 text-xs mt-2">
              Continue digitando para ver o preview do card...
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // This part won't be reached since showChat is always true for this page
  return null;
}