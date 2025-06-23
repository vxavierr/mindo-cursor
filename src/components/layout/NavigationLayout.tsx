
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
      className="w-full min-h-screen pb-32 md:pb-40 content-transition"
      style={{ backgroundColor: '#E8EBF0' }}
    >
      {/* Main Content Area - Enhanced responsive */}
      <main className="w-full relative container-responsive">
        {children}
      </main>
      
      {/* Floating Navigation - Enhanced with nav transitions */}
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
