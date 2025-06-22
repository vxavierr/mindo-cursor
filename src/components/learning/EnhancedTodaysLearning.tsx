
import React from 'react';
import { Calendar } from 'lucide-react';
import { LearningEntry } from '@/hooks/useCleanLearning';
import EnhancedLearningCard from './EnhancedLearningCard';

interface EnhancedTodaysLearningProps {
  entries: LearningEntry[];
  onDelete: (id: string) => void;
  compact?: boolean;
}

const EnhancedTodaysLearning = ({ 
  entries, 
  onDelete, 
  compact = false 
}: EnhancedTodaysLearningProps) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📚</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Nenhum aprendizado hoje</h3>
          <p className="text-gray-600 font-medium">Registre seu primeiro aprendizado do dia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 md:hidden">
        {compact ? 'Aprendizados' : 'Aprendizados de hoje'}
      </h3>
      
      {/* Mobile Layout */}
      <div className="md:hidden space-y-4">
        {entries.map((entry) => (
          <EnhancedLearningCard
            key={entry.id}
            entry={entry}
            onDelete={onDelete}
            compact={compact}
          />
        ))}
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {entries.map((entry) => (
          <EnhancedLearningCard
            key={entry.id}
            entry={entry}
            onDelete={onDelete}
            compact={compact}
            desktopLayout={true}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedTodaysLearning;
