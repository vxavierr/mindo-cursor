
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
    // Modo normal - tags com estilo original
    return (
      <div className="flex flex-wrap gap-2">
        {tags.slice(0, 3).map((tag, index) => (
          <span 
            key={index}
            className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium transition-all duration-200 hover:bg-white/30"
          >
            {tag}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
            +{tags.length - 3}
          </span>
        )}
      </div>
    );
  }

  // Modo de edição - tags editáveis com estilo similar ao bloco ID/data
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {tags.map((tag, index) => (
        <div key={index} className="relative">
          {editingTagIndex === index ? (
            <div className="flex items-center gap-1">
              <Input
                value={editingTagValue}
                onChange={(e) => setEditingTagValue(e.target.value)}
                className="h-8 w-20 text-xs bg-white/95 text-gray-900 border-0"
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
              className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 cursor-pointer text-gray-900 text-xs font-medium group hover:bg-white transition-all duration-200"
              onClick={() => handleRemoveTag(index)}
              onDoubleClick={() => handleEditTag(index)}
            >
              <span>{tag}</span>
              <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
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
            className="h-8 w-24 text-xs bg-white/95 text-gray-900 border-0"
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
          className="h-8 w-8 p-0 bg-white/95 hover:bg-white text-gray-900 rounded-xl transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default EditableTags;
