
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
      <div className="text-center py-16 animate-fade-in">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 hover:scale-105">
          <Calendar className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 hover:scale-105">
            <span className="text-4xl">📚</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 text-transition">Nenhum aprendizado hoje</h3>
          <p className="text-gray-600 font-medium text-transition">Registre seu primeiro aprendizado do dia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile Layout - Enhanced with responsive transitions */}
      <div className="md:hidden space-y-4">
        {entries.map((entry, index) => (
          <div 
            key={entry.id}
            className="learning-card-animate responsive-card-transition"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <EnhancedLearningCard
              entry={entry}
              onDelete={onDelete}
              onUpdate={onUpdate}
              compact={compact}
            />
          </div>
        ))}
      </div>

      {/* Desktop Grid Layout - Enhanced responsive grid */}
      <div className="hidden md:grid cards-grid-transition grid-responsive-md lg:grid-responsive-lg xl:grid-responsive-xl">
        {entries.map((entry, index) => (
          <div 
            key={entry.id}
            className="learning-card-animate responsive-card-transition"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <EnhancedLearningCard
              entry={entry}
              onDelete={onDelete}
              onUpdate={onUpdate}
              compact={compact}
              desktopLayout={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedTodaysLearning;
