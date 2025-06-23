
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EditableTagsProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  isEditing: boolean;
}

const EditableTags = ({ tags, onTagsChange, isEditing }: EditableTagsProps) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagValue, setNewTagValue] = useState('');
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
  const [editingTagValue, setEditingTagValue] = useState('');

  const handleRemoveTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleAddTag = () => {
    if (newTagValue.trim() && !tags.includes(newTagValue.trim())) {
      onTagsChange([...tags, newTagValue.trim()]);
    }
    setNewTagValue('');
    setIsAddingTag(false);
  };

  const handleEditTag = (index: number) => {
    setEditingTagIndex(index);
    setEditingTagValue(tags[index]);
  };

  const handleSaveTagEdit = () => {
    if (editingTagValue.trim() && editingTagIndex !== null) {
      const newTags = [...tags];
      newTags[editingTagIndex] = editingTagValue.trim();
      onTagsChange(newTags);
    }
    setEditingTagIndex(null);
    setEditingTagValue('');
  };

  const handleCancelTagEdit = () => {
    setEditingTagIndex(null);
    setEditingTagValue('');
  };

  if (!isEditing) {
    // Modo normal - mostrar todas as tags sem cortes
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span 
            key={index}
            className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/30 border border-white/10 drop-shadow-sm whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  }

  // Modo de edição - tags editáveis
  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
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
                if (e.key === 'Escape') setIsAddingTag(false);
              }}
              onBlur={handleAddTag}
              autoFocus
            />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingTag(true)}
            className="h-9 w-9 p-0 bg-white/95 hover:bg-white text-gray-900 rounded-xl transition-all duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditableTags;
