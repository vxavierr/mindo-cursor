
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { Mic, MicOff, Sparkles, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAI } from '@/hooks/useAI';

interface SmartAddLearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (content: string, title: string, tags: string[]) => void;
}

const SmartAddLearningModal = ({ isOpen, onClose, onAdd }: SmartAddLearningModalProps) => {
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const { improveText, generateTitleAndTags, transcribeAudio, isProcessing } = useAI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Conteúdo obrigatório",
        description: "Por favor, adicione o conteúdo do aprendizado.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate title and tags automatically
      const { title, tags } = await generateTitleAndTags(content.trim());
      
      onAdd(content.trim(), title, tags);
      
      // Reset form
      setContent('');
      
      toast({
        title: "Aprendizado registrado!",
        description: "Título e tags foram gerados automaticamente pela IA."
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    }
  };

  const handleImproveText = async () => {
    if (!content.trim()) {
      toast({
        title: "Nenhum texto para melhorar",
        description: "Digite o conteúdo primeiro",
        variant: "destructive"
      });
      return;
    }

    const improvedText = await improveText(content);
    setContent(improvedText);
    
    if (improvedText !== content) {
      toast({
        title: "Texto melhorado!",
        description: "O conteúdo foi aprimorado pela IA"
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const transcription = await transcribeAudio(audioBlob);
        
        if (transcription) {
          setContent(content + (content ? ' ' : '') + transcription);
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      
      toast({
        title: "Gravação iniciada",
        description: "Fale seu aprendizado..."
      });
    } catch (error) {
      toast({
        title: "Erro no áudio",
        description: "Verifique as permissões do microfone",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            O que você aprendeu hoje?
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Descreva seu aprendizado..."
                minHeight="120px"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={toggleRecording}
                  disabled={isProcessing}
                  className={`${isRecording ? 'bg-red-500 text-white' : ''}`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleImproveText}
                  disabled={!content.trim() || isProcessing}
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Use o botão IA para melhorar o texto ou o microfone para gravar áudio
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white">
              Registrar Aprendizado
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SmartAddLearningModal;
