
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Sparkles, Loader2, Send } from 'lucide-react';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { useToast } from '@/hooks/use-toast';

interface CleanAddLearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (content: string, title: string, tags: string[]) => void;
}

const CleanAddLearningModal = ({ isOpen, onClose, onAdd }: CleanAddLearningModalProps) => {
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const { improveText, generateTitleAndTags, transcribeAudio, isProcessing } = useEnhancedAI();
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        console.log('Audio blob criado:', audioBlob.size, 'bytes');
        
        try {
          const transcribedText = await transcribeAudio(audioBlob);
          console.log('Texto transcrito:', transcribedText);
          
          if (transcribedText && transcribedText.trim()) {
            setContent(prev => prev + (prev ? ' ' : '') + transcribedText);
            toast({
              title: "Áudio transcrito!",
              description: "O texto foi adicionado com sucesso"
            });
          } else {
            toast({
              title: "Nenhum texto detectado",
              description: "Tente falar mais alto ou mais próximo do microfone",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Erro na transcrição:', error);
          toast({
            title: "Erro na transcrição",
            description: "Tente novamente",
            variant: "destructive"
          });
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      toast({
        title: "Gravação iniciada",
        description: "Fale agora..."
      });
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      toast({
        title: "Erro no microfone",
        description: "Verifique as permissões do microfone",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
      
      toast({
        title: "Gravação finalizada",
        description: "Processando áudio..."
      });
    }
  };

  const handleImproveText = async () => {
    if (!content.trim()) {
      toast({
        title: "Nenhum texto para melhorar",
        description: "Digite algum conteúdo primeiro",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const improvedText = await improveText(content);
      if (improvedText && improvedText !== content) {
        setContent(improvedText);
        toast({
          title: "Texto melhorado!",
          description: "O conteúdo foi aprimorado pela IA"
        });
      }
    } catch (error) {
      console.error('Erro ao melhorar texto:', error);
      toast({
        title: "Erro na melhoria do texto",
        description: "Tente novamente",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Conteúdo obrigatório",
        description: "Por favor, adicione algum conteúdo",
        variant: "destructive"
      });
      return;
    }

    try {
      // Gerar título e tags automaticamente
      const { title, tags } = await generateTitleAndTags(content);
      
      onAdd(content.trim(), title, tags);
      setContent('');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente",
        variant: "destructive"
      });
    }
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
          
          <p className="text-xs text-gray-400 dark: text-center">
            ⌘ + Enter para salvar rapidamente
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CleanAddLearningModal;
