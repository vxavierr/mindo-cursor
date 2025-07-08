import React from 'react';
import { Calendar } from 'lucide-react';
import { LearningEntry } from '@/hooks/useCleanLearning';
import EnhancedLearningCard from './EnhancedLearningCard';

interface EnhancedTodaysLearningProps {
  entries: LearningEntry[];
  onDelete: (id: string) => void;
  onUpdate?: (id: string, updates: { title?: string; content?: string; tags?: string[]; context?: string }) => Promise<boolean>;
  compact?: boolean;
}

const EnhancedTodaysLearning = ({ 
  entries, 
  onDelete,
  onUpdate, 
  compact = false 
}: EnhancedTodaysLearningProps) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 md:py-16 animate-fade-in">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 transition-all duration-300 hover:scale-105">
          <Calendar className="w-8 h-8 md:w-10 md:h-10 text-gray-400" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 transition-all duration-300 hover:scale-105">
            <span className="text-3xl md:text-4xl">📚</span>
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 transition-all duration-300">Nenhum aprendizado hoje</h3>
          <p className="text-sm md:text-base text-gray-600 font-medium transition-all duration-300">Registre seu primeiro aprendizado do dia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile: Stack vertical (1 coluna) */}
      <div className="sm:hidden space-y-4">
        {entries.map((entry) => (
          <EnhancedLearningCard
            key={entry.id}
            entry={entry}
            onDelete={onDelete}
            onUpdate={onUpdate}
            compact={compact}
          />
        ))}
      </div>

      {/* Tablet e Desktop: Grid 2 colunas */}
      <div className="hidden sm:grid grid-cols-2 gap-6 cards-grid-transition">
        {entries.map((entry) => (
          <EnhancedLearningCard
            key={entry.id}
            entry={entry}
            onDelete={onDelete}
            onUpdate={onUpdate}
            compact={compact}
            desktopLayout={true}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedTodaysLearning;
