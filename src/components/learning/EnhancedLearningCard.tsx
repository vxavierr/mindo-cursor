
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
  
  // Estado para controle individual de expansão - padrão é recolhido (false)
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
    // Prevenir expansão se estiver clicando em botões ou dropdown
    if (isEditing || isDropdownOpen) return;
    
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="menuitem"]')) return;
    
    // Alternar estado de expansão do card
    setIsExpanded(!isExpanded);
  };

  // Função para truncar conteúdo quando recolhido
  const getTruncatedContent = (content: string, maxLength: number = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const showActions = isEditing || isDropdownOpen || isHovered;

  // Classes dinâmicas baseadas no estado de expansão
  const cardClasses = desktopLayout 
    ? `relative rounded-2xl p-6 group transition-all duration-500 ease-in-out cursor-pointer hover:scale-[1.02] hover:shadow-xl ${
        isExpanded ? 'z-10 scale-105 shadow-2xl' : ''
      } ${isEditing ? 'ring-2 ring-white/50' : ''} ${isDropdownOpen || isHovered ? 'scale-[1.02] shadow-xl' : ''}`
    : `relative rounded-2xl p-5 mb-4 group transition-all duration-500 ease-in-out cursor-pointer ${
        isExpanded ? 'z-10 scale-105 shadow-2xl mb-8' : ''
      } ${isEditing ? 'min-h-[280px]' : isExpanded ? 'min-h-[200px]' : 'min-h-[140px]'}`;

  if (desktopLayout) {
    return (
      <>
        <div 
          className={cardClasses}
          style={{ 
            background: cardGradient,
            boxShadow: isExpanded 
              ? '0 20px 40px rgba(0, 0, 0, 0.25)' 
              : isDropdownOpen || isHovered 
                ? '0 12px 32px rgba(0, 0, 0, 0.15)' 
                : '0 8px 24px rgba(0, 0, 0, 0.10)',
            transition: 'all 0.5s ease-in-out',
            transform: isExpanded ? 'translateY(-8px) scale(1.02)' : undefined
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleCardClick}
        >
          {/* Actions Desktop */}
          <div className={`absolute top-4 right-4 z-20 flex gap-2 transition-all duration-300 ease-in-out ${
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

          {/* Header com Badge */}
          <div className="relative z-10 flex justify-between items-start mb-5">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center gap-3 transition-all duration-300 shadow-sm">
              <span className="text-xs text-gray-500 font-medium tracking-wider uppercase">
                #{formatId(entry.numeroId)}
              </span>
              <span className="text-base font-bold text-gray-900">
                {formatDate(entry.createdAt)}
              </span>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="relative z-10 text-white flex-1 flex flex-col min-h-0">
            {isEditing ? (
              <div className="space-y-4">
                {/* Campo de Título */}
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="Título do aprendizado"
                    className="bg-white/95 text-gray-900 border-0 text-lg font-semibold placeholder:text-gray-500 h-12 text-base"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                {/* Campo de Conteúdo */}
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    placeholder="Descreva seu aprendizado..."
                    className="bg-white/95 text-gray-900 border-0 resize-none placeholder:text-gray-500 text-base leading-relaxed"
                    style={{ 
                      minHeight: '120px',
                      height: 'auto'
                    }}
                    rows={Math.max(4, Math.ceil(editedContent.length / 50))}
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
                
                {/* Conteúdo - truncado quando recolhido, completo quando expandido */}
                <div className="flex-1 mb-4">
                  <p className="text-white/95 leading-relaxed text-base break-words whitespace-pre-wrap">
                    {isExpanded ? entry.content : getTruncatedContent(entry.content, 80)}
                  </p>
                </div>
              </>
            )}
            
            {/* Tags - sempre visíveis */}
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

  // Layout mobile com clique para expandir/recolher
  return (
    <>
      <div 
        className={cardClasses}
        style={{ 
          background: cardGradient,
          height: 'auto',
          transition: 'all 0.5s ease-in-out',
          transform: isExpanded ? 'translateY(-4px) scale(1.02)' : undefined,
          boxShadow: isExpanded 
            ? '0 16px 32px rgba(0, 0, 0, 0.2)' 
            : '0 8px 24px rgba(0, 0, 0, 0.1)'
        }}
        onClick={handleCardClick}
      >
        <div className="relative z-10 transition-all duration-300">
          {/* Header Mobile */}
          <div className="flex items-start gap-4 mb-4">
            {/* Badge ID/Data */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2.5 flex flex-col items-center justify-center min-w-[4rem] flex-shrink-0 shadow-sm">
              <span className="text-xs text-gray-500 font-medium tracking-wider uppercase">
                #{formatId(entry.numeroId)}
              </span>
              <span className="text-sm font-bold text-gray-900">
                {formatDate(entry.createdAt)}
              </span>
            </div>

            {/* Actions Mobile */}
            <div className="flex gap-2 ml-auto">
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
                    className="w-10 h-10 p-0 bg-white/20 hover:bg-green-500/80 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
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
                    className="w-10 h-10 p-0 bg-white/20 hover:bg-red-500/80 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
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
                        className="w-10 h-10 p-0 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
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

          {/* Conteúdo Mobile */}
          <div className="text-white">
            {isEditing ? (
              <div className="space-y-4">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="Título do aprendizado"
                    className="bg-white/95 text-gray-900 border-0 text-base font-semibold placeholder:text-gray-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    placeholder="Descreva seu aprendizado..."
                    className="bg-white/95 text-gray-900 border-0 resize-none placeholder:text-gray-500 text-base"
                    style={{ 
                      minHeight: '100px',
                      height: 'auto'
                    }}
                    rows={Math.max(3, Math.ceil(editedContent.length / 40))}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            ) : (
              <>
                {entry.title && (
                  <h3 className="text-lg font-semibold mb-3 leading-tight text-white drop-shadow-sm break-words">
                    {entry.title}
                  </h3>
                )}
                
                {/* Conteúdo com controle de expansão individual */}
                <p className="text-white/95 leading-relaxed text-base break-words whitespace-pre-wrap mb-4">
                  {isExpanded ? entry.content : getTruncatedContent(entry.content, 80)}
                </p>
              </>
            )}
            
            {/* Tags Mobile - sempre visíveis */}
            {!compact && (
              <div onClick={(e) => e.stopPropagation()}>
                <EditableTags 
                  tags={isEditing ? editedTags : entry.tags}
                  onTagsChange={setEditedTags}
                  isEditing={isEditing}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AlertDialog Mobile */}
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
