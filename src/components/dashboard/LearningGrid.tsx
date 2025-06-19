
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

interface LearningEntry {
  id: string;
  content: string;
  context?: string;
  tags: string[];
  createdAt: string;
  step: number;
  reviews?: Array<{ date: string }>;
}

interface LearningGridProps {
  entries: LearningEntry[];
}

const LearningGrid = ({ entries }: LearningGridProps) => {
  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [entries]);

  const getStepColor = (step: number) => {
    const colors = [
      'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
      'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
      'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
      'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400'
    ];
    return colors[Math.min(step, colors.length - 1)];
  };

  const getStepLabel = (step: number) => {
    const labels = ['Novo', '1 dia', '3 dias', '1 semana', '2 semanas', '1 mês', '2 meses'];
    return labels[Math.min(step, labels.length - 1)];
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <TrendingUp className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-light text-gray-700 dark:text-gray-300 mb-2">
          Nenhum aprendizado registrado
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Comece registrando seu primeiro aprendizado
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-light text-gray-900 dark:text-white">
        Seus Aprendizados
      </h2>
      
      <div className="space-y-4">
        {sortedEntries.map((entry) => (
          <Card key={entry.id} className="p-6 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-mono text-gray-400 dark:text-gray-500">
                  #{entry.id}
                </span>
                <Badge className={`${getStepColor(entry.step)} border-0`}>
                  {getStepLabel(entry.step)}
                </Badge>
              </div>
              
              <div className="flex items-center text-sm text-gray-400 dark:text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(entry.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-900 dark:text-white text-lg leading-relaxed font-light">
                {entry.content}
              </p>
              {entry.context && (
                <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm">
                  {entry.context}
                </p>
              )}
            </div>
            
            {entry.tags.length > 0 && (
              <div className="flex items-center flex-wrap gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                {entry.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {entry.reviews && entry.reviews.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {entry.reviews.length} revisão{entry.reviews.length > 1 ? 'ões' : ''} completada{entry.reviews.length > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LearningGrid;
