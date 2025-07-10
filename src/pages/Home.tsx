import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Moon, Sun, Menu, Brush } from 'lucide-react';
import AddLearningModal from '@/components/learning/AddLearningModal';
import ReviewModal from '@/components/learning/ReviewModal';
import NavigationLayout from '@/components/layout/NavigationLayout';
import DateNavigation from '@/components/navigation/DateNavigation';
import { useLearning } from '@/hooks/useLearning';
import { useNotifications } from '@/hooks/useNotifications';
import LearningCardList from '@/components/learning/LearningCardList';
import { useLearningCardLayout } from '@/components/learning/LearningCardLayoutContext';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

const Home = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const {
    learningEntries,
    todaysEntries,
    reviewsToday,
    loading,
    addLearningEntry,
    updateLearningEntry,
    completeReview,
    deleteEntry
  } = useLearning();

  const {
    permission,
    requestPermission,
    scheduleDailyReminder
  } = useNotifications();

  const { layout, setLayout } = useLearningCardLayout();
  const { toast } = useToast();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    if (reviewsToday.length > 0) {
      scheduleDailyReminder(reviewsToday.length);
    }
  }, [reviewsToday.length, scheduleDailyReminder]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleAddLearning = async (content: string, title: string, tags: string[]) => {
    await addLearningEntry(content, title, tags);
    setShowAddModal(false);
  };

  const handleUpdateLearning = async (entryId: string, updates: { title?: string; content?: string; tags?: string[]; context?: string }) => {
    return await updateLearningEntry(entryId, updates);
  };

  const handleCompleteReview = async (entryId: string, difficulty: 'easy' | 'medium' | 'hard', questions: string[], answers: string[]) => {
    await completeReview(entryId, difficulty, questions, answers);
  };

  const handleNavigate = (path: string) => {
    console.log('Navigate to:', path);
  };

  const handleCreateLearning = () => {
    setShowAddModal(true);
  };

  const handleReview = () => {
    setShowReviewModal(true);
  };

  if (loading) {
    return (
      <NavigationLayout activeNavItem="home">
        <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#f5f5f7' }}>
          <div className="text-center space-y-4">
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center animate-pulse">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <p className="text-gray-700 font-medium text-lg">Carregando...</p>
          </div>
        </div>
      </NavigationLayout>
    );
  }

  return (
    <NavigationLayout 
      activeNavItem="home"
      onNavigate={handleNavigate}
      onCreateLearning={handleCreateLearning}
      onReview={handleReview}
    >
      <div style={{ backgroundColor: '#f5f5f7', minHeight: '100vh' }}>
        {/* Header Responsivo */}
        <header className="w-full py-4 md:py-6 lg:py-8 flex justify-between items-center bg-white border-b border-gray-100 px-4 md:px-6 lg:px-8">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div 
              className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-lg"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              SL
            </div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">SpaceLearn</h1>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 text-white shadow-md hover:scale-105 transition-all duration-200 border-0"
                  aria-label="Alternar layout dos cards"
                  style={{ fontWeight: 'bold' }}
                >
                  <Brush className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                side="bottom" 
                align="center"
                sideOffset={4}
              >
                <DropdownMenuLabel>Estilo dos Cards</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={layout === 'default'}
                  onCheckedChange={() => {
                    setLayout('default');
                    toast({
                      title: `Layout dos cards alterado`,
                      description: `Agora em modo: Padrão`,
                      duration: 2000
                    });
                  }}
                >
                  Padrão
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={layout === 'clean'}
                  onCheckedChange={() => {
                    setLayout('clean');
                    toast({
                      title: `Layout dos cards alterado`,
                      description: `Agora em modo: Clean`,
                      duration: 2000
                    });
                  }}
                >
                  Clean
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={layout === 'enhanced'}
                  onCheckedChange={() => {
                    setLayout('enhanced');
                    toast({
                      title: `Layout dos cards alterado`,
                      description: `Agora em modo: Colorido`,
                      duration: 2000
                    });
                  }}
                >
                  Colorido
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {permission !== 'granted' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={requestPermission}
                className="text-gray-600 hover:bg-gray-100 text-sm px-4 h-9 font-medium"
              >
                🔔
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0 text-gray-600 hover:bg-gray-100"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 text-white shadow-md hover:scale-105 transition-all duration-200 border-0"
                  aria-label="Alternar layout dos cards"
                  style={{ fontWeight: 'bold' }}
                >
                  <Brush className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                side="bottom" 
                align="center"
                sideOffset={4}
              >
                <DropdownMenuLabel>Estilo dos Cards</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={layout === 'default'}
                  onCheckedChange={() => {
                    setLayout('default');
                    toast({
                      title: `Layout dos cards alterado`,
                      description: `Agora em modo: Padrão`,
                      duration: 2000
                    });
                  }}
                >
                  Padrão
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={layout === 'clean'}
                  onCheckedChange={() => {
                    setLayout('clean');
                    toast({
                      title: `Layout dos cards alterado`,
                      description: `Agora em modo: Clean`,
                      duration: 2000
                    });
                  }}
                >
                  Clean
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={layout === 'enhanced'}
                  onCheckedChange={() => {
                    setLayout('enhanced');
                    toast({
                      title: `Layout dos cards alterado`,
                      description: `Agora em modo: Colorido`,
                      duration: 2000
                    });
                  }}
                >
                  Colorido
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="w-8 h-8 p-0 text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Dropdown Menu */}
          {showMobileMenu && (
            <div className="absolute top-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 md:hidden">
              {permission !== 'granted' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={requestPermission}
                  className="w-full justify-start text-gray-600 hover:bg-gray-100 text-sm mb-1"
                >
                  🔔 Notificações
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-full justify-start text-gray-600 hover:bg-gray-100 text-sm"
              >
                {darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                {darkMode ? 'Modo Claro' : 'Modo Escuro'}
              </Button>
            </div>
          )}
        </header>

        {/* Navegação por Data */}
        <div className="w-full bg-white border-b border-gray-100">
          <DateNavigation 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* Hero Section */}
        <div className="w-full py-6 md:py-8 lg:py-12 text-center px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              O que você aprendeu hoje?
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 mb-6 md:mb-8 font-medium">
              Registre e organize seus aprendizados
            </p>

            {/* Review Badge */}
            {reviewsToday.length > 0 && (
              <div className="mb-6 md:mb-8 flex justify-center">
                <Button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-white hover:bg-red-50 text-red-700 border-2 border-red-200 hover:border-red-300 rounded-full px-6 md:px-8 py-2 md:py-3 text-sm md:text-base font-semibold transition-all duration-200"
                  style={{ boxShadow: '0 6px 20px rgba(239, 68, 68, 0.15)' }}
                >
                  {reviewsToday.length} revisões pendentes
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="w-full px-4 md:px-6 lg:px-8 pb-24 md:pb-32">
          <div className="max-w-7xl mx-auto">
            <LearningCardList
              entries={todaysEntries.filter(e => e.step !== -1)}
              onDelete={async (entryId) => {
                await deleteEntry(entryId);
              }}
              onUpdate={handleUpdateLearning}
              desktopLayout={true}
            />
          </div>
        </div>

        {/* Add Learning Modal */}
        <AddLearningModal 
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddLearning}
        />

        {/* Review Modal */}
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          reviews={reviewsToday.filter(e => e.step !== -1)}
          onCompleteReview={handleCompleteReview}
        />
      </div>
    </NavigationLayout>
  );
};

export default Home; 