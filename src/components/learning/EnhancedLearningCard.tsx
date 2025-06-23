
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
    'linear-gradient(135deg, #a855f7 0%, #4f46e5 100%)', // purple to indigo
    'linear-gradient(135deg, #ec4899 0%, #e11d48 100%)', // pink to rose
    'linear-gradient(135deg, #10b981 0%, #059669 100%)', // emerald to green
    'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)', // amber to orange
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

  // Classes base do card com melhorias
  const cardClasses = desktopLayout 
    ? `relative rounded-2xl p-6 group min-h-[180px] flex flex-col transition-all duration-300 ease-in-out hover:scale-[1.02] shadow-sm hover:shadow-md cursor-pointer ${isEditing ? 'ring-2 ring-white/50' : ''} ${isDropdownOpen || isHovered ? 'scale-[1.02] shadow-md' : ''}`
    : `relative rounded-2xl p-4 mb-4 group min-h-[120px] transition-all duration-300 ease-in-out shadow-sm hover:shadow-md ${isEditing ? 'min-h-[200px]' : ''}`;

  if (desktopLayout) {
    return (
      <>
        <div 
          className={cardClasses}
          style={{ 
            background: cardGradient,
            transition: 'all 0.3s ease-in-out'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Ações Desktop - Mais sutis */}
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
                  className="w-8 h-8 p-0 bg-white/10 hover:bg-green-500/20 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="w-8 h-8 p-0 bg-white/10 hover:bg-red-500/20 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
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
                      className="w-8 h-8 p-0 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
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
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div className="bg-white/90 backdrop-blur rounded-xl px-4 py-2 flex items-center gap-3 transition-all duration-300">
              <span className="text-xs text-gray-500 font-medium tracking-wider">
                #{formatId(entry.numeroId)}
              </span>
              <span className="text-base font-bold text-gray-900">
                {formatDate(entry.createdAt)}
              </span>
            </div>
          </div>

          {/* Conteúdo Principal - Organização melhorada */}
          <div className="relative z-10 text-white flex-1 flex flex-col justify-center">
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
                  <h3 className="text-lg font-semibold mb-2 leading-tight transition-all duration-300">
                    {entry.title}
                  </h3>
                )}
                <p className="text-white text-sm opacity-90 leading-relaxed line-clamp-2 transition-all duration-300">
                  {entry.content}
                </p>
              </>
            )}
            
            {/* Tags - Pills pequenas com bg-white/20 */}
            {!compact && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {(isEditing ? editedTags : entry.tags).slice(0, 3).map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium transition-all duration-200 hover:bg-white/30"
                  >
                    {tag}
                  </span>
                ))}
                {entry.tags.length > 3 && !isEditing && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                    +{entry.tags.length - 3}
                  </span>
                )}
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

  // Layout mobile com melhorias visuais
  return (
    <>
      <div 
        className={cardClasses}
        style={{ 
          background: cardGradient,
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {/* Conteúdo */}
        <div className="relative z-10 flex items-start gap-4 transition-all duration-300">
          {/* ID e Data - Badge melhorado */}
          <div className="bg-white/90 backdrop-blur rounded-xl p-3 flex flex-col items-center justify-center min-w-[4rem] flex-shrink-0 transition-all duration-300">
            <span className="text-xs text-gray-500 font-medium tracking-wider">
              #{formatId(entry.numeroId)}
            </span>
            <span className="text-sm font-bold text-gray-900">
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
                <p className="text-white text-sm opacity-90 leading-relaxed line-clamp-2 transition-all duration-300">
                  {entry.content}
                </p>
              </>
            )}
            
            {/* Tags mobile - Pills pequenas */}
            {!compact && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {(isEditing ? editedTags : entry.tags).slice(0, 2).map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
                {entry.tags.length > 2 && !isEditing && (
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                    +{entry.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Ações Mobile - Mais sutis */}
          <div className="flex gap-2 transition-all duration-300 ease-in-out">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-9 h-9 p-0 bg-white/10 hover:bg-green-500/20 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="w-9 h-9 p-0 bg-white/10 hover:bg-red-500/20 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-9 h-9 p-0 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
                  onClick={() => {/* Implementar compartilhamento futuramente */}}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                
                <DropdownMenu onOpenChange={setIsDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-9 h-9 p-0 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
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
