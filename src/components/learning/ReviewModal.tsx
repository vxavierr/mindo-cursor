
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, ArrowRight, ArrowLeft, Calendar, Tag, Brain, Clock, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface LearningEntry {
  id: string;
  numeroId: number;
  title: string;
  content: string;
  context?: string;
  tags: string[];
  createdAt: string;
  step: number;
  reviews: Array<{ 
    date: string; 
    questions?: string[]; 
    answers?: string[]; 
    step?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  }>;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: LearningEntry[];
  onCompleteReview: (entryId: string, difficulty: 'easy' | 'medium' | 'hard', questions: string[], answers: string[]) => void;
}

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
    const baseQuestions = [
      `Explique com suas palavras: ${content.length > 80 ? content.substring(0, 80) + '...' : content}`,
      `Qual a aplicação prática deste conhecimento?`,
      `Quais são os pontos-chave que você deve lembrar?`
    ];

    if (title) {
      baseQuestions.unshift(`Explique o conceito: ${title}`);
    }

    return baseQuestions.slice(0, content.length > 100 ? 3 : 2);
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

  const getDaysFromCreation = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (!isOpen) return null;

  if (reviews.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`
          border-0 shadow-2xl overflow-visible animate-scale-in
          ${isMobile 
            ? 'w-[90vw] max-w-none mx-4 rounded-2xl bg-white p-6' 
            : 'max-w-md mx-auto rounded-3xl bg-white p-8'
          }
        `}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Tudo em dia! 🎉
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                Você não tem revisões pendentes hoje.
              </p>
              <p className="text-sm text-gray-500">
                Continue aprendendo e volte depois para suas próximas revisões!
              </p>
            </div>
            <Button 
              onClick={onClose} 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-base font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`
        border-0 shadow-2xl overflow-visible animate-scale-in
        ${isMobile 
          ? 'w-[90vw] max-w-none mx-4 rounded-2xl bg-white' 
          : 'max-w-lg mx-auto rounded-3xl bg-white'
        }
      `}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        <div className={`space-y-6 ${isMobile ? 'p-4' : 'p-8'}`}>
          
          {/* Header */}
          <DialogHeader className="text-center space-y-4">
            <DialogTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <span>Revisão {currentIndex + 1} de {reviews.length}</span>
            </DialogTitle>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-2 text-sm font-medium">
              #{formatId(currentReview?.numeroId)}
            </Badge>
          </DialogHeader>

          {!showQuestions ? (
            /* Card de Revisão */
            <div className="space-y-6">
              <Card className="w-full overflow-visible bg-gradient-to-br from-gray-50 to-blue-50/30 border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="space-y-5">
                  {/* Meta Info */}
                  <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium">
                        {new Date(currentReview.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit'
                        })}
                        • {getDaysFromCreation(currentReview.createdAt)} dias atrás
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-yellow-600" />
                      </div>
                      <Badge className="bg-yellow-100 border-yellow-200 text-yellow-800 text-xs px-3 py-1">
                        Step {currentReview.step + 1}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Título */}
                  {currentReview.title && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 break-words leading-relaxed">
                        {currentReview.title}
                      </h3>
                    </div>
                  )}
                  
                  {/* Conteúdo Principal */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Conteúdo para revisar:
                    </h4>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <p className="text-gray-800 leading-relaxed break-words whitespace-pre-wrap text-base">
                        {currentReview.content}
                      </p>
                    </div>
                  </div>

                  {/* Contexto */}
                  {currentReview.context && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-gray-600 text-sm break-words leading-relaxed">
                        <strong className="text-gray-800 font-semibold">Contexto:</strong> {currentReview.context}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {currentReview.tags.length > 0 && (
                    <div className="flex items-center gap-2 pt-2 flex-wrap">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                        <Tag className="w-3 h-3 text-purple-600" />
                      </div>
                      {currentReview.tags.map((tag, index) => (
                        <Badge key={index} className="text-xs bg-purple-100 border-purple-200 text-purple-700 px-3 py-1 rounded-full">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Instruções e Botões */}
              <div className="text-center space-y-6">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-blue-800 font-medium">
                    Leia o conteúdo acima e prepare-se para responder algumas perguntas.
                  </p>
                </div>
                
                <div className="flex justify-center gap-3 flex-wrap">
                  <Button 
                    variant="outline" 
                    onClick={skipReview}
                    className="border-gray-300 text-gray-600 hover:bg-gray-100 px-6 py-2 rounded-xl"
                  >
                    Pular Esta
                  </Button>
                  <Button 
                    onClick={startReview}
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white px-8 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all font-medium"
                  >
                    Iniciar Revisão
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Tela de Perguntas */
            <div className="space-y-6">
              {/* Progress */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Pergunta {questionIndex + 1} de {questions.length}
                </h3>
                <div className="w-32 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Pergunta */}
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-blue-200 p-6 rounded-2xl shadow-sm">
                <p className="text-lg text-gray-800 break-words leading-relaxed font-medium">
                  {questions[questionIndex]}
                </p>
              </Card>

              {/* Resposta */}
              <div className="space-y-3">
                <Label htmlFor="answer" className="text-gray-700 font-semibold">Sua resposta:</Label>
                <Textarea
                  id="answer"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Digite sua resposta aqui..."
                  className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 rounded-xl min-h-[120px] resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Botões de Navegação */}
              <div className="flex justify-between items-center flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  onClick={prevQuestion}
                  disabled={questionIndex === 0}
                  className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>

                <div className="flex gap-2 flex-wrap">
                  {questionIndex === questions.length - 1 ? (
                    <>
                      <Button 
                        onClick={() => completeReview([...answers.slice(0, questionIndex), currentAnswer], 'hard')}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50 text-xs px-3 py-2 rounded-xl"
                      >
                        Difícil
                      </Button>
                      <Button 
                        onClick={() => completeReview([...answers.slice(0, questionIndex), currentAnswer], 'medium')}
                        variant="outline"
                        className="border-yellow-300 text-yellow-600 hover:bg-yellow-50 text-xs px-3 py-2 rounded-xl"
                      >
                        Médio
                      </Button>
                      <Button 
                        onClick={() => completeReview([...answers.slice(0, questionIndex), currentAnswer], 'easy')}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-2 rounded-xl shadow-lg"
                      >
                        Fácil
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={nextQuestion}
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all font-medium"
                    >
                      Próxima
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
