import React, { createContext, useContext, useState, ReactNode } from 'react';

type CardLayout = 'clean' | 'default' | 'enhanced';

interface LearningCardLayoutContextProps {
  layout: CardLayout;
  setLayout: (layout: CardLayout) => void;
}

const LearningCardLayoutContext = createContext<LearningCardLayoutContextProps | undefined>(undefined);

export const LearningCardLayoutProvider = ({ children }: { children: ReactNode }) => {
  const [layout, setLayout] = useState<CardLayout>('default');
  return (
    <LearningCardLayoutContext.Provider value={{ layout, setLayout }}>
      {children}
    </LearningCardLayoutContext.Provider>
  );
};

export const useLearningCardLayout = () => {
  const context = useContext(LearningCardLayoutContext);
  if (!context) throw new Error('useLearningCardLayout must be used within LearningCardLayoutProvider');
  return context;
}; 