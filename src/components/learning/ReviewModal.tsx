
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { LearningEntry, ReviewModalProps } from './types/review';
import EmptyReviewState from './EmptyReviewState';
import ReviewCard from './ReviewCard';
import QuestionCard from './QuestionCard';

const ReviewModal = ({ isOpen, onClose, reviews, onCompleteReview }: ReviewModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const isMobile = useIsMobile();

  const currentReview = reviews[currentIndex];

  const formatId = (numeroId: number) => {
    return String(numeroId).padStart(4, '0');
  };

  const generateQuestions = (content: string, title?: string) => {
    const topicReference = title ? `"${title}"` : 'este tema';
    
    return [
      `O que posso recordar sobre ${topicReference} sem consultar fontes?`,
      `Como este conteúdo se relaciona com o que já sei e onde posso aplicá-lo?`,
      `Quando e como devo revisar este material novamente?`
    ];
  };

  const startReview = () => {
    if (!currentReview) return;
    
    const generatedQuestions = generateQuestions(currentReview.content, currentReview.title);
    setQuestions(generatedQuestions);
    setAnswers(new Array(generatedQuestions.length).fill(''));
    setQuestionIndex(0);
    setCurrentAnswer('');
    setShowQuestions(true);
  };

  const nextQuestion = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = currentAnswer;
    setAnswers(updatedAnswers);
    
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setCurrentAnswer(answers[questionIndex + 1] || '');
    } else {
      completeReview(updatedAnswers, 'medium');
    }
  };

  const prevQuestion = () => {
    if (questionIndex > 0) {
      const updatedAnswers = [...answers];
      updatedAnswers[questionIndex] = currentAnswer;
      setAnswers(updatedAnswers);
      
      setQuestionIndex(questionIndex - 1);
      setCurrentAnswer(answers[questionIndex - 1] || '');
    }
  };

  const completeReview = (finalAnswers: string[], difficulty: 'easy' | 'medium' | 'hard') => {
    onCompleteReview(currentReview.id, difficulty, questions, finalAnswers);
    
    toast({
      title: "Revisão concluída!",
      description: `Aprendizado #${formatId(currentReview.numeroId)} revisado com sucesso.`
    });

    if (currentIndex < reviews.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetReviewState();
    } else {
      toast({
        title: "Parabéns! 🎉",
        description: "Todas as revisões foram concluídas!"
      });
      onClose();
      resetModalState();
    }
  };

  const resetReviewState = () => {
    setShowQuestions(false);
    setQuestions([]);
    setAnswers([]);
    setCurrentAnswer('');
    setQuestionIndex(0);
  };

  const resetModalState = () => {
    setCurrentIndex(0);
    resetReviewState();
  };

  const skipReview = () => {
    if (currentIndex < reviews.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetReviewState();
    } else {
      onClose();
      resetModalState();
    }
  };

  const handleCompleteReviewWithAnswers = (difficulty: 'easy' | 'medium' | 'hard') => {
    const finalAnswers = [...answers.slice(0, questionIndex), currentAnswer];
    completeReview(finalAnswers, difficulty);
  };

  if (!isOpen) return null;

  if (reviews.length === 0) {
    return <EmptyReviewState isOpen={isOpen} onClose={onClose} />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`
        w-full border-0 bg-gray-900 text-white shadow-2xl overflow-hidden
        ${isMobile 
          ? 'max-w-[95vw] max-h-[90vh] rounded-2xl' 
          : 'max-w-4xl max-h-[85vh] rounded-3xl'
        }
      `}>
        {/* Container com scroll controlado */}
        <div className="overflow-y-auto max-h-full">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            
            {/* Header */}
            <DialogHeader className="text-center space-y-3">
              <DialogTitle className="flex items-center justify-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold flex-wrap">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                <span className="text-sm sm:text-base">Revisão {currentIndex + 1} de {reviews.length}</span>
                <Badge variant="outline" className="bg-blue-500/20 border-blue-400 text-blue-300 text-xs">
                  #{formatId(currentReview?.numeroId)}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            {!showQuestions ? (
              <ReviewCard 
                review={currentReview}
                currentIndex={currentIndex}
                totalReviews={reviews.length}
                onStartReview={startReview}
                onSkipReview={skipReview}
              />
            ) : (
              <QuestionCard 
                questions={questions}
                questionIndex={questionIndex}
                currentAnswer={currentAnswer}
                onAnswerChange={setCurrentAnswer}
                onNextQuestion={nextQuestion}
                onPrevQuestion={prevQuestion}
                onCompleteReview={handleCompleteReviewWithAnswers}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
