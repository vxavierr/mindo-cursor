
import React from 'react';
import { Trash2, MoreVertical, Share2, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { LearningEntry } from '@/hooks/useCleanLearning';

interface EnhancedLearningCardProps {
  entry: LearningEntry;
  onDelete: (id: string) => void;
  gradient?: string;
  compact?: boolean;
}

const EnhancedLearningCard = ({ 
  entry, 
  onDelete, 
  gradient,
  compact = false 
}: EnhancedLearningCardProps) => {
  
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
    'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  ];

  const cardGradient = gradient || gradients[entry.numeroId % gradients.length];

  const formatId = (numeroId: number) => {
    return String(numeroId).padStart(4, '0');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit'
    });
  };

  return (
    <div 
      className="relative rounded-3xl p-6 mb-4 overflow-hidden group hover:scale-[1.02] transition-all duration-300"
      style={{ 
        background: cardGradient,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
      }}
    >
      {/* Overlay para melhor legibilidade */}
      <div className="absolute inset-0 bg-black/10" />
      
      {/* Conteúdo */}
      <div className="relative z-10 flex items-center gap-4">
        {/* ID e Data */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center justify-center min-w-[4rem] flex-shrink-0">
          <span className="text-xs text-gray-500 font-medium tracking-wider">
            #{formatId(entry.numeroId)}
          </span>
          <span className="text-base font-bold text-gray-900">
            {formatDate(entry.createdAt)}
          </span>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 text-white">
          {entry.title && (
            <h3 className="text-lg font-semibold mb-2 leading-tight">
              {entry.title}
            </h3>
          )}
          <p className={`
            text-white/90 leading-relaxed text-sm
            ${compact ? 'line-clamp-1' : 'line-clamp-2'}
          `}>
            {entry.content}
          </p>
          
          {/* Tags */}
          {entry.tags && entry.tags.length > 0 && !compact && (
            <div className="flex flex-wrap gap-2 mt-3">
              {entry.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
              {entry.tags.length > 3 && (
                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                  +{entry.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 p-0 bg-white/20 hover:bg-white/30 text-white rounded-full"
            onClick={() => {/* Implementar compartilhamento */}}
          >
            <Share2 className="w-4 h-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 bg-white/20 hover:bg-red-500/80 text-white rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4" />
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
      </div>
    </div>
  );
};

export default EnhancedLearningCard;
