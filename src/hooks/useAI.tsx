
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const improveText = async (content: string): Promise<string> => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-with-ai', {
        body: { content, action: 'improve_text' }
      });

      if (error) throw error;
      return data.result;
    } catch (error) {
      console.error('Error improving text:', error);
      toast({
        title: "Erro ao melhorar texto",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
      return content; // Return original content on error
    } finally {
      setIsProcessing(false);
    }
  };

  const generateTitleAndTags = async (content: string): Promise<{ title: string; tags: string[] }> => {
    try {
      const { data, error } = await supabase.functions.invoke('process-with-ai', {
        body: { content, action: 'generate_title_tags' }
      });

      if (error) throw error;
      return { title: data.title, tags: data.tags };
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
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      // For now, simulate transcription - in a real implementation, 
      // you would send the audio to a speech-to-text service
      toast({
        title: "Transcrição simulada",
        description: "Em desenvolvimento: funcionalidade de áudio será implementada em breve"
      });
      
      return "Exemplo de transcrição: Este é o texto que seria transcrito do áudio gravado.";
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast({
        title: "Erro na transcrição",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
      return "";
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
