
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Sparkles, Loader2, Send } from 'lucide-react';
import { useAI } from '@/hooks/useAI';

interface CleanAddLearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (content: string, title: string, tags: string[]) => void;
}

const CleanAddLearningModal = ({ isOpen, onClose, onAdd }: CleanAddLearningModalProps) => {
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const { improveText, generateTitleAndTags, transcribeAudio, isProcessing } = useAI();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const transcribedText = await transcribeAudio(audioBlob);
        if (transcribedText) {
          setContent(transcribedText);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleImproveText = async () => {
    if (!content.trim()) return;
    
    const improvedText = await improveText(content);
    setContent(improvedText);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    // Gerar título e tags automaticamente
    const { title, tags } = await generateTitleAndTags(content);
    
    onAdd(content.trim(), title, tags);
    setContent('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-light text-gray-900 dark:text-white">
            O que você aprendeu?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Descreva o que você aprendeu hoje..."
              className="min-h-[120px] text-[15px] leading-relaxed border-gray-200 dark:border-gray-700 focus:border-gray-300 dark:focus:border-gray-600 resize-none"
              disabled={isProcessing}
            />
            
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              {content.trim() && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleImproveText}
                  disabled={isProcessing}
                  className="h-8 px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span className="ml-1 text-xs">IA</span>
                </Button>
              )}
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`h-8 px-3 ${
                  isRecording 
                    ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
                <span className="ml-1 text-xs">
                  {isRecording ? 'Parar' : 'Gravar'}
                </span>
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Título e tags serão gerados automaticamente
            </p>
            
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isProcessing}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Cancelar
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || isProcessing}
                className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Salvar
              </Button>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            ⌘ + Enter para salvar rapidamente
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CleanAddLearningModal;
