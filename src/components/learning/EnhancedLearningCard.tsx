
import React, { useState } from 'react';
import { Share2, MoreVertical, Edit, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { LearningEntry } from '@/hooks/useCleanLearning';
import EditableTags from '@/components/ui/EditableTags';

interface EnhancedLearningCardProps {
  entry: LearningEntry;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, updates: { title?: string; content?: string; tags?: string[]; context?: string }) => Promise<boolean>;
  gradient?: string;
  compact?: boolean;
  desktopLayout?: boolean;
}

const EnhancedLearningCard = ({ 
  entry, 
  onDelete, 
  onUpdate,
  gradient,
  compact = false,
  desktopLayout = false
}: EnhancedLearningCardProps) => {
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(entry.title);
  const [editedContent, setEditedContent] = useState(entry.content);
  const [editedTags, setEditedTags] = useState([...entry.tags]);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTitle(entry.title);
    setEditedContent(entry.content);
    setEditedTags([...entry.tags]);
  };

  const handleSave = async () => {
    if (!onUpdate) return;
    
    setIsSaving(true);
    const success = await onUpdate(entry.id, {
      title: editedTitle,
      content: editedContent,
      tags: editedTags
    });
    
    if (success) {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(entry.title);
    setEditedContent(entry.content);
    setEditedTags([...entry.tags]);
  };

  // Tamanhos padrão responsivos padronizados
  const cardClasses = desktopLayout 
    ? "relative rounded-3xl p-6 overflow-hidden group min-h-[280px] max-h-[450px] flex flex-col transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
    : "relative rounded-3xl p-6 mb-4 overflow-hidden group min-h-[180px] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl";

  const ActionButtons = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out ${isMobile ? 'flex-col' : 'flex-row'}`}>
      {isEditing ? (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} p-0 bg-white/20 hover:bg-green-500/80 text-white rounded-full transition-all duration-200 backdrop-blur-sm`}
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} p-0 bg-white/20 hover:bg-red-500/80 text-white rounded-full transition-all duration-200 backdrop-blur-sm`}
          >
            <X className="w-4 h-4" />
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            size="sm"
            className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} p-0 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all duration-200 backdrop-blur-sm`}
            onClick={() => {/* Implementar compartilhamento */}}
          >
            <Share2 className="w-4 h-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} p-0 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all duration-200 backdrop-blur-sm`}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg backdrop-blur-sm">
              <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Mover para lixeira
                  </DropdownMenuItem>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );

  if (desktopLayout) {
    return (
      <div 
        className={cardClasses}
        style={{ 
          background: cardGradient,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          height: isEditing ? 'auto' : undefined,
          minHeight: isEditing ? '350px' : '280px'
        }}
      >
        {/* Overlay para melhor legibilidade */}
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Ações Desktop - Posição absoluta no topo direito */}
        <div className="absolute top-6 right-6 z-10">
          <ActionButtons />
        </div>

        {/* Header do Card */}
        <div className="relative z-10 flex justify-between items-start mb-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-3 transition-all duration-300">
            <span className="text-xs text-gray-500 font-medium tracking-wider">
              #{formatId(entry.numeroId)}
            </span>
            <span className="text-base font-bold text-gray-900">
              {formatDate(entry.createdAt)}
            </span>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="relative z-10 text-white flex-1 flex flex-col justify-center min-h-[120px]">
          {isEditing ? (
            <div className="space-y-4">
              <div className="border border-white/30 rounded-lg p-3 bg-white/10 backdrop-blur-sm">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Título do aprendizado"
                  className="bg-white/90 text-gray-900 border-0 text-lg font-semibold placeholder:text-gray-500"
                />
              </div>
              <div className="border border-white/30 rounded-lg p-3 bg-white/10 backdrop-blur-sm">
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="Conteúdo do aprendizado"
                  className="bg-white/90 text-gray-900 border-0 min-h-[120px] resize-none placeholder:text-gray-500"
                />
              </div>
            </div>
          ) : (
            <>
              {entry.title && (
                <h3 className="text-xl font-semibold mb-3 leading-tight transition-all duration-300">
                  {entry.title}
                </h3>
              )}
              <p className="text-white/90 leading-relaxed text-[15px] line-clamp-4 transition-all duration-300">
                {entry.content}
              </p>
            </>
          )}
          
          {/* Tags */}
          {!compact && (
            <div className="mt-4">
              <EditableTags 
                tags={isEditing ? editedTags : entry.tags}
                onTagsChange={setEditedTags}
                isEditing={isEditing}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Layout mobile
  return (
    <div 
      className={cardClasses}
      style={{ 
        background: cardGradient,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        height: isEditing ? 'auto' : undefined,
        minHeight: isEditing ? '250px' : '180px'
      }}
    >
      {/* Overlay para melhor legibilidade */}
      <div className="absolute inset-0 bg-black/10" />
      
      {/* Conteúdo */}
      <div className="relative z-10 flex items-start gap-4 h-full">
        {/* ID e Data */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center justify-center min-w-[4rem] flex-shrink-0 transition-all duration-300">
          <span className="text-xs text-gray-500 font-medium tracking-wider">
            #{formatId(entry.numeroId)}
          </span>
          <span className="text-base font-bold text-gray-900">
            {formatDate(entry.createdAt)}
          </span>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 text-white transition-all duration-300 min-h-[120px] flex flex-col justify-center">
          {isEditing ? (
            <div className="space-y-3">
              <div className="border border-white/30 rounded-lg p-2 bg-white/10 backdrop-blur-sm">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Título do aprendizado"
                  className="bg-white/90 text-gray-900 border-0 text-base font-semibold placeholder:text-gray-500"
                />
              </div>
              <div className="border border-white/30 rounded-lg p-2 bg-white/10 backdrop-blur-sm">
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="Conteúdo do aprendizado"
                  className="bg-white/90 text-gray-900 border-0 min-h-[80px] resize-none placeholder:text-gray-500"
                />
              </div>
            </div>
          ) : (
            <>
              {entry.title && (
                <h3 className="text-lg font-semibold mb-2 leading-tight transition-all duration-300">
                  {entry.title}
                </h3>
              )}
              <p className={`
                text-white/90 leading-relaxed text-sm transition-all duration-300
                ${compact ? 'line-clamp-1' : 'line-clamp-3'}
              `}>
                {entry.content}
              </p>
            </>
          )}
          
          {/* Tags */}
          {!compact && (
            <div className="mt-3">
              <EditableTags 
                tags={isEditing ? editedTags : entry.tags}
                onTagsChange={setEditedTags}
                isEditing={isEditing}
              />
            </div>
          )}
        </div>

        {/* Ações Mobile */}
        <div className="flex-shrink-0">
          <ActionButtons isMobile={true} />
        </div>
      </div>
    </div>
  );
};

export default EnhancedLearningCard;
