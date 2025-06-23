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

  // Gradientes melhorados com melhor contraste
  const gradients = [
    'linear-gradient(135deg, #1e293b 0%, #334155 100%)', // Slate escuro
    'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', // Roxo vibrante
    'linear-gradient(135deg, #059669 0%, #10b981 100%)', // Verde esmeralda
    'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)', // Vermelho coral
    'linear-gradient(135deg, #ea580c 0%, #f97316 100%)'  // Laranja vibrante
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

  // Controla se mostra os botões
  const showActions = isEditing || isDropdownOpen || isHovered;

  // Classes base do card com melhor estrutura
  const cardClasses = desktopLayout 
    ? `relative rounded-2xl p-6 group min-h-[200px] max-h-[400px] flex flex-col transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl cursor-pointer ${isEditing ? 'ring-2 ring-white/50' : ''} ${isDropdownOpen || isHovered ? 'scale-[1.02] shadow-xl' : ''}`
    : `relative rounded-2xl p-5 mb-4 group min-h-[140px] transition-all duration-300 ease-in-out ${isEditing ? 'min-h-[220px]' : ''}`;

  if (desktopLayout) {
    return (
      <>
        <div 
          className={cardClasses}
          style={{ 
            background: cardGradient,
            boxShadow: isDropdownOpen || isHovered ? '0 20px 40px rgba(0, 0, 0, 0.2)' : '0 8px 25px rgba(0, 0, 0, 0.15)',
            height: isEditing ? 'auto' : undefined,
            transition: 'all 0.3s ease-in-out'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Ações Desktop */}
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
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-9 h-9 p-0 bg-white/90 hover:bg-green-500 text-gray-800 hover:text-white rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="w-9 h-9 p-0 bg-white/90 hover:bg-red-500 text-gray-800 hover:text-white rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-9 h-9 p-0 bg-white/90 hover:bg-white text-gray-800 rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm"
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
                      className="w-9 h-9 p-0 bg-white/90 hover:bg-white text-gray-800 rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm"
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

          {/* Header do Card - Badge melhorado */}
          <div className="relative z-10 flex justify-between items-start mb-6">
            <div className="bg-white/95 backdrop-blur-md rounded-xl px-4 py-2.5 flex items-center gap-3 transition-all duration-300 shadow-lg">
              <span className="text-xs text-gray-600 font-semibold tracking-wider uppercase">
                #{formatId(entry.numeroId)}
              </span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span className="text-sm font-bold text-gray-900">
                {formatDate(entry.createdAt)}
              </span>
            </div>
          </div>

          {/* Conteúdo Principal - Melhor hierarquia */}
          <div className="relative z-10 text-white flex-1 flex flex-col justify-center">
            {isEditing ? (
              <div className="space-y-4">
                <div className="border border-white/30 rounded-xl p-3 bg-white/10 backdrop-blur-sm">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="Título do aprendizado"
                    className="bg-white/95 text-gray-900 border-0 text-lg font-semibold placeholder:text-gray-500"
                  />
                </div>
                <div className="border border-white/30 rounded-xl p-3 bg-white/10 backdrop-blur-sm">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    placeholder="Conteúdo do aprendizado"
                    className="bg-white/95 text-gray-900 border-0 min-h-[100px] resize-none placeholder:text-gray-500"
                  />
                </div>
              </div>
            ) : (
              <>
                {entry.title && (
                  <h3 className="text-xl font-bold mb-4 leading-tight text-white drop-shadow-sm">
                    {entry.title}
                  </h3>
                )}
                <p className="text-white/95 leading-relaxed text-base line-clamp-3 font-medium drop-shadow-sm">
                  {entry.content}
                </p>
              </>
            )}
            
            {/* Tags com melhor design */}
            {!compact && (
              <div className="mt-6">
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

  // Layout mobile com melhor legibilidade
  return (
    <>
      <div 
        className={cardClasses}
        style={{ 
          background: cardGradient,
          height: isEditing ? 'auto' : undefined,
          transition: 'all 0.3s ease-in-out',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Conteúdo */}
        <div className="relative z-10 flex items-start gap-4 transition-all duration-300">
          {/* ID e Data - Badge melhorado */}
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 flex flex-col items-center justify-center min-w-[4.5rem] flex-shrink-0 transition-all duration-300 shadow-lg">
            <span className="text-xs text-gray-600 font-semibold tracking-wider">
              #{formatId(entry.numeroId)}
            </span>
            <span className="text-sm font-bold text-gray-900 mt-1">
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
                    className="bg-white/95 text-gray-900 border-0 text-base font-semibold placeholder:text-gray-500"
                  />
                </div>
                <div className="border border-white/30 rounded-lg p-2 bg-white/10 backdrop-blur-sm">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    placeholder="Conteúdo do aprendizado"
                    className="bg-white/95 text-gray-900 border-0 min-h-[80px] resize-none placeholder:text-gray-500"
                  />
                </div>
              </div>
            ) : (
              <>
                {entry.title && (
                  <h3 className="text-lg font-bold mb-3 leading-tight text-white drop-shadow-sm">
                    {entry.title}
                  </h3>
                )}
                <p className={`
                  text-white/95 leading-relaxed font-medium drop-shadow-sm
                  ${compact ? 'text-sm line-clamp-1' : 'text-base line-clamp-2'}
                `}>
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

          {/* Ações Mobile */}
          <div className="flex gap-2 transition-all duration-300 ease-in-out">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-10 h-10 p-0 bg-white/90 hover:bg-green-500 text-gray-800 hover:text-white rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="w-10 h-10 p-0 bg-white/90 hover:bg-red-500 text-gray-800 hover:text-white rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 bg-white/90 hover:bg-white text-gray-800 rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm"
                  onClick={() => {}}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                
                <DropdownMenu onOpenChange={setIsDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-10 h-10 p-0 bg-white/90 hover:bg-white text-gray-800 rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm"
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

      {/* AlertDialog para Mobile */}
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
