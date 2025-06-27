
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag, Clock, ArrowRight } from 'lucide-react';
import RichTextViewer from '@/components/ui/RichTextViewer';
import { LearningEntry } from './types/review';

interface ReviewCardProps {
  review: LearningEntry;
  currentIndex: number;
  totalReviews: number;
  onStartReview: () => void;
  onSkipReview: () => void;
}

const ReviewCard = ({ review, currentIndex, totalReviews, onStartReview, onSkipReview }: ReviewCardProps) => {
  const formatId = (numeroId: number) => {
    return String(numeroId).padStart(4, '0');
  };

  const getDaysFromCreation = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="w-full bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-gray-700/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="space-y-4">
          {/* Meta Info */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>
                {new Date(review.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit'
                })}
                • {getDaysFromCreation(review.createdAt)} dias atrás
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
              <Badge className="bg-yellow-500/20 border-yellow-400 text-yellow-300 text-xs">
                Step {review.step + 1}
              </Badge>
            </div>
          </div>
          
          {/* Título */}
          {review.title && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2 break-words leading-tight">
                {review.title}
              </h3>
            </div>
          )}
          
          {/* Conteúdo Principal */}
          <div>
            <h4 className="text-xs sm:text-sm font-medium text-gray-200 mb-3">
              Conteúdo para revisar:
            </h4>
            <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/30">
              <div className="text-sm sm:text-base text-gray-100 leading-relaxed break-words">
                <RichTextViewer content={review.content} />
              </div>
            </div>
          </div>

          {/* Contexto */}
          {review.context && (
            <div className="pt-3 border-t border-gray-700/50">
              <div className="text-gray-300 text-xs sm:text-sm break-words leading-relaxed">
                <strong className="text-gray-200">Contexto:</strong>{' '}
                <RichTextViewer content={review.context} />
              </div>
            </div>
          )}

          {/* Tags */}
          {review.tags.length > 0 && (
            <div className="flex items-start gap-2 pt-2 flex-wrap">
              <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mt-0.5" />
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {review.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-gray-700/50 border-gray-600 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Instruções e Botões */}
      <div className="text-center space-y-4">
        <p className="text-gray-300 text-sm sm:text-base px-2">
          Leia o conteúdo acima e prepare-se para responder três perguntas baseadas em técnicas de aprendizagem comprovadas.
        </p>
        
        <div className="flex justify-center gap-3 flex-wrap px-2">
          <Button 
            variant="outline" 
            onClick={onSkipReview}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 text-sm px-4"
          >
            Pular Esta
          </Button>
          <Button 
            onClick={onStartReview}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white px-4 sm:px-6 text-sm"
          >
            Iniciar Revisão
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
