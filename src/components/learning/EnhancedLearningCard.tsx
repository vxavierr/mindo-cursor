import React, { useState } from 'react';
import { Share2, MoreVertical, Edit, Trash2, Check, X, ArrowDown } from 'lucide-react';
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
  mobileLayout?: boolean;
}

const EnhancedLearningCard = ({ 
  entry, 
  onDelete, 
  onUpdate,
  gradient,
  compact = false,
  desktopLayout = false,
  mobileLayout = false
}: EnhancedLearningCardProps) => {
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(entry.title);
  const [editedContent, setEditedContent] = useState(entry.content);
  const [editedTags, setEditedTags] = useState([...entry.tags]);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Gradientes mais suaves e legíveis
  const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', // indigo para purple
    'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', // pink para rose
    'linear-gradient(135deg, #10b981 0%, #059669 100%)', // emerald
    'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)', // amber para orange
    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'  // blue
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

  const handleCardClick = (e: React.MouseEvent) => {
    if (isEditing || isDropdownOpen) return;
    
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="menuitem"]')) return;
    
    setIsExpanded(!isExpanded);
  };

  const getTruncatedContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const showActions = isEditing || isDropdownOpen || isHovered;

  // Layout especifico para mobile - compacto como na imagem
  if (mobileLayout) {
    return (
      <>
        <div 
          className="relative rounded-2xl overflow-hidden transition-all duration-300 ease-in-out cursor-pointer"
          style={{ 
            background: cardGradient,
            minHeight: isEditing ? '200px' : '120px'
          }}
          onClick={handleCardClick}
        >
          <div className="p-4 h-full">
            <div className="flex items-start justify-between h-full">
              {/* Left side - ID and Date */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-3 flex flex-col items-center justify-center min-w-[3.5rem] flex-shrink-0 shadow-sm">
                <span className="text-xs text-gray-500 font-medium tracking-wider uppercase">
                  #{formatId(entry.numeroId)}
                </span>
                <span className="text-sm font-bold text-gray-900 mt-1">
                  {formatDate(entry.createdAt)}
                </span>
              </div>

              {/* Center - Content */}
              <div className="flex-1 px-4 flex flex-col justify-center text-white">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      placeholder="Título do aprendizado"
                      className="bg-white/95 text-gray-900 border-0 text-sm font-semibold placeholder:text-gray-500 h-8"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      placeholder="Descreva seu aprendizado..."
                      className="bg-white/95 text-gray-900 border-0 resize-none placeholder:text-gray-500 text-sm min-h-[60px]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ) : (
                  <>
                    {entry.title && (
                      <h3 className="text-base font-semibold mb-2 leading-tight text-white drop-shadow-sm line-clamp-1">
                        {entry.title}
                      </h3>
                    )}
                    
                    <p className="text-white/90 leading-relaxed text-sm line-clamp-2">
                      {isExpanded ? entry.content : getTruncatedContent(entry.content, 80)}
                    </p>
                    
                    {!isExpanded && entry.content.length > 80 && (
                      <div className="flex items-center gap-1 mt-2 text-white/70">
                        <span className="text-xs">Ver mais</span>
                        <ArrowDown className="w-3 h-3" />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Right side - Actions */}
              <div className="flex flex-col gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave();
                      }}
                      disabled={isSaving}
                      className="w-8 h-8 p-0 bg-white/20 hover:bg-green-500/80 text-white rounded-full backdrop-blur-sm border border-white/20"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel();
                      }}
                      className="w-8 h-8 p-0 bg-white/20 hover:bg-red-500/80 text-white rounded-full backdrop-blur-sm border border-white/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm border border-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                    
                    <DropdownMenu onOpenChange={setIsDropdownOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm border border-white/20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className="z-[60] bg-white border border-gray-200 shadow-xl animate-in fade-in-0 zoom-in-95 duration-200 min-w-[160px]"
                        sideOffset={8}
                      >
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit();
                          }} 
                          className="cursor-pointer hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteDialog(true);
                          }} 
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

            {/* Tags - only show when expanded and not compact */}
            {!compact && isExpanded && (
              <div className="mt-4 pt-3 border-t border-white/20" onClick={(e) => e.stopPropagation()}>
                <EditableTags 
                  tags={isEditing ? editedTags : entry.tags}
                  onTagsChange={setEditedTags}
                  isEditing={isEditing}
                />
              </div>
            )}
          </div>
        </div>

        {/* AlertDialog */}
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

  // Layout para desktop com novo design
  if (desktopLayout) {
    return (
      <>
        <div 
          className="relative rounded-3xl p-6 group transition-all duration-300 ease-in-out cursor-pointer hover:scale-[1.02] hover:shadow-xl min-h-[300px] flex flex-col"
          style={{ 
            background: cardGradient,
            boxShadow: isExpanded 
              ? '0 20px 40px rgba(0, 0, 0, 0.25)' 
              : isDropdownOpen || isHovered 
                ? '0 12px 32px rgba(0, 0, 0, 0.15)' 
                : '0 8px 24px rgba(0, 0, 0, 0.10)'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleCardClick}
        >
          {/* Header com ID e Data */}
          <div className="flex justify-between items-start mb-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
              <span className="text-xs text-gray-500 font-medium tracking-wider uppercase">
                #{formatId(entry.numeroId)}
              </span>
              <span className="text-base font-bold text-gray-900">
                {formatDate(entry.createdAt)}
              </span>
            </div>

            {/* Actions */}
            <div className={`flex gap-2 transition-all duration-300 ease-in-out ${
              showActions
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-2'
            }`}>
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave();
                    }}
                    disabled={isSaving}
                    className="w-9 h-9 p-0 bg-white/20 hover:bg-green-500/80 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancel();
                    }}
                    className="w-9 h-9 p-0 bg-white/20 hover:bg-red-500/80 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-9 h-9 p-0 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  
                  <DropdownMenu onOpenChange={setIsDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-9 h-9 p-0 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
                        onClick={(e) => e.stopPropagation()}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit();
                        }} 
                        className="cursor-pointer hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteDialog(true);
                        }} 
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

          {/* Conteúdo Principal */}
          <div className="flex-1 flex flex-col text-white">
            {isEditing ? (
              <div className="space-y-4 flex-1">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="Título do aprendizado"
                    className="bg-white/95 text-gray-900 border-0 text-lg font-semibold placeholder:text-gray-500 h-12"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex-1">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    placeholder="Descreva seu aprendizado..."
                    className="bg-white/95 text-gray-900 border-0 resize-none placeholder:text-gray-500 text-base leading-relaxed h-full min-h-[120px]"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            ) : (
              <>
                {/* Título */}
                {entry.title && (
                  <h3 className="text-xl font-semibold mb-4 leading-tight text-white drop-shadow-sm break-words">
                    {entry.title}
                  </h3>
                )}
                
                {/* Conteúdo */}
                <div className="flex-1 mb-4">
                  <p className="text-white/95 leading-relaxed text-base break-words whitespace-pre-wrap">
                    {isExpanded ? entry.content : getTruncatedContent(entry.content, 120)}
                  </p>
                  
                  {/* Indicador de mais conteúdo */}
                  {!isExpanded && entry.content.length > 120 && (
                    <div className="mt-2">
                      <span className="text-white/70 text-sm italic">Clique para ver mais...</span>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {/* Tags */}
            {!compact && (
              <div className="mt-auto pt-4" onClick={(e) => e.stopPropagation()}>
                <EditableTags 
                  tags={isEditing ? editedTags : entry.tags}
                  onTagsChange={setEditedTags}
                  isEditing={isEditing}
                />
              </div>
            )}
          </div>
        </div>

        {/* AlertDialog */}
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

  // Layout mobile antigo (fallback)
  return null;
};

export default EnhancedLearningCard;
