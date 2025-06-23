
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const handleDelete = () => {
    onDelete(entry.id);
    setShowDeleteDialog(false);
  };

  // Controla se mostra os botões (sempre visível quando editando, dropdown aberto ou hovering)
  const showActions = isEditing || isDropdownOpen || isHovered;

  // Classes base do card com melhorias - mantém scale quando dropdown está aberto ou hovering
  const cardClasses = desktopLayout 
    ? `relative rounded-3xl p-6 group min-h-[240px] max-h-[400px] flex flex-col transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl cursor-pointer ${isEditing ? 'ring-2 ring-white/50' : ''} ${isDropdownOpen || isHovered ? 'scale-[1.02] shadow-2xl' : ''}`
    : `relative rounded-3xl p-6 mb-4 group min-h-[120px] transition-all duration-300 ease-in-out ${isEditing ? 'min-h-[200px]' : ''}`;

  if (desktopLayout) {
    return (
      <>
        <div 
          className={cardClasses}
          style={{ 
            background: cardGradient,
            boxShadow: isDropdownOpen || isHovered ? '0 12px 32px rgba(0, 0, 0, 0.15)' : '0 8px 32px rgba(0, 0, 0, 0.12)',
            height: isEditing ? 'auto' : undefined,
            transition: 'all 0.3s ease-in-out'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Overlay para melhor legibilidade */}
          <div className="absolute inset-0 bg-black/10 rounded-3xl" />
          
          {/* Ações Desktop - Controle de visibilidade melhorado */}
          <div className={`absolute top-6 right-6 z-20 flex gap-2 transition-all duration-300 ease-in-out ${
            showActions
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-2'
          }`}>
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-8 h-8 p-0 bg-white/20 hover:bg-green-500/80 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="w-8 h-8 p-0 bg-white/20 hover:bg-red-500/80 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    /* Implementar compartilhamento futuramente */
                  }}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                
                <DropdownMenu onOpenChange={setIsDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="z-[60] bg-white border border-gray-200 shadow-xl animate-in fade-in-0 zoom-in-95 duration-200 min-w-[160px]"
                    sideOffset={8}
                  >
                    <DropdownMenuItem 
                      onClick={handleEdit} 
                      className="cursor-pointer hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setShowDeleteDialog(true)} 
                      className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Mover para lixeira
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
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
          <div className="relative z-10 text-white flex-1 flex flex-col justify-center min-h-[100px]">
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
                    className="bg-white/90 text-gray-900 border-0 min-h-[100px] resize-none placeholder:text-gray-500"
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
                <p className="text-white/90 leading-relaxed text-[15px] line-clamp-3 transition-all duration-300">
                  {entry.content}
                </p>
              </>
            )}
            
            {/* Tags */}
            {!compact && (
              <EditableTags 
                tags={isEditing ? editedTags : entry.tags}
                onTagsChange={setEditedTags}
                isEditing={isEditing}
              />
            )}
          </div>
        </div>

        {/* AlertDialog separado para Desktop */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="z-[70]">
            <AlertDialogHeader>
              <AlertDialogTitle>Mover para lixeira?</AlertDialogTitle>
              <AlertDialogDescription>
                Este aprendizado será movido para a lixeira. Você poderá restaurá-lo a qualquer momento através das configurações.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Mover para lixeira
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Layout mobile sem sombras
  return (
    <>
      <div 
        className={cardClasses}
        style={{ 
          background: cardGradient,
          height: isEditing ? 'auto' : undefined,
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {/* Overlay para melhor legibilidade */}
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Conteúdo */}
        <div className="relative z-10 flex items-start gap-4 transition-all duration-300">
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
          <div className="flex-1 text-white transition-all duration-300">
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
                  ${compact ? 'line-clamp-1' : 'line-clamp-2'}
                `}>
                  {entry.content}
                </p>
              </>
            )}
            
            {/* Tags */}
            {!compact && (
              <EditableTags 
                tags={isEditing ? editedTags : entry.tags}
                onTagsChange={setEditedTags}
                isEditing={isEditing}
              />
            )}
          </div>

          {/* Ações Mobile - Sempre visíveis */}
          <div className="flex gap-2 transition-all duration-300 ease-in-out">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-10 h-10 p-0 bg-white/20 hover:bg-green-500/80 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="w-10 h-10 p-0 bg-white/20 hover:bg-red-500/80 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                  onClick={() => {/* Implementar compartilhamento futuramente */}}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                
                <DropdownMenu onOpenChange={setIsDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-10 h-10 p-0 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="z-[60] bg-white border border-gray-200 shadow-xl animate-in fade-in-0 zoom-in-95 duration-200 min-w-[160px]"
                    sideOffset={8}
                  >
                    <DropdownMenuItem 
                      onClick={handleEdit} 
                      className="cursor-pointer hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setShowDeleteDialog(true)} 
                      className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Mover para lixeira
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>

      {/* AlertDialog separado para Mobile */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="z-[70]">
          <AlertDialogHeader>
            <AlertDialogTitle>Mover para lixeira?</AlertDialogTitle>
            <AlertDialogDescription>
              Este aprendizado será movido para a lixeira. Você poderá restaurá-lo a qualquer momento através das configurações.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Mover para lixeira
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EnhancedLearningCard;
