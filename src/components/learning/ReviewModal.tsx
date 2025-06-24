
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
        <DialogContent className="w-full max-w-lg mx-auto border-0 bg-gray-900 text-white shadow-2xl">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-6 p-8">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Tudo em dia! 🎉
                </h2>
                <p className="text-gray-300 mb-6">
                  Você não tem revisões pendentes hoje.
                </p>
                <p className="text-sm text-gray-400">
                  Continue aprendendo e volte depois para suas próximas revisões!
                </p>
              </div>
              <Button 
                onClick={onClose} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`
        w-full border-0 bg-gray-900 text-white shadow-2xl overflow-visible
        ${isMobile 
          ? 'max-w-[95vw] mx-2 rounded-2xl' 
          : 'max-w-2xl mx-auto rounded-3xl'
        }
      `}>
        {/* Wrapper centralizado */}
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="w-full space-y-6 p-6">
            
            {/* Header */}
            <DialogHeader className="text-center space-y-4">
              <DialogTitle className="flex items-center justify-center gap-3 text-xl font-bold">
                <Brain className="w-6 h-6 text-blue-400" />
                <span>Revisão {currentIndex + 1} de {reviews.length}</span>
                <Badge variant="outline" className="bg-blue-500/20 border-blue-400 text-blue-300">
                  #{formatId(currentReview?.numeroId)}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            {!showQuestions ? (
              /* Card de Revisão - Sem Scroll Interno */
              <div className="space-y-6">
                <Card className="w-full overflow-visible bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-gray-700/50 backdrop-blur-sm rounded-2xl p-6">
                  <div className="space-y-4">
                    {/* Meta Info */}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar className="w-4 h-4" />
                        {new Date(currentReview.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit'
                        })}
                        • {getDaysFromCreation(currentReview.createdAt)} dias atrás
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <Badge className="bg-yellow-500/20 border-yellow-400 text-yellow-300">
                          Step {currentReview.step + 1}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Título */}
                    {currentReview.title && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2 break-words">
                          {currentReview.title}
                        </h3>
                      </div>
                    )}
                    
                    {/* Conteúdo Principal */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-200 mb-3">
                        Conteúdo para revisar:
                      </h4>
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                        <p className="text-gray-100 leading-relaxed break-words whitespace-pre-wrap">
                          {currentReview.content}
                        </p>
                      </div>
                    </div>

                    {/* Contexto */}
                    {currentReview.context && (
                      <div className="pt-3 border-t border-gray-700/50">
                        <p className="text-gray-300 text-sm break-words">
                          <strong className="text-gray-200">Contexto:</strong> {currentReview.context}
                        </p>
                      </div>
                    )}

                    {/* Tags */}
                    {currentReview.tags.length > 0 && (
                      <div className="flex items-center gap-2 pt-2 flex-wrap">
                        <Tag className="w-4 h-4 text-gray-400" />
                        {currentReview.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-gray-700/50 border-gray-600 text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>

                {/* Instruções e Botões */}
                <div className="text-center space-y-4">
                  <p className="text-gray-300">
                    Leia o conteúdo acima e prepare-se para responder algumas perguntas.
                  </p>
                  
                  <div className="flex justify-center gap-3 flex-wrap">
                    <Button 
                      variant="outline" 
                      onClick={skipReview}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Pular Esta
                    </Button>
                    <Button 
                      onClick={startReview}
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white px-6"
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
                  <h3 className="text-lg font-semibold text-white">
                    Pergunta {questionIndex + 1} de {questions.length}
                  </h3>
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Pergunta */}
                <Card className="bg-gradient-to-r from-green-900/40 to-blue-900/40 border border-gray-700/50 p-6 rounded-2xl">
                  <p className="text-lg text-gray-100 break-words">
                    {questions[questionIndex]}
                  </p>
                </Card>

                {/* Resposta */}
                <div className="space-y-3">
                  <Label htmlFor="answer" className="text-gray-200">Sua resposta:</Label>
                  <Textarea
                    id="answer"
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Digite sua resposta aqui..."
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 rounded-xl min-h-[120px] resize-none"
                  />
                </div>

                {/* Botões de Navegação */}
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <Button 
                    variant="outline" 
                    onClick={prevQuestion}
                    disabled={questionIndex === 0}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
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
                          className="border-red-400 text-red-400 hover:bg-red-500/20 text-xs px-3"
                        >
                          Difícil
                        </Button>
                        <Button 
                          onClick={() => completeReview([...answers.slice(0, questionIndex), currentAnswer], 'medium')}
                          variant="outline"
                          className="border-yellow-400 text-yellow-400 hover:bg-yellow-500/20 text-xs px-3"
                        >
                          Médio
                        </Button>
                        <Button 
                          onClick={() => completeReview([...answers.slice(0, questionIndex), currentAnswer], 'easy')}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-3"
                        >
                          Fácil
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={nextQuestion}
                        className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white"
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
