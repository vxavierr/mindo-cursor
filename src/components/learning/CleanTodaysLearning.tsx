
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Clock, Tag } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface LearningEntry {
  id: string;
  numeroId: number;
  title: string;
  content: string;
  context?: string;
  tags: string[];
  createdAt: string;
  step: number;
  reviews: Array<{ date: string }>;
}

interface CleanTodaysLearningProps {
  entries: LearningEntry[];
  reviewsToday: LearningEntry[];
  onCompleteReview: (entryId: string, difficulty: 'easy' | 'medium' | 'hard', questions: string[], answers: string[]) => Promise<void>;
  loading: boolean;
}

const CleanTodaysLearning = ({ entries, reviewsToday, onCompleteReview, loading }: CleanTodaysLearningProps) => {
  const formatId = (numeroId: number) => {
    return String(numeroId).padStart(4, '0');
  };

  // Mostrar apenas dia/mês
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-6 h-6 text-gray-300 dark:text-gray-600 animate-spin" />
        </div>
        <h3 className="text-lg font-light text-gray-600 dark:text-gray-400 mb-2">
          Carregando...
        </h3>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-6 h-6 text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-lg font-light text-gray-600 dark:text-gray-400 mb-2">
          Nenhum aprendizado hoje
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Registre algo novo que você aprendeu
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Seção de Revisões Pendentes */}
      {reviewsToday.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            📚 Para revisar hoje ({reviewsToday.length})
          </h3>
          {reviewsToday.map((entry) => (
            <Card key={entry.id} className="p-5 border-l-4 border-l-orange-400 bg-orange-50/50 hover:bg-orange-50 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="font-mono">#{formatId(entry.numeroId)}</span>
                  <span>•</span>
                  <span>{formatDate(entry.createdAt)}</span>
                  <span>•</span>
                  <span className="text-orange-600">Step {entry.step}</span>
                </div>
                
                <Button
                  onClick={() => onCompleteReview(entry.id, 'medium', [], [])}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2"
                >
                  Revisar
                </Button>
              </div>
              
              {entry.title && (
                <h4 className="font-medium text-gray-900 mb-2 leading-relaxed">
                  {entry.title}
                </h4>
              )}
              
              <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                {entry.content}
              </p>
              
              {entry.tags.length > 0 && (
                <div className="flex items-center flex-wrap gap-2">
                  <Tag className="w-3 h-3 text-gray-400" />
                  {entry.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-orange-200 text-orange-600 bg-transparent">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Seção de Todos os Aprendizados */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          🧠 Todos os aprendizados ({entries.length})
        </h3>
        {entries.map((entry) => (
          <Card key={entry.id} className="p-5 border-0 bg-gray-50/50 hover:bg-gray-50 transition-all duration-200 group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span className="font-mono">#{formatId(entry.numeroId)}</span>
                <span>•</span>
                <span>{formatDate(entry.createdAt)}</span>
                <span>•</span>
                <span>Step {entry.step}</span>
              </div>
            </div>
            
            {entry.title && (
              <h4 className="font-medium text-gray-900 mb-3 leading-relaxed">
                {entry.title}
              </h4>
            )}
            
            <p className="text-gray-700 leading-relaxed mb-4 text-[15px]">
              {entry.content}
            </p>
            
            {entry.context && (
              <p className="text-sm text-gray-500 mb-4 italic border-l-2 border-gray-200 pl-3">
                {entry.context}
              </p>
            )}
            
            {entry.tags.length > 0 && (
              <div className="flex items-center flex-wrap gap-2">
                <Tag className="w-3 h-3 text-gray-400" />
                {entry.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-gray-200 text-gray-500 bg-transparent">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CleanTodaysLearning;
