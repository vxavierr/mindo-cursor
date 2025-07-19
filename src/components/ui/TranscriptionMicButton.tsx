'use client'

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, CheckCircle, Loader2 } from 'lucide-react';
import { CountdownState, CountdownType } from '@/components/ui/CountdownFeedback';

interface TranscriptionMicButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isRecording?: boolean;
  isProcessing?: boolean;
  countdownState?: CountdownState;
  countdownNumber?: number;
  className?: string;
  variant?: 'default' | 'small' | 'large';
}

const getCountdownMessage = (phase: 'countdown' | 'retry') => {
  if (phase === 'countdown') {
    return 'Transcrevendo em';
  } else {
    return 'Aguenta aí que já vou transcrever...';
  }
};

export default function TranscriptionMicButton({
  onClick,
  disabled = false,
  isRecording = false,
  isProcessing = false,
  countdownState = 'idle',
  countdownNumber = 3,
  className = '',
  variant = 'default'
}: TranscriptionMicButtonProps) {
  const isCountdownActive = countdownState !== 'idle';
  const isDisabled = disabled || isProcessing || isCountdownActive;
  
  const getSizeClasses = () => {
    switch (variant) {
      case 'small':
        return 'w-10 h-10 p-2';
      case 'large':
        return 'w-16 h-16 p-4';
      default:
        return 'w-12 h-12 p-3';
    }
  };

  const getIconSize = () => {
    switch (variant) {
      case 'small':
        return 'w-4 h-4';
      case 'large':
        return 'w-8 h-8';
      default:
        return 'w-5 h-5';
    }
  };

  const getButtonClasses = () => {
    // Detectar se estamos no AddLearningModal pela className
    const isAddLearningModal = className.includes('bg-blue-500/20');
    
    if (isRecording) {
      return `${getSizeClasses()} bg-red-500/20 border-2 border-red-500/30 text-red-400 rounded-full transition-all flex items-center justify-center ${className}`;
    }
    
    if (isCountdownActive) {
      // Para AddLearningModal, usar cor azul tanto para large quanto para pequenos
      if (isAddLearningModal) {
        return `${getSizeClasses()} bg-blue-500/20 border-2 border-blue-500/30 text-blue-400 rounded-full transition-all flex items-center justify-center ${className}`;
      }
      // Para outros componentes, manter lógica original
      const buttonColor = variant === 'large' ? 'bg-blue-500/20 border-2 border-blue-500/30 text-blue-400' : 'bg-red-500/20 border-2 border-red-500/30 text-red-400';
      return `${getSizeClasses()} ${buttonColor} rounded-full transition-all flex items-center justify-center ${className}`;
    }
    
    return `${getSizeClasses()} bg-white/10 border-2 border-white/20 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all flex items-center justify-center ${className}`;
  };

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={isDisabled}
      className={getButtonClasses()}
    >
      <AnimatePresence mode="wait">
        {isRecording && (
          <motion.div
            key="recording"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="flex items-center justify-center"
            >
              <MicOff className={getIconSize()} />
            </motion.div>
            
            {/* Pulse effect during recording */}
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-red-500/30"
            />
          </motion.div>
        )}
        
        {countdownState === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center relative"
          >
            {variant === 'large' ? (
              <>
                {/* Countdown visual apenas para variant large */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-12 h-12 bg-gradient-to-br from-red-500/30 to-red-600/30 rounded-full flex items-center justify-center relative"
                >
                  <span className="text-2xl font-bold text-red-400">{countdownNumber}</span>
                  
                  {/* Animated ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-400/70 border-r-red-400/70"
                  />
                </motion.div>
              </>
            ) : (
              /* Loading simples para botões pequenos */
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className={`${getIconSize()} text-red-400`} />
              </motion.div>
            )}
            
            {/* Animated border during countdown - apenas para large */}
            {variant === 'large' && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-red-500/50"
              />
            )}
          </motion.div>
        )}
        
        {countdownState === 'retry' && (
          <motion.div
            key="retry"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className={`${getIconSize()} text-red-400`} />
            </motion.div>
            
            {/* Shimmer effect during retry - apenas para large */}
            {variant === 'large' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
              />
            )}
          </motion.div>
        )}
        
        {countdownState === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className={`${getIconSize()} text-red-400`} />
            </motion.div>
          </motion.div>
        )}
        
        {countdownState === 'idle' && !isRecording && !isProcessing && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <Mic className={getIconSize()} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}