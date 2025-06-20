
import React, { useState } from 'react';
import { Home, Settings, Plus, BookOpen, RotateCcw } from 'lucide-react';

interface FloatingNavigationProps {
  activeItem?: string;
  onNavigate?: (path: string) => void;
  onCreateLearning?: () => void;
  onReview?: () => void;
}

const FloatingNavigation = ({ 
  activeItem = 'home', 
  onNavigate,
  onCreateLearning,
  onReview
}: FloatingNavigationProps) => {
  const [pressedItem, setPressedItem] = useState<string | null>(null);
  const [pressedFab, setPressedFab] = useState(false);
  const [fabMenuOpen, setFabMenuOpen] = useState(false);

  const handleItemClick = (itemId: string, path: string) => {
    setPressedItem(itemId);
    setTimeout(() => setPressedItem(null), 100);
    onNavigate?.(path);
  };

  const handleFabClick = () => {
    setPressedFab(true);
    setTimeout(() => setPressedFab(false), 100);
    setFabMenuOpen(!fabMenuOpen);
  };

  const handleSubAction = (action: 'create' | 'review') => {
    setFabMenuOpen(false);
    if (action === 'create') {
      onCreateLearning?.();
    } else {
      onReview?.();
    }
  };

  const handleOverlayClick = () => {
    setFabMenuOpen(false);
  };

  return (
    <>
      {/* Background overlay when FAB menu is open */}
      {fabMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-200"
          onClick={handleOverlayClick}
        />
      )}

      {/* FAB Sub-actions */}
      {fabMenuOpen && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center space-y-4">
          {/* Review button */}
          <div 
            className="flex items-center space-x-3 animate-scale-in"
            style={{ animationDelay: '0.05s' }}
          >
            <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-full shadow-md">
              Revisar
            </span>
            <button
              onClick={() => handleSubAction('review')}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5 text-[#5B6FED]" />
            </button>
          </div>

          {/* Create learning button */}
          <div 
            className="flex items-center space-x-3 animate-scale-in"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-full shadow-md">
              Criar novo aprendizado
            </span>
            <button
              onClick={() => handleSubAction('create')}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <BookOpen className="w-5 h-5 text-[#5B6FED]" />
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 flex justify-center p-6 pointer-events-none z-40">
        {/* Navigation Bar */}
        <nav className="relative bg-white rounded-[32px] px-12 py-6 pointer-events-auto"
             style={{
               boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
             }}>
          
          {/* Navigation Items */}
          <div className="flex items-center justify-between w-48">
            {/* Home Button */}
            <button
              onClick={() => handleItemClick('home', '/')}
              className={`
                w-12 h-12 flex items-center justify-center rounded-full
                transition-all duration-200 ease-out
                ${pressedItem === 'home' ? 'scale-95' : 'hover:scale-105'}
              `}
              aria-label="Home"
            >
              <Home 
                className={`w-6 h-6 transition-colors duration-200 ${
                  activeItem === 'home' ? 'text-[#5B6FED]' : 'text-[#8B92A3]'
                }`}
              />
            </button>

            {/* Empty space for FAB */}
            <div className="w-16" />

            {/* Settings Button */}
            <button
              onClick={() => handleItemClick('settings', '/settings')}
              className={`
                w-12 h-12 flex items-center justify-center rounded-full
                transition-all duration-200 ease-out
                ${pressedItem === 'settings' ? 'scale-95' : 'hover:scale-105'}
              `}
              aria-label="Settings"
            >
              <Settings 
                className={`w-6 h-6 transition-colors duration-200 ${
                  activeItem === 'settings' ? 'text-[#5B6FED]' : 'text-[#8B92A3]'
                }`}
              />
            </button>
          </div>
        </nav>

        {/* Floating Action Button */}
        <button
          onClick={handleFabClick}
          className={`
            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -mt-2
            w-16 h-16 rounded-full flex items-center justify-center
            transition-all duration-200 ease-out z-10
            ${pressedFab ? 'scale-95' : 'hover:scale-105'}
            ${fabMenuOpen ? 'rotate-45' : ''}
          `}
          style={{
            background: 'linear-gradient(135deg, #6B7BF7 0%, #4B5FDD 100%)',
            boxShadow: pressedFab 
              ? '0 4px 8px rgba(91, 111, 237, 0.15)' 
              : '0 8px 16px rgba(91, 111, 237, 0.25)'
          }}
          aria-label="Menu de ações"
        >
          <Plus className="w-6 h-6 text-white transition-transform duration-200" />
        </button>
      </div>
    </>
  );
};

export default FloatingNavigation;
