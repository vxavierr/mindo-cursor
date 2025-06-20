
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useEnhancedAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const improveText = async (content: string): Promise<string> => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-with-ai', {
        body: { 
          content, 
          action: 'improve_text',
          prompt: 'Revise este texto mantendo sua estrutura original, mas tornando-o mais claro, coeso e bem escrito. Preserve o significado e o estilo pessoal do autor.'
        }
      });

      if (error) throw error;
      return data.result || content;
    } catch (error) {
      console.error('Error improving text:', error);
      toast({
        title: "Erro ao melhorar texto",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
      return content;
    } finally {
      setIsProcessing(false);
    }
  };

  const generateTitleAndTags = async (content: string): Promise<{ title: string; tags: string[] }> => {
    try {
      const { data, error } = await supabase.functions.invoke('process-with-ai', {
        body: { 
          content, 
          action: 'generate_title_tags',
          prompt: 'Com base neste conteúdo de aprendizado, gere um título conciso e relevante (máximo 60 caracteres) e até 5 tags que categorizam o conhecimento descrito.'
        }
      });

      if (error) throw error;
      return { 
        title: data.title || content.substring(0, 60) + (content.length > 60 ? '...' : ''),
        tags: data.tags || []
      };
    } catch (error) {
      console.error('Error generating title and tags:', error);
      // Return fallback values
      return {
        title: content.substring(0, 60) + (content.length > 60 ? '...' : ''),
        tags: []
      };
    }
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    setIsProcessing(true);
    try {
      // Convert audio to base64
      const reader = new FileReader();
      const audioData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data URL prefix to get just the base64 data
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      const { data, error } = await supabase.functions.invoke('process-with-ai', {
        body: { 
          audioData,
          action: 'transcribe_audio',
          prompt: 'Transcreva este áudio em português, organizando o texto de forma clara e estruturada.'
        }
      });

      if (error) throw error;
      return data.transcription || '';
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast({
        title: "Erro na transcrição",
        description: "Tente novamente em alguns instantes",
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
