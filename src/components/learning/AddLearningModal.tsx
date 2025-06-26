import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, X, Plus, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/ui/RichTextEditor';

interface AddLearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (content: string, context?: string, tags?: string[]) => void;
  existingTags: string[];
}

const AddLearningModal = ({ isOpen, onClose, onAdd, existingTags }: AddLearningModalProps) => {
  const [content, setContent] = useState('');
  const [context, setContext] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Conteúdo obrigatório",
        description: "Por favor, adicione o conteúdo do aprendizado.",
        variant: "destructive"
      });
      return;
    }

    onAdd(content.trim(), context.trim() || undefined, tags.length > 0 ? tags : undefined);
    
    // Reset form
    setContent('');
    setContext('');
    setTags([]);
    setTagInput('');
    
    toast({
      title: "Aprendizado registrado!",
      description: "Seu novo aprendizado foi salvo com sucesso."
    });
    
    onClose();
  };

  const addTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addExistingTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addTag();
    }
  };

  const simulateAIProcessing = () => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Auto-suggest tags based on content
      const suggestedTags = [];
      const contentLower = content.toLowerCase();
      
      if (contentLower.includes('javascript') || contentLower.includes('js')) suggestedTags.push('javascript');
      if (contentLower.includes('react')) suggestedTags.push('react');
      if (contentLower.includes('python')) suggestedTags.push('python');
      if (contentLower.includes('design')) suggestedTags.push('design');
      if (contentLower.includes('algorithm')) suggestedTags.push('algoritmos');
      
      // Add suggested tags that aren't already selected
      const newTags = suggestedTags.filter(tag => !tags.includes(tag));
      if (newTags.length > 0) {
        setTags([...tags, ...newTags]);
        toast({
          title: "IA sugeriu tags",
          description: `Adicionamos: ${newTags.join(', ')}`
        });
      }
      
      setIsProcessing(false);
    }, 1500);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording (mock implementation)
      setIsRecording(true);
      toast({
        title: "Gravação iniciada",
        description: "Fale seu aprendizado..."
      });
      
      // Mock recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setContent(content + (content ? ' ' : '') + 'Exemplo de transcrição: Aprendi sobre React hooks e como eles simplificam o gerenciamento de estado em componentes funcionais.');
        toast({
          title: "Transcrição concluída",
          description: "Sua fala foi convertida em texto!"
        });
      }, 3000);
    } else {
      setIsRecording(false);
      toast({
        title: "Gravação interrompida",
        description: "Gravação cancelada."
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Plus className="w-6 h-6" />
            Novo Aprendizado
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content" className="text-base font-medium">
              O que você aprendeu? *
            </Label>
            <div className="relative">
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Aprendi que... / Hoje descobri que... / Entendi como..."
                className="min-h-[120px]"
                disabled={isProcessing}
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={toggleRecording}
                  className={`${isRecording ? 'bg-red-500 text-white' : ''}`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={simulateAIProcessing}
                  disabled={!content.trim() || isProcessing}
                >
                  <Sparkles className="w-4 h-4" />
                  {isProcessing ? 'Processando...' : 'IA'}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="context" className="text-base font-medium">
              Contexto (opcional)
            </Label>
            <RichTextEditor
              content={context}
              onChange={setContext}
              placeholder="Onde aprendeu, fonte, situação..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Tags</Label>
            
            {/* Selected tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Tag input */}
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite uma tag..."
                className="flex-1"
              />
              <Button type="button" size="sm" onClick={addTag} disabled={!tagInput.trim()}>
                Adicionar
              </Button>
            </div>
            
            {/* Existing tags suggestions */}
            {existingTags.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Tags existentes:</p>
                <div className="flex flex-wrap gap-2">
                  {existingTags
                    .filter(tag => !tags.includes(tag))
                    .slice(0, 10)
                    .map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900"
                        onClick={() => addExistingTag(tag)}
                      >
                        + {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white">
              Salvar Aprendizado
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLearningModal;
