import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Brain, ArrowRight, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Review {
  id: string;
  content: string;
  context?: string;
  createdAt: Date;
  step: number;
}

interface ReviewCardsProps {
  reviews: Review[];
  onCompleteReview: (id: string) => void;
}

const ReviewCards = ({ reviews, onCompleteReview }: ReviewCardsProps) => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16">
        <Card className="max-w-md mx-auto p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Nenhuma revisão pendente hoje!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Que ótimo! Você está em dia com seus estudos. Continue aprendendo coisas novas.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const currentReview = reviews[currentReviewIndex];
  const stepLabels = ['Novo', '1 dia', '3 dias', '1 semana', '2 semanas', '1 mês', '2 meses'];

  const handleComplete = () => {
    onCompleteReview(currentReview.id);
    if (currentReviewIndex < reviews.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
    } else {
      setCurrentReviewIndex(0);
    }
    setShowAnswer(false);
  };

  const handleNext = () => {
    if (currentReviewIndex < reviews.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
    } else {
      setCurrentReviewIndex(0);
    }
    setShowAnswer(false);
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Revisões de Hoje
        </h2>
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="secondary" className="text-base px-4 py-2">
            {currentReviewIndex + 1} de {reviews.length}
          </Badge>
          <Badge variant="outline" className="text-base px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            {stepLabels[currentReview.step]} atrás
          </Badge>
        </div>
      </div>

      {/* Review Card */}
      <Card className="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl">
        <div className="p-8">
          <div className="space-y-6">
            {/* Content */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <Brain className="w-5 h-5" />
                <span className="font-medium">Conteúdo para Revisão</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <p className="text-lg leading-relaxed text-gray-900 dark:text-white">
                  {currentReview.content}
                </p>
                {currentReview.context && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Contexto:</strong> {currentReview.context}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Self-Test Questions */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                💭 Perguntas para Auto-Teste:
              </h4>
              <div className="grid gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                  <p className="text-gray-800 dark:text-gray-200">
                    1. Você consegue explicar este conceito com suas próprias palavras?
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                  <p className="text-gray-800 dark:text-gray-200">
                    2. Em que situações você aplicaria este conhecimento?
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                  <p className="text-gray-800 dark:text-gray-200">
                    3. Como este aprendizado se conecta com outros conhecimentos que você tem?
                  </p>
                </div>
              </div>
            </div>

            {/* Answer Section */}
            {showAnswer && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">
                    ✅ Explicação Resumida:
                  </h4>
                  <p className="text-green-700 dark:text-green-300 leading-relaxed">
                    {currentReview.content} - Este é um conceito importante que vale a pena ser revisado regularmente para garantir que permaneça na sua memória de longo prazo.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {!showAnswer ? (
                <Button
                  onClick={() => setShowAnswer(true)}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Ver Explicação
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleComplete}
                    className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Concluir Revisão
                  </Button>
                  <Button
                    onClick={() => setShowAnswer(false)}
                    variant="outline"
                    className="h-12 bg-white/80 dark:bg-gray-800/80"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Tentar Novamente
                  </Button>
                </>
              )}
              
              {reviews.length > 1 && (
                <Button
                  onClick={handleNext}
                  variant="outline"
                  className="h-12 bg-white/80 dark:bg-gray-800/80"
                >
                  Próxima
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>

            {/* Meta Info */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>
                Criado em: {currentReview.createdAt.toLocaleDateString('pt-BR')}
              </span>
              <span>
                ID: {currentReview.id}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReviewCards;
