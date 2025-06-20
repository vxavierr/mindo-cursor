
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

  console.log('FloatingNavigation props:', { onCreateLearning, onReview });

  const handleItemClick = (itemId: string, path: string) => {
    console.log('Nav item clicked:', itemId, path);
    setPressedItem(itemId);
    setTimeout(() => setPressedItem(null), 150);
    onNavigate?.(path);
  };

  const handleFabClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('FAB clicked, current state:', fabMenuOpen);
    setPressedFab(true);
    setTimeout(() => setPressedFab(false), 150);
    setFabMenuOpen(!fabMenuOpen);
  };

  const handleSubAction = (action: 'create' | 'review', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Sub action clicked:', action);
    setFabMenuOpen(false);
    if (action === 'create') {
      console.log('Calling onCreateLearning');
      onCreateLearning?.();
    } else {
      console.log('Calling onReview');
      onReview?.();
    }
  };

  const handleOverlayClick = () => {
    console.log('Overlay clicked, closing menu');
    setFabMenuOpen(false);
  };

  return (
    <>
      {/* Background overlay when FAB menu is open */}
      {fabMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={handleOverlayClick}
        />
      )}

      {/* FAB Sub-actions */}
      {fabMenuOpen && (
        <div className="fixed bottom-36 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center space-y-4">
          {/* Review button */}
          <div 
            className="flex items-center space-x-4 animate-scale-in"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="text-base font-medium text-gray-800 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-100">
              Revisar
            </span>
            <button
              onClick={(e) => handleSubAction('review', e)}
              className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 border border-gray-100"
            >
              <RotateCcw className="w-6 h-6 text-[#5B6FED]" strokeWidth={2.5} />
            </button>
          </div>

          {/* Create learning button */}
          <div 
            className="flex items-center space-x-4 animate-scale-in"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="text-base font-medium text-gray-800 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-100">
              Novo aprendizado
            </span>
            <button
              onClick={(e) => handleSubAction('create', e)}
              className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 border border-gray-100"
            >
              <BookOpen className="w-6 h-6 text-[#5B6FED]" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 flex justify-center p-6 pointer-events-none z-40">
        {/* Navigation Bar with notch for FAB */}
        <nav className="relative bg-white rounded-[28px] px-16 py-6 pointer-events-auto"
             style={{
               boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
               clipPath: 'polygon(0 0, calc(50% - 45px) 0, calc(50% - 38px) 6px, calc(50% - 30px) 12px, calc(50% - 22px) 18px, calc(50% - 14px) 24px, calc(50% - 6px) 30px, calc(50% + 6px) 30px, calc(50% + 14px) 24px, calc(50% + 22px) 18px, calc(50% + 30px) 12px, calc(50% + 38px) 6px, calc(50% + 45px) 0, 100% 0, 100% 100%, 0 100%)'
             }}>
          
          {/* Navigation Items */}
          <div className="flex items-center justify-between w-56">
            {/* Home Button */}
            <button
              onClick={() => handleItemClick('home', '/')}
              className={`
                w-14 h-14 flex items-center justify-center rounded-full
                transition-all duration-200 ease-out
                ${pressedItem === 'home' ? 'scale-95 bg-gray-100' : 'hover:scale-105 hover:bg-gray-50'}
              `}
              aria-label="Home"
            >
              <Home 
                className={`w-7 h-7 transition-colors duration-200 ${
                  activeItem === 'home' ? 'text-[#5B6FED]' : 'text-[#6B7280]'
                }`}
                strokeWidth={2.5}
              />
            </button>

            {/* Empty space for FAB */}
            <div className="w-20" />

            {/* Settings Button */}
            <button
              onClick={() => handleItemClick('settings', '/settings')}
              className={`
                w-14 h-14 flex items-center justify-center rounded-full
                transition-all duration-200 ease-out
                ${pressedItem === 'settings' ? 'scale-95 bg-gray-100' : 'hover:scale-105 hover:bg-gray-50'}
              `}
              aria-label="Settings"
            >
              <Settings 
                className={`w-7 h-7 transition-colors duration-200 ${
                  activeItem === 'settings' ? 'text-[#5B6FED]' : 'text-[#6B7280]'
                }`}
                strokeWidth={2.5}
              />
            </button>
          </div>
        </nav>

        {/* Floating Action Button */}
        <button
          onClick={handleFabClick}
          className={`
            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -mt-6
            w-18 h-18 rounded-full flex items-center justify-center
            transition-all duration-300 ease-out z-10 pointer-events-auto
            ${pressedFab ? 'scale-95' : 'hover:scale-105'}
            ${fabMenuOpen ? 'rotate-45' : ''}
          `}
          style={{
            background: 'linear-gradient(135deg, #6B7BF7 0%, #4B5FDD 100%)',
            boxShadow: pressedFab 
              ? '0 6px 12px rgba(91, 111, 237, 0.3)' 
              : '0 12px 24px rgba(91, 111, 237, 0.4)'
          }}
          aria-label="Menu de ações"
        >
          <Plus className="w-7 h-7 text-white transition-transform duration-300" strokeWidth={2.5} />
        </button>
      </div>
    </>
  );
};

export default FloatingNavigation;
