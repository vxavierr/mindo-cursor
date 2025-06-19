
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
      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
    ];
    return colors[Math.min(step, colors.length - 1)];
  };

  const getStepLabel = (step: number) => {
    const labels = ['Novo', '1 dia', '3 dias', '1 semana', '2 semanas', '1 mês', '2 meses'];
    return labels[Math.min(step, labels.length - 1)];
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Nenhum aprendizado registrado
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Clique em "Novo" para começar sua jornada de aprendizado
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Seus Aprendizados
      </h2>
      
      <div className="grid gap-4">
        {sortedEntries.map((entry) => (
          <Card key={entry.id} className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                  #{entry.id}
                </span>
                <Badge className={getStepColor(entry.step)}>
                  {getStepLabel(entry.step)}
                </Badge>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(entry.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-900 dark:text-white text-lg leading-relaxed">
                {entry.content}
              </p>
              {entry.context && (
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                  {entry.context}
                </p>
              )}
            </div>
            
            {entry.tags.length > 0 && (
              <div className="flex items-center flex-wrap gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                {entry.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {entry.reviews && entry.reviews.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
