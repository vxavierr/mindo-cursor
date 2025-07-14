import React from 'react';
import LearningCard from './LearningCard';
import { useLearningCardLayout } from './LearningCardLayoutContext';
import { LearningEntry } from '@/utils/learningStatus';

interface LearningCardListProps {
  entries: LearningEntry[];
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, data: Partial<LearningEntry>) => void;
  compact?: boolean;
  desktopLayout?: boolean;
}

const LearningCardList: React.FC<LearningCardListProps> = ({ entries, onDelete, onUpdate, compact, desktopLayout }) => {
  const { layout } = useLearningCardLayout();
  console.log('LearningCardList layout:', layout);
  if (!entries || entries.length === 0) {
    return <div className="text-center text-gray-500 py-12">Nenhum aprendizado encontrado.</div>;
  }
  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <LearningCard
          key={entry.id}
          entry={entry}
          onDelete={onDelete}
          onUpdate={onUpdate}
          variant={layout}
          compact={compact}
          desktopLayout={desktopLayout}
          index={index}
        />
      ))}
    </div>
  );
};

export default LearningCardList; 