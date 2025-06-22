
import React from 'react';
import { Trash2, MoreVertical, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { LearningEntry } from '@/hooks/useCleanLearning';

interface EnhancedLearningCardProps {
  entry: LearningEntry;
  onDelete: (id: string) => void;
  gradient?: string;
  compact?: boolean;
  desktopLayout?: boolean;
}

const EnhancedLearningCard = ({ 
  entry, 
  onDelete, 
  gradient,
  compact = false,
  desktopLayout = false
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

  if (desktopLayout) {
    return (
      <div 
        className="relative rounded-3xl p-6 overflow-hidden group hover:scale-[1.02] transition-all duration-300 min-h-[200px] flex flex-col"
        style={{ 
          background: cardGradient,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
        }}
      >
        {/* Overlay para melhor legibilidade */}
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Ações Desktop - Posição absoluta no topo direito */}
        <div className="absolute top-6 right-6 z-10 flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 bg-white/20 hover:bg-white/30 text-white rounded-full"
            onClick={() => {/* Implementar compartilhamento */}}
          >
            <Share2 className="w-4 h-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 bg-white/20 hover:bg-red-500/80 text-white rounded-full transition-colors"
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

        {/* Header do Card */}
        <div className="relative z-10 flex justify-between items-start mb-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-3">
            <span className="text-xs text-gray-500 font-medium tracking-wider">
              #{formatId(entry.numeroId)}
            </span>
            <span className="text-base font-bold text-gray-900">
              {formatDate(entry.createdAt)}
            </span>
          </div>
        </div>

        {/* Conteúdo Principal - Flex crescer para ocupar espaço */}
        <div className="relative z-10 text-white flex-1 flex flex-col justify-center min-h-[100px]">
          {entry.title && (
            <h3 className="text-xl font-semibold mb-3 leading-tight">
              {entry.title}
            </h3>
          )}
          <p className="text-white/90 leading-relaxed text-[15px] line-clamp-3">
            {entry.content}
          </p>
          
          {/* Tags */}
          {entry.tags && entry.tags.length > 0 && !compact && (
            <div className="flex flex-wrap gap-2 mt-4">
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
      </div>
    );
  }

  // Layout mobile original
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

        {/* Ações Mobile */}
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
