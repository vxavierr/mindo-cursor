
import React from 'react';
import { Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { LearningEntry } from '@/hooks/useCleanLearning';

interface CleanTodaysLearningProps {
  entries: LearningEntry[];
  onDelete: (id: string) => void;
}

const CleanTodaysLearning = ({ entries, onDelete }: CleanTodaysLearningProps) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
        </div>
        <p className="text-lg text-gray-600 font-medium mb-2">Nenhum aprendizado hoje</p>
        <p className="text-gray-500">Registre seu primeiro aprendizado do dia</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Aprendizados de hoje</h3>
      
      <div className="space-y-4">
        {entries.map((entry) => (
          <div 
            key={entry.id} 
            className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-gray-200 transition-all duration-200"
            style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' }}
          >
            {/* Header com ID e ações */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-mono font-medium text-gray-600">
                  {String(entry.numeroId).padStart(4, '0')}
                </span>
                <span className="text-sm text-gray-500 font-medium">
                  {new Date(entry.createdAt).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit'
                  })}
                </span>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Mover para lixeira?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Este aprendizado será movido para a lixeira. Você poderá restaurá-lo a qualquer momento através das configurações.
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

            {/* Título */}
            {entry.title && (
              <h4 className="text-lg font-semibold text-gray-900 mb-3 leading-relaxed">
                {entry.title}
              </h4>
            )}

            {/* Conteúdo */}
            <p className="text-gray-700 leading-relaxed mb-4 text-base">
              {entry.content}
            </p>

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CleanTodaysLearning;
