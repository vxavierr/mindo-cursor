'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X,
  Mic,
  MicOff,
  Sparkles,
  Save
} from 'lucide-react';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { useToast } from '@/hooks/use-toast';

interface AddLearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (content: string, title: string, tags: string[]) => void;
  context?: string;
}

const AddLearningModal = ({ isOpen, onClose, onAdd, context }: AddLearningModalProps) => {
  const [learningText, setLearningText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAIButton, setShowAIButton] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  
  const { improveText, generateTitleAndTags, transcribeAudio, isProcessing } = useEnhancedAI();
  const { toast } = useToast();

  useEffect(() => {
    setShowAIButton(learningText.trim().length > 10);
  }, [learningText]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      console.log('Iniciando gravação...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        console.log('Gravação finalizada, processando áudio...');
        setIsProcessingAudio(true);
        
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        console.log('Audio blob criado:', audioBlob.size, 'bytes');
        
        try {
          const transcribedText = await transcribeAudio(audioBlob);
          console.log('Texto transcrito:', transcribedText);
          
          if (transcribedText && transcribedText.trim()) {
            setLearningText(prev => prev + (prev ? ' ' : '') + transcribedText);
            try {
              toast({
                title: "Áudio transcrito!",
                description: "O texto foi adicionado com sucesso",
                variant: "success"
              });
            } catch (toastError) {
              console.error('Erro no toast:', toastError);
            }
          } else {
            try {
              toast({
                title: "Nenhum texto detectado",
                description: "Tente falar mais alto ou digite manualmente",
                variant: "warning"
              });
            } catch (toastError) {
              console.error('Erro no toast:', toastError);
            }
          }
        } catch (error) {
          console.error('Erro na transcrição:', error);
          try {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            let description = "Verifique sua conexão e tente novamente";
            
            if (errorMessage.includes('429') || errorMessage.includes('Muitas solicitações')) {
              description = "Muitas solicitações. Aguarde um momento e tente novamente";
            }
            
            toast({
              title: "Erro na transcrição",
              description,
              variant: "destructive"
            });
          } catch (toastError) {
            console.error('Erro no toast:', toastError);
          }
        } finally {
          setIsProcessingAudio(false);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      try {
        toast({
          title: "Gravação iniciada",
          description: "Fale agora...",
          variant: "info"
        });
      } catch (toastError) {
        console.error('Erro no toast:', toastError);
      }
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      try {
        toast({
          title: "Erro no microfone",
          description: "Verifique as permissões do microfone",
          variant: "destructive"
        });
      } catch (toastError) {
        console.error('Erro no toast:', toastError);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
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

  const handleAIImprovement = async () => {
    if (!learningText.trim()) {
      try {
        toast({
          title: "Nenhum texto para melhorar",
          description: "Digite algum conteúdo primeiro",
          variant: "warning"
        });
      } catch (toastError) {
        console.error('Erro no toast:', toastError);
      }
      return;
    }
    
    setIsProcessingAI(true);
    
    try {
      console.log('Melhorando texto...');
      const textToImprove = context ? `${context}\n\n${learningText}` : learningText;
      const improvedText = await improveText(textToImprove);
      console.log('Texto melhorado recebido:', improvedText);
      
      if (improvedText && improvedText !== learningText) {
        setLearningText(improvedText || '');
        try {
          toast({
            title: "Texto melhorado!",
          description: "O conteúdo foi aprimorado pela IA",
          variant: "success"
          });
        } catch (toastError) {
          console.error('Erro no toast:', toastError);
        }
      }
    } catch (error) {
      console.error('Erro ao melhorar texto:', error);
      try {
        toast({
          title: "Erro na melhoria do texto",
          description: "Verifique sua conexão e tente novamente",
          variant: "destructive"
        });
      } catch (toastError) {
        console.error('Erro no toast:', toastError);
      }
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleSave = async () => {
    if (!learningText.trim()) {
      try {
        toast({
          title: "Conteúdo obrigatório",
          description: "Por favor, adicione algum conteúdo",
          variant: "warning"
        });
      } catch (toastError) {
        console.error('Erro no toast:', toastError);
      }
      return;
    }

    setIsSaving(true);

    try {
      console.log('Gerando título e tags...');
      const contentWithContext = context ? `${context}\n\n${learningText}` : learningText;
      const { title, tags } = await generateTitleAndTags(contentWithContext);
      
      onAdd(learningText.trim(), title, tags);
      setLearningText('');
      onClose();
      
      try {
        toast({
          title: "Aprendizado salvo!",
          description: "Título e tags foram gerados automaticamente",
          variant: "success"
        });
      } catch (toastError) {
        console.error('Erro no toast:', toastError);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      try {
        toast({
          title: "Erro ao salvar",
          description: "Verifique sua conexão e tente novamente",
          variant: "destructive"
        });
      } catch (toastError) {
        console.error('Erro no toast:', toastError);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    onClose();
    setLearningText('');
    setIsRecording(false);
    setRecordingTime(0);
    setIsProcessingAudio(false);
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-black/30 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 w-full max-w-2xl relative"
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">O que você aprendeu?</h2>
              <p className="text-white/60">
                Escreva abaixo ou grave sua voz e deixe a IA transcrever automaticamente
              </p>
            </div>

            {/* Context */}
          {context && (
              <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                <p className="text-blue-300 text-sm">
                <strong>Contexto:</strong> {context}
              </p>
            </div>
          )}
          
            {/* Input Area */}
            <div className="mb-6">
              {isRecording ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[200px]">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-4"
                  >
                    <Mic className="w-8 h-8 text-red-400" />
                  </motion.div>
                  <p className="text-white text-lg font-medium mb-2">Gravando...</p>
                  <p className="text-white/60 mb-4">Fale sobre o que você aprendeu</p>
                  <div className="text-red-400 font-mono text-xl mb-6">
                    {formatRecordingTime(recordingTime)}
                  </div>
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-white/60 text-sm">Gravando áudio...</span>
                  </div>
                  
                  {/* Stop Recording Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleRecording}
                    className="bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-3 rounded-xl font-medium flex items-center space-x-2 hover:bg-red-500/30 transition-colors"
                  >
                    <MicOff className="w-5 h-5" />
                    <span>Encerrar Gravação</span>
                  </motion.button>
                </div>
              ) : isProcessingAudio ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[200px]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-4"
                  >
                    <Sparkles className="w-8 h-8 text-purple-400" />
                  </motion.div>
                  <p className="text-white text-lg font-medium mb-2">Processando áudio...</p>
                  <p className="text-white/60 mb-4">A IA está transcrevendo sua fala</p>
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <span className="text-white/60 text-sm">Transcrevendo...</span>
                  </div>
                  
                  {/* Processing Animation */}
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-purple-400 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Record Button - Above textarea */}
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={toggleRecording}
                      className="bg-white/10 border border-white/20 text-white/80 hover:text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 hover:bg-white/20 transition-colors"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Gravar Áudio</span>
                    </motion.button>
                  </div>
                  
                  {/* Textarea */}
          <div className="relative">
                    <textarea
                      value={learningText}
                      onChange={(e) => setLearningText(e.target.value)}
              placeholder="Descreva o que você aprendeu hoje..."
                      className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/40 resize-none focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 text-lg leading-relaxed"
                    />
                    
                    {/* AI Button */}
                    <AnimatePresence>
                      {showAIButton && !isProcessingAI && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAIImprovement}
                          className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 shadow-lg"
                        >
                    <Sparkles className="w-4 h-4" />
                          <span>Aprimorar</span>
                        </motion.button>
              )}
                    </AnimatePresence>

                    {/* AI Processing */}
                    <AnimatePresence>
                      {isProcessingAI && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xl rounded-xl px-4 py-2 flex items-center space-x-2"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-400 rounded-full"
                          />
                          <span className="text-white/80 text-sm">Aprimorando...</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div className="text-center text-white/60 text-sm mb-6">
                {isRecording ? (
                'Clique em "Encerrar Gravação" quando terminar de falar'
              ) : isProcessingAudio ? (
                'Aguarde enquanto processamos seu áudio...'
                ) : (
                `${learningText.length} caracteres • ${showAIButton ? 'Clique em "Aprimorar" para melhorar o texto' : 'Clique em "Gravar Áudio" ou continue escrevendo'}`
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCloseModal}
                className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 h-12 rounded-2xl flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                Cancelar
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={!learningText.trim() || isSaving || isProcessingAudio}
                className="flex-1 relative group"
              >
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className={`relative overflow-hidden h-12 rounded-2xl transition-all duration-300 flex items-center justify-center font-semibold ${
                  learningText.trim() && !isSaving && !isProcessingAudio
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'bg-white/10 text-white/50 cursor-not-allowed'
                }`}>
                  <AnimatePresence mode="wait">
                    {isSaving ? (
                      <motion.div
                        key="saving"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center space-x-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span>Salvando...</span>
                      </motion.div>
                ) : (
                      <motion.div
                        key="save"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Salvar</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddLearningModal; 