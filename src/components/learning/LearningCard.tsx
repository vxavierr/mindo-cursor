import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Clock, MoreVertical, Edit2, Check, X, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import EditableTags from '@/components/ui/EditableTags';
import { getLearningStatus, getRelativeDate, formatBrazilianDate, calculateProgress, getStatusDot, LearningEntry } from '@/utils/learningStatus';
import { motion } from 'framer-motion';

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
  const [editData, setEditData] = useState({
    title: entry.title,
    content: entry.content,
    tags: [...entry.tags]
  });

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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 cursor-pointer group relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Header com Tags e Status */}
          <div className="flex items-center space-x-2 mb-2">
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
          
          {/* Título */}
          {isEditing ? (
            <div onClick={(e) => e.stopPropagation()}>
              <Input
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="text-lg font-semibold mb-2 bg-white/10 text-white border-white/20 focus:border-white/40"
                placeholder="Título do aprendizado"
              />
            </div>
          ) : (
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white/90">
              {entry.title || 'Sem título'}
            </h3>
          )}
          
          {/* Data e Data Relativa */}
          <div className="flex items-center space-x-4 text-sm text-white/60 mb-3">
            <span>{formatBrazilianDate(new Date(entry.createdAt))}</span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-orange-400">
              <Clock className="w-3 h-3" />
              <span>{relativeDate}</span>
            </span>
          </div>
          
          {/* Barra de Progresso Fixa */}
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progressValue}%` }}
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
              
              <EditableTags
                tags={editData.tags}
                onTagsChange={(newTags) => setEditData(prev => ({ ...prev, tags: newTags }))}
                isEditing={true}
                maxTags={3}
              />
            </div>
          )}
        </div>
        
        {/* Menu de Ações */}
        <div className="ml-4" onClick={(e) => e.stopPropagation()}>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={handleSaveEdit}
                className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600 text-white rounded-full"
                title="Salvar alterações"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleCancelEdit}
                className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-white rounded-full"
                title="Cancelar edição"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200 h-8 w-8 p-0 rounded-full flex items-center justify-center">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/80 border-white/10">
                <DropdownMenuItem 
                  onClick={handleStartEdit}
                  className="text-white hover:bg-white/10"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDeleteClick} 
                  className="text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Enviar para lixeira
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

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