import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  RefreshCw, 
  X, 
  ArrowRight,
  Timer,
  CheckCircle,
  Brain,
  MessageSquare,
  Mic,
  MicOff,
  Type,
  Edit3,
  SkipForward
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LearningEntry } from './types/review';

interface MobileQuestionCardProps {
  questions: string[];
  questionIndex: number;
  currentAnswer: string;
  onAnswerChange: (answer: string) => void;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  onCompleteReview: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onClose: () => void;
  currentReview: LearningEntry;
}

const MobileQuestionCard = ({
  questions,
  questionIndex,
  currentAnswer,
  onAnswerChange,
  onNextQuestion,
  onPrevQuestion,
  onCompleteReview,
  onClose,
  currentReview
}: MobileQuestionCardProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const isLastQuestion = questionIndex === questions.length - 1;
  const isFirstQuestion = questionIndex === 0;

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    // Aqui você implementaria a lógica de gravação de voz
  };

  const handleInputModeToggle = () => {
    setInputMode(inputMode === 'text' ? 'voice' : 'text');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">
              Revisão {questionIndex + 1} de {questions.length}
            </span>
          </div>
          
          <button
            onClick={onPrevQuestion}
            disabled={isFirstQuestion}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-4">
          <div className="w-full bg-white/10 rounded-full h-1">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Timer */}
          <div className="flex items-center gap-2 mt-3 text-sm text-white/70">
            <Timer className="w-4 h-4" />
            <span>{formatTime(elapsedTime)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Question */}
        <motion.div
          key={questionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">
                Pergunta {questionIndex + 1}
              </h3>
              <p className="text-white/90 leading-relaxed">
                {questions[questionIndex]}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Answer Input */}
        <div className="space-y-4">
          {/* Input Mode Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/80">Sua resposta:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInputModeToggle}
                className={`p-2 rounded-lg transition-colors ${
                  inputMode === 'text' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'bg-white/10 text-white/60'
                }`}
              >
                <Type className="w-4 h-4" />
              </button>
              <button
                onClick={handleVoiceToggle}
                className={`p-2 rounded-lg transition-colors ${
                  inputMode === 'voice' 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-white/10 text-white/60'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Text Input */}
          {inputMode === 'text' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden"
            >
              <Textarea
                value={currentAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="Digite sua resposta aqui..."
                className="min-h-[120px] bg-transparent border-0 text-white placeholder:text-white/50 resize-none focus:ring-0"
              />
            </motion.div>
          )}

          {/* Voice Input */}
          {inputMode === 'voice' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center"
            >
              <div className="space-y-4">
                <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center transition-colors ${
                  isRecording 
                    ? 'bg-red-500/20 border-2 border-red-400 animate-pulse' 
                    : 'bg-white/10 border-2 border-white/30'
                }`}>
                  {isRecording ? <MicOff className="w-6 h-6 text-red-400" /> : <Mic className="w-6 h-6 text-white/60" />}
                </div>
                <p className="text-white/70">
                  {isRecording ? 'Gravando... Toque para parar' : 'Toque para começar a gravar'}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          {isLastQuestion ? (
            <div className="space-y-3">
              <p className="text-center text-sm text-white/70 mb-4">
                Como foi relembrar este conteúdo?
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => onCompleteReview('easy')}
                  className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-2xl"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Fácil - Lembrei facilmente
                </Button>
                
                <Button
                  onClick={() => onCompleteReview('medium')}
                  className="w-full h-14 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-2xl"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Médio - Lembrei com esforço
                </Button>
                
                <Button
                  onClick={() => onCompleteReview('hard')}
                  className="w-full h-14 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-2xl"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Difícil - Esqueci ou foi difícil
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={onNextQuestion}
              className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl"
            >
              Próxima Pergunta
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MobileQuestionCard; 