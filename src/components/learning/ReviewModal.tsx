
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, ArrowRight, ArrowLeft, Calendar, Tag, Brain } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Review {
  id: string;
  content: string;
  context?: string;
  tags: string[];
  createdAt: string;
  step: number;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  onComplete: (entryId: string, questions: string[], answers: string[]) => void;
}

const ReviewModal = ({ isOpen, onClose, reviews, onComplete }: ReviewModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);

  const currentReview = reviews[currentIndex];

  const generateQuestions = (content: string) => {
    // Simple AI-like question generation based on content
    const questionTemplates = [
      `Qual o conceito principal que você aprendeu sobre: "${content.substring(0, 50)}..."?`,
      `Como você aplicaria este conhecimento na prática?`,
      `Quais são os pontos mais importantes deste aprendizado?`
    ];
    
    // Generate 1-3 questions based on content length
    const numQuestions = content.length > 100 ? 3 : content.length > 50 ? 2 : 1;
    return questionTemplates.slice(0, numQuestions);
  };

  const startReview = () => {
    if (!currentReview) return;
    
    const generatedQuestions = generateQuestions(currentReview.content);
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
      completeCurrentReview(updatedAnswers);
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

  const completeCurrentReview = (finalAnswers: string[]) => {
    onComplete(currentReview.id, questions, finalAnswers);
    
    toast({
      title: "Revisão concluída!",
      description: `Aprendizado #${currentReview.id} revisado com sucesso.`
    });

    // Move to next review or close
    if (currentIndex < reviews.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetReviewState();
    } else {
      toast({
        title: "Parabéns! 🎉",
        description: "Todas as revisões do dia foram concluídas!"
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

  if (!isOpen) return null;

  if (reviews.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Tudo em dia!
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Você não tem revisões pendentes hoje.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Continue aprendendo e volte amanhã para suas próximas revisões!
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6" />
              Revisão {currentIndex + 1} de {reviews.length}
            </div>
            <Badge variant="outline">
              #{currentReview?.id}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {!showQuestions ? (
          // Review content display
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {new Date(currentReview.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Step {currentReview.step + 1}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Conteúdo para revisar:
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                    {currentReview.content}
                  </p>
                </div>

                {currentReview.context && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      <strong>Contexto:</strong> {currentReview.context}
                    </p>
                  </div>
                )}

                {currentReview.tags.length > 0 && (
                  <div className="flex items-center gap-2 pt-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    {currentReview.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            <div className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Leia o conteúdo acima e prepare-se para responder algumas perguntas.
              </p>
              
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={skipReview}>
                  Pular
                </Button>
                <Button 
                  onClick={startReview}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white"
                >
                  Iniciar Revisão
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Questions display
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Pergunta {questionIndex + 1} de {questions.length}
              </h3>
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-0">
              <p className="text-lg text-gray-800 dark:text-gray-200">
                {questions[questionIndex]}
              </p>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="answer">Sua resposta:</Label>
              <Textarea
                id="answer"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Digite sua resposta aqui..."
                className="min-h-[120px]"
              />
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevQuestion}
                disabled={questionIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              
              <Button 
                onClick={nextQuestion}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white"
              >
                {questionIndex === questions.length - 1 ? 'Concluir' : 'Próxima'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
