import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, ArrowRight, ArrowLeft, Calendar, Tag, Brain, Clock } from 'lucide-react';
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
        <DialogContent className={isMobile ? "max-w-[95vw] max-h-[90vh] m-2" : "max-w-lg"}>
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
              Tudo em dia!
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 md:py-6">
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-3 md:mb-4">
              Você não tem revisões pendentes hoje.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Continue aprendendo e volte depois para suas próximas revisões!
            </p>
          </div>
          <Button onClick={onClose} className="w-full">
            Fechar
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={isMobile 
        ? "max-w-[95vw] max-h-[95vh] m-2 p-4 overflow-hidden flex flex-col" 
        : "max-w-3xl max-h-[90vh] overflow-y-auto"
      }>
        <DialogHeader className={isMobile ? "pb-3" : ""}>
          <DialogTitle className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <Brain className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              <span className={isMobile ? 'text-sm' : ''}>
                Revisão {currentIndex + 1} de {reviews.length}
              </span>
            </div>
            <Badge variant="outline" className={isMobile ? "text-xs px-2 py-1" : ""}>
              #{formatId(currentReview?.numeroId)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className={isMobile ? "flex-1 overflow-hidden flex flex-col" : ""}>
          {!showQuestions ? (
            <div className={`space-y-4 ${isMobile ? 'flex-1 flex flex-col' : 'space-y-6'}`}>
              <Card className={`${isMobile ? 'p-4 flex-1 overflow-y-auto' : 'p-6'} bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0`}>
                <div className={`space-y-3 ${isMobile ? 'space-y-2' : 'space-y-4'}`}>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400`}>
                      <Calendar className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                      {new Date(currentReview.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit'
                      })}
                      • {getDaysFromCreation(currentReview.createdAt)} dias atrás
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-yellow-600`} />
                      <Badge className={`${isMobile ? 'text-xs px-2 py-0.5' : ''} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`}>
                        Step {currentReview.step + 1}
                      </Badge>
                    </div>
                  </div>
                  
                  {currentReview.title && (
                    <div>
                      <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900 dark:text-white mb-2`}>
                        {currentReview.title}
                      </h3>
                    </div>
                  )}
                  
                  <div>
                    <h4 className={`${isMobile ? 'text-sm' : 'text-md'} font-medium text-gray-800 dark:text-gray-200 mb-2`}>
                      Conteúdo para revisar:
                    </h4>
                    <p className={`text-gray-800 dark:text-gray-200 leading-relaxed ${isMobile ? 'text-sm' : ''}`}>
                      {currentReview.content}
                    </p>
                  </div>

                  {currentReview.context && (
                    <div className={`${isMobile ? 'pt-2' : 'pt-3'} border-t border-gray-200 dark:border-gray-700`}>
                      <p className={`text-gray-600 dark:text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        <strong>Contexto:</strong> {currentReview.context}
                      </p>
                    </div>
                  )}

                  {currentReview.tags.length > 0 && (
                    <div className={`flex items-center gap-2 ${isMobile ? 'pt-1' : 'pt-2'}`}>
                      <Tag className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-gray-400`} />
                      {currentReview.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className={isMobile ? "text-xs px-1 py-0.5" : "text-xs"}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              <div className={`text-center ${isMobile ? 'space-y-3 pb-2' : 'space-y-4'}`}>
                <p className={`text-gray-600 dark:text-gray-400 ${isMobile ? 'text-sm' : ''}`}>
                  Leia o conteúdo acima e prepare-se para responder algumas perguntas.
                </p>
                
                <div className={`flex justify-center gap-3 ${isMobile ? 'gap-2' : ''}`}>
                  <Button 
                    variant="outline" 
                    onClick={skipReview}
                    className={isMobile ? "text-sm px-3 py-2" : ""}
                  >
                    Pular Esta
                  </Button>
                  <Button 
                    onClick={startReview}
                    className={`bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white ${isMobile ? 'text-sm px-3 py-2' : ''}`}
                  >
                    Iniciar Revisão
                    <ArrowRight className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} ml-2`} />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`space-y-4 ${isMobile ? 'flex-1 flex flex-col space-y-3' : 'space-y-6'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>
                  Pergunta {questionIndex + 1} de {questions.length}
                </h3>
                <div className={`${isMobile ? 'w-20' : 'w-32'} bg-gray-200 dark:bg-gray-700 rounded-full h-2`}>
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <Card className={`${isMobile ? 'p-4' : 'p-6'} bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-0`}>
                <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-gray-800 dark:text-gray-200`}>
                  {questions[questionIndex]}
                </p>
              </Card>

              <div className={`space-y-2 ${isMobile ? 'flex-1 flex flex-col' : ''}`}>
                <Label htmlFor="answer" className={isMobile ? "text-sm" : ""}>Sua resposta:</Label>
                <Textarea
                  id="answer"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Digite sua resposta aqui..."
                  className={`${isMobile ? 'min-h-[80px] flex-1 text-sm' : 'min-h-[120px]'}`}
                />
              </div>

              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={prevQuestion}
                  disabled={questionIndex === 0}
                  className={isMobile ? "text-sm px-3 py-2" : ""}
                >
                  <ArrowLeft className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} mr-2`} />
                  Anterior
                </Button>

                <div className={`flex gap-2 ${isMobile ? 'gap-1' : ''}`}>
                  {questionIndex === questions.length - 1 && (
                    <>
                      <Button 
                        onClick={() => completeReview([...answers.slice(0, questionIndex), currentAnswer], 'hard')}
                        variant="outline"
                        className={`border-red-200 text-red-600 hover:bg-red-50 ${isMobile ? 'text-xs px-2 py-2' : ''}`}
                      >
                        Difícil
                      </Button>
                      <Button 
                        onClick={() => completeReview([...answers.slice(0, questionIndex), currentAnswer], 'medium')}
                        variant="outline"
                        className={`border-yellow-200 text-yellow-600 hover:bg-yellow-50 ${isMobile ? 'text-xs px-2 py-2' : ''}`}
                      >
                        Médio
                      </Button>
                      <Button 
                        onClick={() => completeReview([...answers.slice(0, questionIndex), currentAnswer], 'easy')}
                        className={`bg-green-500 hover:bg-green-600 text-white ${isMobile ? 'text-xs px-2 py-2' : ''}`}
                      >
                        Fácil
                      </Button>
                    </>
                  )}
                  
                  {questionIndex < questions.length - 1 && (
                    <Button 
                      onClick={nextQuestion}
                      className={`bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white ${isMobile ? 'text-sm px-3 py-2' : ''}`}
                    >
                      Próxima
                      <ArrowRight className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} ml-2`} />
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
