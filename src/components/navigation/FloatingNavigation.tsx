
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
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300 animate-fade-in"
          onClick={handleOverlayClick}
        />
      )}

      {/* FAB Sub-actions */}
      {fabMenuOpen && (
        <div className="fixed bottom-36 md:bottom-44 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center space-y-4">
          {/* Review button */}
          <div 
            className="flex items-center space-x-4 animate-scale-in"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="text-base font-medium text-gray-800 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-100 transition-all duration-200 hover:scale-105">
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
            <span className="text-base font-medium text-gray-800 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-100 transition-all duration-200 hover:scale-105">
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

      {/* Mobile: Enhanced responsive navigation */}
      <div className="md:hidden w-full bg-white border-t border-gray-100 pointer-events-auto">
        <div className="flex items-center justify-between px-8 py-4 transition-all duration-300">
          {/* Home Button */}
          <button
            onClick={() => handleItemClick('home', '/')}
            className={`
              w-12 h-12 flex items-center justify-center rounded-full
              transition-all duration-200 ease-out
              ${pressedItem === 'home' ? 'scale-95 bg-gray-100' : 'hover:scale-105 hover:bg-gray-50'}
            `}
            aria-label="Home"
          >
            <Home 
              className={`w-6 h-6 transition-colors duration-200 ${
                activeItem === 'home' ? 'text-[#5B6FED]' : 'text-[#6B7280]'
              }`}
              strokeWidth={2.5}
            />
          </button>

          {/* FAB - Enhanced responsive behavior */}
          <button
            onClick={handleFabClick}
            className={`
              w-14 h-14 rounded-full flex items-center justify-center
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
            <Plus className="w-6 h-6 text-white transition-transform duration-300" strokeWidth={2.5} />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => handleItemClick('settings', '/settings')}
            className={`
              w-12 h-12 flex items-center justify-center rounded-full
              transition-all duration-200 ease-out
              ${pressedItem === 'settings' ? 'scale-95 bg-gray-100' : 'hover:scale-105 hover:bg-gray-50'}
            `}
            aria-label="Settings"
          >
            <Settings 
              className={`w-6 h-6 transition-colors duration-200 ${
                activeItem === 'settings' ? 'text-[#5B6FED]' : 'text-[#6B7280]'
              }`}
              strokeWidth={2.5}
            />
          </button>
        </div>
      </div>

      {/* Desktop: Enhanced responsive floating navigation */}
      <div className="hidden md:flex justify-center items-center pointer-events-none">
        <nav className="relative bg-white rounded-[32px] px-6 py-3 pointer-events-auto flex items-center gap-8 transition-all duration-300"
             style={{
               boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
             }}>
          
          {/* Navigation Items */}
          <div className="flex items-center gap-8 transition-all duration-300">
            {/* Home Button */}
            <button
              onClick={() => handleItemClick('home', '/')}
              className={`
                w-12 h-12 flex items-center justify-center rounded-full
                transition-all duration-200 ease-out
                ${pressedItem === 'home' ? 'scale-95 bg-gray-100' : 'hover:scale-105 hover:bg-gray-50'}
              `}
              aria-label="Home"
            >
              <Home 
                className={`w-6 h-6 transition-colors duration-200 ${
                  activeItem === 'home' ? 'text-[#5B6FED]' : 'text-[#6B7280]'
                }`}
                strokeWidth={2.5}
              />
            </button>

            {/* FAB */}
            <button
              onClick={handleFabClick}
              className={`
                w-14 h-14 rounded-full flex items-center justify-center
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
              <Plus className="w-6 h-6 text-white transition-transform duration-300" strokeWidth={2.5} />
            </button>

            {/* Settings Button */}
            <button
              onClick={() => handleItemClick('settings', '/settings')}
              className={`
                w-12 h-12 flex items-center justify-center rounded-full
                transition-all duration-200 ease-out
                ${pressedItem === 'settings' ? 'scale-95 bg-gray-100' : 'hover:scale-105 hover:bg-gray-50'}
              `}
              aria-label="Settings"
            >
              <Settings 
                className={`w-6 h-6 transition-colors duration-200 ${
                  activeItem === 'settings' ? 'text-[#5B6FED]' : 'text-[#6B7280]'
                }`}
                strokeWidth={2.5}
              />
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default FloatingNavigation;
