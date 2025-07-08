import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useEnhancedAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const improveText = async (content: string): Promise<string> => {
    setIsProcessing(true);
    try {
      console.log('Melhorando texto:', content.substring(0, 100) + '...');
      
      const { data, error } = await supabase.functions.invoke('enhance-text', {
        body: { 
          text: content, 
          action: 'improve'
        }
      });

      if (error) {
        console.error('Erro na função enhance-text:', error);
        throw error;
      }

      console.log('Resposta da IA para melhoria:', data);
      return data.result || content;
    } catch (error) {
      console.error('Erro ao melhorar texto:', error);
      toast({
        title: "Erro ao melhorar texto",
        description: "Verifique sua conexão e tente novamente",
        variant: "destructive"
      });
      return content;
    } finally {
      setIsProcessing(false);
    }
  };

  const generateTitleAndTags = async (content: string): Promise<{ title: string; tags: string[] }> => {
    try {
      console.log('Gerando título e tags para:', content.substring(0, 100) + '...');
      
      // Gerar título
      const { data: titleData, error: titleError } = await supabase.functions.invoke('enhance-text', {
        body: { 
          text: content, 
          action: 'generate_title'
        }
      });

      if (titleError) {
        console.error('Erro ao gerar título:', titleError);
        throw titleError;
      }

      // Gerar tags
      const { data: tagsData, error: tagsError } = await supabase.functions.invoke('enhance-text', {
        body: { 
          text: content, 
          action: 'generate_tags'
        }
      });

      if (tagsError) {
        console.error('Erro ao gerar tags:', tagsError);
        throw tagsError;
      }

      console.log('Título gerado:', titleData);
      console.log('Tags geradas:', tagsData);

      const title = titleData?.result || content.substring(0, 60) + (content.length > 60 ? '...' : '');
      const tagsString = tagsData?.result || '';
      const tags = tagsString ? tagsString.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [];

      return { title, tags };
    } catch (error) {
      console.error('Erro ao gerar título e tags:', error);
      // Retornar valores de fallback
      return {
        title: content.substring(0, 60) + (content.length > 60 ? '...' : ''),
        tags: []
      };
    }
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    setIsProcessing(true);
    try {
      console.log('Iniciando transcrição de áudio, tamanho:', audioBlob.size, 'bytes');
      
      // Converter áudio para base64
      const reader = new FileReader();
      const audioData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      console.log('Áudio convertido para base64, tamanho:', audioData.length);

      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { 
          audio: audioData
        }
      });

      if (error) {
        console.error('Erro na função transcribe-audio:', error);
        throw error;
      }

      console.log('Resposta da transcrição:', data);
      return data.text || '';
    } catch (error) {
      console.error('Erro na transcrição:', error);
      toast({
        title: "Erro na transcrição",
        description: "Verifique o microfone e tente novamente",
        variant: "destructive"
      });
      return '';
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    improveText,
    generateTitleAndTags,
    transcribeAudio,
    isProcessing
  };
};
