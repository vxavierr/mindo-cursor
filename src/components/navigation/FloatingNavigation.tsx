
import React, { useState } from 'react';
import { Home, Search, Calendar, User, Plus } from 'lucide-react';

interface NavigationItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

const navigationItems: NavigationItem[] = [
  { id: 'home', icon: Home, label: 'Home', path: '/' },
  { id: 'search', icon: Search, label: 'Buscar', path: '/search' },
  { id: 'calendar', icon: Calendar, label: 'Revisões', path: '/reviews' },
  { id: 'profile', icon: User, label: 'Perfil', path: '/profile' },
];

interface FloatingNavigationProps {
  activeItem?: string;
  onNavigate?: (path: string) => void;
  onFabClick?: () => void;
}

const FloatingNavigation = ({ 
  activeItem = 'home', 
  onNavigate,
  onFabClick 
}: FloatingNavigationProps) => {
  const [pressedItem, setPressedItem] = useState<string | null>(null);
  const [pressedFab, setPressedFab] = useState(false);

  const handleItemClick = (item: NavigationItem) => {
    setPressedItem(item.id);
    setTimeout(() => setPressedItem(null), 100);
    onNavigate?.(item.path);
  };

  const handleFabClick = () => {
    setPressedFab(true);
    setTimeout(() => setPressedFab(false), 100);
    onFabClick?.();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center p-6 pointer-events-none">
      {/* Navigation Bar */}
      <nav className="relative bg-white rounded-[32px] px-8 py-6 pointer-events-auto"
           style={{
             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
           }}>
        
        {/* Navigation Items */}
        <div className="flex items-center justify-between space-x-12">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            const isPressed = pressedItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`
                  w-12 h-12 flex items-center justify-center rounded-full
                  transition-all duration-200 ease-out
                  ${isPressed ? 'scale-95' : 'hover:scale-105'}
                  ${index === 1 ? 'mr-8' : ''}
                  ${index === 2 ? 'ml-8' : ''}
                `}
                aria-label={item.label}
              >
                <Icon 
                  className={`w-6 h-6 transition-colors duration-200 ${
                    isActive ? 'text-[#5B6FED]' : 'text-[#8B92A3]'
                  }`}
                  strokeWidth={2}
                />
              </button>
            );
          })}
        </div>
        
        {/* Floating Action Button */}
        <button
          onClick={handleFabClick}
          className={`
            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            w-16 h-16 rounded-full flex items-center justify-center
            transition-all duration-200 ease-out
            ${pressedFab ? 'scale-95' : 'hover:scale-105'}
          `}
          style={{
            background: 'linear-gradient(135deg, #6B7BF7 0%, #4B5FDD 100%)',
            boxShadow: pressedFab 
              ? '0 4px 8px rgba(91, 111, 237, 0.15)' 
              : '0 8px 16px rgba(91, 111, 237, 0.25)'
          }}
          aria-label="Novo aprendizado"
        >
          <Plus className="w-6 h-6 text-white" strokeWidth={2} />
        </button>
      </nav>
    </div>
  );
};

export default FloatingNavigation;
