'use client'

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Mic, MessageSquare, Tag } from 'lucide-react';

export type CountdownState = 'idle' | 'countdown' | 'retry' | 'processing';
export type CountdownType = 'transcription' | 'improvement' | 'generation';

interface CountdownFeedbackProps {
  state: CountdownState;
  countdown: number;
  type: CountdownType;
  className?: string;
}

const getTypeConfig = (type: CountdownType) => {
  switch (type) {
    case 'transcription':
      return {
        icon: Mic,
        color: 'from-blue-500 to-cyan-500',
        borderColor: 'border-blue-500/30',
        textColor: 'text-blue-400',
        countdownMessage: 'Transcrevendo seu áudio em',
        retryMessage: 'Aguenta aí que já vou transcrever seu áudio...',
        processingMessage: 'Convertendo fala em texto...'
      };
    case 'improvement':
      return {
        icon: Sparkles,
        color: 'from-purple-500 to-pink-500',
        borderColor: 'border-purple-500/30',
        textColor: 'text-purple-400',
        countdownMessage: 'Aprimorando seu texto em',
        retryMessage: 'Aguenta aí que já vou aprimorar seu texto...',
        processingMessage: 'Melhorando conteúdo...'
      };
    case 'generation':
      return {
        icon: Tag,
        color: 'from-green-500 to-emerald-500',
        borderColor: 'border-green-500/30',
        textColor: 'text-green-400',
        countdownMessage: 'Gerando título e tags em',
        retryMessage: 'Quase lá, gerando título e tags...',
        processingMessage: 'Criando conteúdo...'
      };
  }
};

export default function CountdownFeedback({ 
  state, 
  countdown, 
  type, 
  className = '' 
}: CountdownFeedbackProps) {
  const config = getTypeConfig(type);
  const Icon = config.icon;

  if (state === 'idle') return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`bg-black/40 backdrop-blur-2xl rounded-2xl p-4 border ${config.borderColor} shadow-2xl ${className}`}
      >
        <div className="flex items-center gap-3">
          {/* Icon with pulse animation */}
          <motion.div
            animate={{ 
              scale: state === 'countdown' ? [1, 1.1, 1] : 1,
              rotate: state === 'processing' ? 360 : 0
            }}
            transition={{ 
              scale: { duration: 1, repeat: Infinity },
              rotate: { duration: 2, repeat: Infinity, ease: "linear" }
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center border bg-gradient-to-br ${config.color}/20 ${config.borderColor}`}
          >
            {state === 'processing' ? (
              <Loader2 className={`w-5 h-5 ${config.textColor} animate-spin`} />
            ) : (
              <Icon className={`w-5 h-5 ${config.textColor}`} />
            )}
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {state === 'countdown' && (
                <motion.div
                  key="countdown"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${config.textColor}`}>
                      {config.countdownMessage}
                    </span>
                    <motion.span
                      key={countdown}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`text-lg font-bold ${config.textColor}`}
                    >
                      {countdown}
                    </motion.span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 1, ease: "linear" }}
                      className={`h-full bg-gradient-to-r ${config.color} rounded-full`}
                    />
                  </div>
                </motion.div>
              )}

              {state === 'retry' && (
                <motion.div
                  key="retry"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1"
                >
                  <span className={`text-sm font-medium ${config.textColor}`}>
                    {config.retryMessage}
                  </span>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ x: ["0%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className={`h-full w-8 bg-gradient-to-r ${config.color} rounded-full`}
                    />
                  </div>
                </motion.div>
              )}

              {state === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1"
                >
                  <span className={`text-sm font-medium ${config.textColor}`}>
                    {config.processingMessage}
                  </span>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                      className={`h-full w-1/3 bg-gradient-to-r ${config.color} rounded-full`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Glow effect */}
        <motion.div
          animate={{ 
            opacity: [0.1, 0.3, 0.1] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute inset-0 bg-gradient-to-r ${config.color} opacity-10 rounded-2xl blur-xl -z-10`}
        />
      </motion.div>
    </AnimatePresence>
  );
}