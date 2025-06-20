
import React from 'react';
import FloatingNavigation from '../navigation/FloatingNavigation';

interface NavigationLayoutProps {
  children: React.ReactNode;
  activeNavItem?: string;
  onNavigate?: (path: string) => void;
  onFabClick?: () => void;
}

const NavigationLayout = ({ 
  children, 
  activeNavItem, 
  onNavigate,
  onFabClick 
}: NavigationLayoutProps) => {
  return (
    <div 
      className="min-h-screen pb-28"
      style={{ backgroundColor: '#E8EBF0' }}
    >
      {/* Main Content Area */}
      <main className="relative">
        {children}
      </main>
      
      {/* Floating Navigation */}
      <FloatingNavigation
        activeItem={activeNavItem}
        onNavigate={onNavigate}
        onFabClick={onFabClick}
      />
    </div>
  );
};

export default NavigationLayout;
