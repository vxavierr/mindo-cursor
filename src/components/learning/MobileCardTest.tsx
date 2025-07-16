import React from 'react';
import { motion } from 'framer-motion';
import LearningCard from './LearningCard';
import { LearningEntry } from '@/utils/learningStatus';

const MobileCardTest: React.FC = () => {
  // Mock data for testing
  const mockEntry: LearningEntry = {
    id: 'test-1',
    title: 'Teste de Card Mobile',
    content: 'Este é um card de teste para demonstrar as funcionalidades mobile: long press, edição em tela cheia, e animações suaves.',
    tags: ['teste', 'mobile', 'interação'],
    step: 2,
    createdAt: new Date().toISOString(),
    lastReviewDate: new Date().toISOString(),
    lastDifficulty: 'medium' as const,
    context: '',
    userId: 'test-user'
  };

  const handleUpdate = async (id: string, data: Partial<LearningEntry>) => {
    console.log('Updating card:', id, data);
    // Simulate successful update
    return true;
  };

  const handleDelete = (id: string) => {
    console.log('Deleting card:', id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto space-y-6"
      >
        <div className="text-center text-white mb-8">
          <h1 className="text-2xl font-bold mb-2">Teste de Cards Mobile</h1>
          <p className="text-white/70 text-sm">
            Funcionalidades implementadas:
          </p>
          <ul className="text-white/60 text-xs mt-2 space-y-1">
            <li>• Long press (600ms) para mostrar ações</li>
            <li>• Progress indicator visual durante long press</li>
            <li>• Edição em tela cheia para mobile</li>
            <li>• Expand/collapse com animações</li>
            <li>• Touch events adaptados</li>
          </ul>
        </div>

        <LearningCard
          entry={mockEntry}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          variant="enhanced"
          index={0}
        />

        <div className="text-center text-white/60 text-xs mt-6">
          <p>Mantenha pressionado o card para ver o menu de ações</p>
        </div>
      </motion.div>
    </div>
  );
};

export default MobileCardTest;