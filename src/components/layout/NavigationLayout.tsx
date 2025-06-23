
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
      className="w-full min-h-screen"
      style={{ backgroundColor: '#f5f5f7', paddingBottom: '5rem' }}
    >
      {/* Main Content Area - Full Width */}
      <main className="w-full relative">
        {children}
      </main>
      
      {/* Floating Navigation - Enhanced responsive system */}
      <div className="responsive-bottom-nav">
        <FloatingNavigation
          activeItem={activeNavItem}
          onNavigate={onNavigate}
          onCreateLearning={onCreateLearning}
          onReview={onReview}
        />
      </div>
    </div>
  );
};

export default NavigationLayout;
