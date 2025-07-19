'use client'

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { CountdownState, CountdownType } from '@/components/ui/CountdownFeedback';

interface EnhancedAIButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isProcessing?: boolean;
  countdownState?: CountdownState;
  countdownNumber?: number;
  countdownType?: CountdownType;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'small';
}

const getCountdownMessage = (type: CountdownType, phase: 'countdown' | 'retry') => {
  if (phase === 'countdown') {
    switch (type) {
      case 'improvement':
        return 'Aprimorando em';
      case 'generation':
        return 'Gerando em';
      default:
        return 'Processando em';
    }
  } else {
    switch (type) {
      case 'improvement':
        return 'Aguenta aí que já vou aprimorar...';
      case 'generation':
        return 'Quase lá, gerando...';
      default:
        return 'Aguenta aí...';
    }
  }
};

export default function EnhancedAIButton({
  onClick,
  disabled = false,
  isProcessing = false,
  countdownState = 'idle',
  countdownNumber = 3,
  countdownType = 'improvement',
  children,
  className = '',
  variant = 'default'
}: EnhancedAIButtonProps) {
  const isCountdownActive = countdownState !== 'idle';
  const isDisabled = disabled || isProcessing || isCountdownActive;
  
  const baseClasses = variant === 'small' 
    ? 'px-3 py-2 text-sm' 
    : 'px-4 py-3 text-base';

  const buttonClasses = `
    ${baseClasses}
    bg-gradient-to-r from-purple-500 to-blue-500 
    rounded-2xl text-white font-medium 
    hover:opacity-90 transition-opacity 
    disabled:opacity-50 disabled:cursor-not-allowed 
    shadow-lg min-w-[120px] flex items-center justify-center
    ${className}
  `;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={isDisabled}
      className={buttonClasses}
    >
      <AnimatePresence mode="wait">
        {countdownState === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            <span className="text-sm font-medium">
              {countdownNumber}s
            </span>
          </motion.div>
        )}
        
        {countdownState === 'retry' && (
          <motion.div
            key="retry"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-4 h-4" />
            </motion.div>
            <span className="text-sm font-medium">
              Aguarde...
            </span>
          </motion.div>
        )}
        
        {countdownState === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-4 h-4" />
            </motion.div>
            <span className="text-sm">Processando...</span>
          </motion.div>
        )}
        
        {countdownState === 'idle' && !isProcessing && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-2"
          >
            {children || (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Aprimorar</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}