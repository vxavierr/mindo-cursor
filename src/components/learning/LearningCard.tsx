import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Clock, MoreVertical, Edit2, Check, X, Trash2, ChevronDown, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import EditableTags from '@/components/ui/EditableTags';
import { getLearningStatus, getRelativeDate, formatBrazilianDate, calculateProgress, getStatusDot, LearningEntry } from '@/utils/learningStatus';
import { motion, AnimatePresence } from 'framer-motion';

interface LearningCardProps {
  entry: LearningEntry;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, data: Partial<LearningEntry>) => Promise<boolean>;
  variant?: 'clean' | 'default' | 'enhanced';
  compact?: boolean;
  desktopLayout?: boolean;
  index?: number;
}

const LearningCard: React.FC<LearningCardProps> = ({ 
  entry, 
  onDelete, 
  onUpdate, 
  variant = 'enhanced',
  compact = false,
  desktopLayout = false,
  index = 0
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActionOverlay, setShowActionOverlay] = useState(false);
  const [rightClickPosition, setRightClickPosition] = useState({ x: 0, y: 0 });
  const [newTag, setNewTag] = useState('');
  const [editData, setEditData] = useState({
    title: entry.title,
    content: entry.content,
    tags: [...entry.tags]
  });

  // Close action overlay when clicking elsewhere
  useEffect(() => {
    const handleClick = () => {
      setShowActionOverlay(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Obter status do aprendizado
  const status = getLearningStatus(entry.step, entry.lastReviewDate, entry.lastDifficulty);
  
  // Obter data relativa
  const relativeDate = getRelativeDate(new Date(entry.createdAt));
  
  // Obter progresso fixo baseado no step
  const progressValue = calculateProgress(entry.step);

  // Handlers para as ações
  const handleDelete = () => {
    onDelete && onDelete(entry.id);
    setShowConfirm(false);
  };

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditData({
      title: entry.title,
      content: entry.content,
      tags: [...entry.tags]
    });
  };

  const handleSaveEdit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdate) {
      const success = await onUpdate(entry.id, editData);
      if (success) {
        setIsEditing(false);
      }
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditData({
      title: entry.title,
      content: entry.content,
      tags: [...entry.tags]
    });
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  // Card interaction functions
  const toggleCardExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCardClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!isEditing && !showActionOverlay) {
      toggleCardExpansion();
    }
  };

  const handleCardRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setRightClickPosition({ x: event.clientX, y: event.clientY });
    setShowActionOverlay(true);
  };

  const startEditingFromOverlay = () => {
    setIsEditing(true);
    setEditData({
      title: entry.title,
      content: entry.content,
      tags: [...entry.tags]
    });
    setShowActionOverlay(false);
  };

  const deleteFromOverlay = () => {
    setShowConfirm(true);
    setShowActionOverlay(false);
  };

  const addTag = () => {
    if (newTag.trim() && !editData.tags.includes(newTag.trim()) && editData.tags.length < 5) {
      setEditData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  // Garante que as tags sempre sejam um array
  const tags = Array.isArray(entry.tags)
    ? entry.tags
    : (typeof entry.tags === 'string' && entry.tags)
      ? (entry.tags as string).split(',').map(t => t.trim()).filter(Boolean)
      : [];

  // Seleciona até 3 tags para mostrar
  const visibleTags = tags.slice(0, 3);
  const remainingTagsCount = Math.max(0, tags.length - 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
      className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 cursor-pointer group relative overflow-hidden select-none"
      style={{ alignSelf: 'start' }}
      onClick={handleCardClick}
      onContextMenu={handleCardRightClick}
    >
      <div className={`p-6 transition-all duration-300 ${showActionOverlay ? 'opacity-30' : 'opacity-100'}`}>
        {/* Header with tags and expand indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {/* Tags (máximo 3) */}
            {visibleTags.map((tag, tagIndex) => (
              <span 
                key={tagIndex}
                className="px-2 py-1 rounded-lg bg-white/10 text-white/80 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {remainingTagsCount > 0 && (
              <span className="px-2 py-1 rounded-lg bg-white/5 text-white/60 text-xs font-medium border border-white/10">
                +{remainingTagsCount}
              </span>
            )}
            
            {/* Bolinha de Status */}
            <div 
              className={`w-2 h-2 rounded-full ${getStatusDot(status)}`}
              title={`Status: ${status}`}
            />
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ChevronDown className="w-3 h-3 text-white/60" />
          </motion.div>
        </div>
        
        {/* Título */}
        {isEditing ? (
          <div onClick={(e) => e.stopPropagation()}>
            <Input
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              className="text-xl font-semibold mb-3 bg-white/10 text-white border-white/20 focus:border-white/40"
              placeholder="Título do aprendizado"
            />
          </div>
        ) : (
          <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-white/90">
            {entry.title || 'Sem título'}
          </h3>
        )}
        
        {/* Data e Data Relativa */}
        <div className="flex items-center space-x-4 text-sm text-white/60 mb-4">
          <span>{formatBrazilianDate(new Date(entry.createdAt))}</span>
          <span>•</span>
          <span className={`flex items-center space-x-1 ${
            status === 'pending' ? 'text-orange-400' : 'text-white/60'
          }`}>
            <Clock className="w-3 h-3" />
            <span>{relativeDate}</span>
          </span>
        </div>
        
        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-4"
            >
              <div className="text-white/80 text-sm leading-relaxed p-4 bg-white/5 rounded-xl">
                {entry.content || 'Sem conteúdo disponível'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Barra de Progresso - sempre mostrada */}
        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressValue}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
          />
        </div>
        
        {/* Conteúdo e Tags Editáveis - Apenas quando editando */}
        {isEditing && (
          <div className="mt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <Textarea
              value={editData.content}
              onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
              className="text-white bg-white/10 border-white/20 focus:border-white/40 min-h-[120px]"
              placeholder="Conteúdo do aprendizado"
            />
            
            {/* Tags Editing */}
            <div>
              <label className="block text-white font-medium mb-3 text-sm">Tags</label>
              
              {/* Current Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {editData.tags.map((tag, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-full border border-white/20"
                  >
                    <span className="text-white/80 text-sm font-medium">{tag}</span>
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-white/60 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Add Tag */}
              <div className="flex space-x-3">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/10"
                  placeholder="Adicionar tag..."
                  maxLength={20}
                />
                <Button
                  onClick={addTag}
                  disabled={!newTag.trim() || editData.tags.length >= 5}
                  className="px-4 py-3 bg-purple-500/20 border border-purple-500/30 text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500/30"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              
              <p className="text-white/60 text-sm mt-3">
                {editData.tags.length}/5 tags • Pressione Enter ou clique + para adicionar
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Editing Action Buttons - positioned at bottom when editing */}
      {isEditing && (
        <div className="px-6 pb-6 flex items-center space-x-4" onClick={(e) => e.stopPropagation()}>
          <Button
            onClick={handleCancelEdit}
            className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 h-12 text-white/70 hover:text-white transition-colors"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveEdit}
            disabled={!editData.title.trim() || !editData.content.trim()}
            className={`flex-1 relative group h-12 font-semibold ${
              editData.title.trim() && editData.content.trim()
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </div>
          </Button>
        </div>
      )}

      {/* Action Overlay */}
      <AnimatePresence>
        {showActionOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex space-x-6">
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={startEditingFromOverlay}
                className="w-24 h-24 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex flex-col items-center justify-center space-y-2 backdrop-blur-sm hover:bg-blue-500/30 transition-colors"
              >
                <Edit2 className="w-8 h-8 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">Editar</span>
              </motion.button>

              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={deleteFromOverlay}
                className="w-24 h-24 rounded-2xl bg-red-500/20 border border-red-500/30 flex flex-col items-center justify-center space-y-2 backdrop-blur-sm hover:bg-red-500/30 transition-colors"
              >
                <Trash2 className="w-8 h-8 text-red-400" />
                <span className="text-red-400 text-sm font-medium">Excluir</span>
              </motion.button>
            </div>

            {/* Close overlay button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActionOverlay(false);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog de confirmação */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="bg-black/90 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Enviar para lixeira?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Este aprendizado será movido para a lixeira. Você poderá restaurá-lo a qualquer momento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white" 
              onClick={handleDelete}
            >
              Enviar para lixeira
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default LearningCard; 