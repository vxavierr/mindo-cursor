
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateTags } from '@/utils/learningStatus';

interface EditableTagsProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  isEditing: boolean;
  maxTags?: number;
}

const EditableTags = ({ tags, onTagsChange, isEditing, maxTags = 3 }: EditableTagsProps) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagValue, setNewTagValue] = useState('');
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
  const [editingTagValue, setEditingTagValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRemoveTag = (indexToRemove: number) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    onTagsChange(newTags);
    setError(null);
  };

  const handleAddTag = () => {
    if (!newTagValue.trim()) {
      setIsAddingTag(false);
      return;
    }

    if (tags.includes(newTagValue.trim())) {
      setError('Tag já existe');
      return;
    }

    const newTags = [...tags, newTagValue.trim()];
    const validation = validateTags(newTags);
    
    if (!validation.isValid) {
      setError(validation.error || 'Erro na validação');
      return;
    }

    onTagsChange(newTags);
    setNewTagValue('');
    setIsAddingTag(false);
    setError(null);
  };

  const handleEditTag = (index: number) => {
    setEditingTagIndex(index);
    setEditingTagValue(tags[index]);
    setError(null);
  };

  const handleSaveTagEdit = () => {
    if (editingTagValue.trim() && editingTagIndex !== null) {
      const newTags = [...tags];
      newTags[editingTagIndex] = editingTagValue.trim();
      onTagsChange(newTags);
    }
    setEditingTagIndex(null);
    setEditingTagValue('');
    setError(null);
  };

  const handleCancelTagEdit = () => {
    setEditingTagIndex(null);
    setEditingTagValue('');
    setError(null);
  };

  const canAddMoreTags = tags.length < maxTags;

  if (!isEditing) {
    // Modo normal - mostrar até 3 tags + contador se houver mais
    const visibleTags = tags.slice(0, maxTags);
    const remainingCount = Math.max(0, tags.length - maxTags);

    return (
      <div className="flex flex-wrap gap-2">
        {visibleTags.map((tag, index) => (
          <span 
            key={index}
            className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/30 border border-white/10 drop-shadow-sm whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/10 text-white/60">
            +{remainingCount}
          </span>
        )}
      </div>
    );
  }

  // Modo de edição - tags editáveis
  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      {/* Contador de tags */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-white/80 font-medium">
          Tags ({tags.length}/{maxTags})
        </span>
        {!canAddMoreTags && (
          <span className="text-xs text-yellow-400">
            Máximo de {maxTags} tags atingido
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div key={index} className="relative">
            {editingTagIndex === index ? (
              <div className="flex items-center gap-1">
                <Input
                  value={editingTagValue}
                  onChange={(e) => setEditingTagValue(e.target.value)}
                  className="h-9 w-24 text-sm bg-white/95 text-gray-900 border-0"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTagEdit();
                    if (e.key === 'Escape') handleCancelTagEdit();
                  }}
                  onBlur={handleSaveTagEdit}
                  autoFocus
                />
              </div>
            ) : (
              <div 
                className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 cursor-pointer text-gray-900 text-sm font-medium group hover:bg-white transition-all duration-200 shadow-sm"
                onClick={() => handleRemoveTag(index)}
                onDoubleClick={() => handleEditTag(index)}
                title="Clique para remover, duplo clique para editar"
              >
                <span className="whitespace-nowrap">{tag}</span>
                <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-red-500" />
              </div>
            )}
          </div>
        ))}
        
        {isAddingTag ? (
          <div className="flex items-center gap-1">
            <Input
              value={newTagValue}
              onChange={(e) => setNewTagValue(e.target.value)}
              placeholder="Nova tag"
              className="h-9 w-28 text-sm bg-white/95 text-gray-900 border-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTag();
                if (e.key === 'Escape') {
                  setIsAddingTag(false);
                  setError(null);
                }
              }}
              onBlur={handleAddTag}
              autoFocus
            />
          </div>
        ) : (
          canAddMoreTags && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingTag(true)}
              className="h-9 w-9 p-0 bg-white/95 hover:bg-white text-gray-900 rounded-xl transition-all duration-200 shadow-sm"
              title={`Adicionar tag (${tags.length}/${maxTags})`}
            >
              <Plus className="w-4 h-4" />
            </Button>
          )
        )}
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="mt-2 text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}
    </div>
  );
};

export default EditableTags;
