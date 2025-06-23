
import React from 'react';
import FloatingNavigation from '../navigation/FloatingNavigation';

interface NavigationLayoutProps {
  children: React.ReactNode;
  activeNavItem?: string;
  onNavigate?: (path: string) => void;
  onCreateLearning?: () => void;
  onReview?: () => void;
}

const NavigationLayout = ({ 
  children, 
  activeNavItem, 
  onNavigate,
  onCreateLearning,
  onReview
}: NavigationLayoutProps) => {
  return (
    <div 
      className="w-full min-h-screen pb-28 md:pb-32 lg:pb-40"
      style={{ backgroundColor: '#E8EBF0' }}
    >
      {/* Main Content Area */}
      <main className="w-full relative">
        <div className="max-w-full mx-auto">
          {children}
        </div>
      </main>
      
      {/* Floating Navigation */}
      <FloatingNavigation
        activeItem={activeNavItem}
        onNavigate={onNavigate}
        onCreateLearning={onCreateLearning}
        onReview={onReview}
      />
    </div>
  );
};

export default NavigationLayout;
