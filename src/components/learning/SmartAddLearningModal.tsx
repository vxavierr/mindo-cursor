import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAI } from '@/hooks/useAI';

interface SmartAddLearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entry: { title: string; content: string; tags: string[] }) => void;
}

const SmartAddLearningModal = ({ isOpen, onClose, onAdd }: SmartAddLearningModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const { improveText, generateTitleAndTags, transcribeAudio, isProcessing } = useAI();

  const handleAIEnhance = async () => {
    const improved = await improveText(content);
    setContent(improved);
    const { title: aiTitle, tags: aiTags } = await generateTitleAndTags(improved);
    setTitle(aiTitle);
    setTags(aiTags);
  };

  const handleAdd = () => {
    onAdd({ title, content, tags });
    setTitle('');
    setContent('');
    setTags([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Aprendizado com IA</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <Input
          placeholder="Conteúdo"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <Input
          placeholder="Tags (separadas por vírgula)"
          value={tags.join(', ')}
          onChange={e => setTags(e.target.value.split(',').map(t => t.trim()))}
        />
        <Button onClick={handleAIEnhance} disabled={isProcessing}>
          Melhorar com IA
        </Button>
        <Button onClick={handleAdd} disabled={isProcessing}>
          Adicionar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SmartAddLearningModal; 