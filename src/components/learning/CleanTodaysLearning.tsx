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
  reviews: Array<{
    date: string;
  }>;
}
interface CleanTodaysLearningProps {
  entries: LearningEntry[];
  onDelete: (entryId: string) => void;
}
const CleanTodaysLearning = ({
  entries,
  onDelete
}: CleanTodaysLearningProps) => {
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
  if (entries.length === 0) {
    return <div className="text-center py-16 px-4">
        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-6 h-6 text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-lg font-light text-gray-600 dark:text-gray-400 mb-2">
          Nenhum aprendizado hoje
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Registre algo novo que você aprendeu
        </p>
      </div>;
  }
  return <div className="space-y-3">
      {entries.map(entry => <Card key={entry.id} className="p-5 border-0 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900/80 transition-all duration-200 group">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
              <span className="font-mono">#{formatId(entry.numeroId)}</span>
              <span>•</span>
              <span>{formatDate(entry.createdAt)}</span>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0">
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
                  <AlertDialogAction onClick={() => onDelete(entry.id)} className="bg-red-500 hover:bg-red-600">
                    Mover para lixeira
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          {entry.title && <h3 className="font-medium text-gray-900 dark:text-white mb-3 leading-relaxed">
              {entry.title}
            </h3>}
          
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-[15px]">
            {entry.content}
          </p>
          
          {entry.context && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 italic border-l-2 border-gray-200 dark:border-gray-700 pl-3">
              {entry.context}
            </p>}
          
          {entry.tags.length > 0 && <div className="flex items-center flex-wrap gap-2">
              <Tag className="w-3 h-3 text-gray-400" />
              {entry.tags.map((tag, index) => <Badge key={index} variant="outline" className="text-xs border-gray-200 dark:border-gray-600 text-slate-50 dark:text-gray-400 bg-gray-700 rounded-md">
                  {tag}
                </Badge>)}
            </div>}
        </Card>)}
    </div>;
};
export default CleanTodaysLearning;