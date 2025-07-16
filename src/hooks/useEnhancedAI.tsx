import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useEnhancedAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const improveText = async (content: string): Promise<string> => {
    setIsProcessing(true);
    try {
      
      const { data, error } = await supabase.functions.invoke('enhance-text', {
        body: { 
          text: content, 
          action: 'improve'
        }
      });

      if (error) {
        console.error('Erro na função enhance-text:', error);
        // Tratar erro 429 (Too Many Requests) especificamente
        if (error.context?.status === 429 || (error.message && error.message.includes('429'))) {
          throw new Error('Muitas solicitações. Aguarde um momento e tente novamente.');
        }
        throw error;
      }

      return data.result || content;
    } catch (error) {
      console.error('Erro ao melhorar texto:', error);
      try {
        const errorMessage = error.message || 'Erro desconhecido';
        const isRateLimit = error.context?.status === 429 || 
                           errorMessage.includes('429') || 
                           errorMessage.includes('Muitas solicitações');
        
        toast({
          title: "Erro ao melhorar texto",
          description: isRateLimit 
            ? "Muitas solicitações. Aguarde um momento e tente novamente"
            : "Verifique sua conexão e tente novamente",
          variant: "destructive"
        });
      } catch (toastError) {
        console.error('Erro no toast:', toastError);
      }
      return content;
    } finally {
      setIsProcessing(false);
    }
  };

  const generateTitleAndTags = async (content: string): Promise<{ title: string; tags: string[] }> => {
    try {
      
      // Gerar título
      const { data: titleData, error: titleError } = await supabase.functions.invoke('enhance-text', {
        body: { 
          text: content, 
          action: 'generate_title'
        }
      });

      if (titleError) {
        console.error('Erro ao gerar título:', titleError);
        // Tratar erro 429 (Too Many Requests) especificamente
        if (titleError.context?.status === 429 || (titleError.message && titleError.message.includes('429'))) {
          throw new Error('Muitas solicitações. Aguarde um momento e tente novamente.');
        }
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
        // Tratar erro 429 (Too Many Requests) especificamente
        if (tagsError.context?.status === 429 || (tagsError.message && tagsError.message.includes('429'))) {
          throw new Error('Muitas solicitações. Aguarde um momento e tente novamente.');
        }
        throw tagsError;
      }


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


      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { 
          audio: audioData
        }
      });

      if (error) {
        console.error('Erro na função transcribe-audio:', error);
        // Tratar erro 429 (Too Many Requests) especificamente
        if (error.context?.status === 429 || (error.message && error.message.includes('429'))) {
          throw new Error('Muitas solicitações. Aguarde um momento e tente novamente.');
        }
        throw error;
      }

      return data.text || '';
    } catch (error) {
      console.error('Erro na transcrição:', error);
      try {
        const errorMessage = error.message || 'Erro desconhecido';
        const isRateLimit = error.context?.status === 429 || 
                           errorMessage.includes('429') || 
                           errorMessage.includes('Muitas solicitações');
        
        toast({
          title: "Erro na transcrição",
          description: isRateLimit 
            ? "Muitas solicitações. Aguarde um momento e tente novamente"
            : "Verifique o microfone e tente novamente",
          variant: "destructive"
        });
      } catch (toastError) {
        console.error('Erro no toast:', toastError);
      }
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
