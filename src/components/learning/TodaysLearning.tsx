
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar, Tag } from 'lucide-react';
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

interface TodaysLearningProps {
  entries: LearningEntry[];
  onDelete: (entryId: string) => void;
}

const TodaysLearning = ({ entries, onDelete }: TodaysLearningProps) => {
  const formatId = (numeroId: number) => {
    return String(numeroId).padStart(4, '0');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-light text-gray-700 dark:text-gray-300 mb-2">
          Nenhum aprendizado hoje
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Que tal registrar algo novo que você aprendeu?
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Aprendizados de hoje
      </h2>
      
      {entries.map((entry) => (
        <Card key={entry.id} className="p-6 border border-gray-100 dark: bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-mono text-gray-400 dark:text-gray-500">
                #{formatId(entry.numeroId)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatTime(entry.createdAt)}
              </span>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Mover para lixeira?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Este aprendizado será movido para a lixeira, mas você poderá restaurá-lo a qualquer momento.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(entry.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Mover para lixeira
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          {entry.title && (
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {entry.title}
            </h3>
          )}
          
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {entry.content}
          </p>
          
          {entry.context && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 italic">
              {entry.context}
            </p>
          )}
          
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
        </Card>
      ))}
    </div>
  );
};

export default TodaysLearning;
