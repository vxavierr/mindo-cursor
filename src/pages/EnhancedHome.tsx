
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Moon, Sun } from 'lucide-react';
import CleanAddLearningModal from '@/components/learning/CleanAddLearningModal';
import EnhancedTodaysLearning from '@/components/learning/EnhancedTodaysLearning';
import ReviewModal from '@/components/learning/ReviewModal';
import NavigationLayout from '@/components/layout/NavigationLayout';
import DateNavigation from '@/components/navigation/DateNavigation';
import ViewToggle from '@/components/ui/ViewToggle';
import StreakBadge from '@/components/ui/StreakBadge';
import { useCleanLearning } from '@/hooks/useCleanLearning';
import { useReviewSystem } from '@/hooks/useReviewSystem';
import { useNotifications } from '@/hooks/useNotifications';

const EnhancedHome = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const {
    learningEntries,
    todaysEntries,
    loading,
    addLearningEntry,
    updateLearningEntry,
    deleteEntry,
    completeReview
  } = useCleanLearning();

  const { reviewsToday } = useReviewSystem(learningEntries);

  const {
    permission,
    requestPermission,
    scheduleDailyReminder
  } = useNotifications();

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

  const handleDeleteEntry = async (entryId: string) => {
    await deleteEntry(entryId);
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
        {/* Header Responsivo - Enhanced with transitions */}
        <header className="w-full responsive-padding flex justify-between items-center bg-white border-b border-gray-100 header-transition">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              SL
            </div>
            <h1 className="text-xl font-semibold text-gray-900 text-transition">SpaceLearn</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <StreakBadge days={0} label="Hoje" />
            
            {permission !== 'granted' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={requestPermission}
                className="text-gray-600 hover:bg-gray-100 text-sm px-4 h-9 font-medium btn-press-effect"
              >
                🔔
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0 text-gray-600 hover:bg-gray-100 btn-press-effect"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </header>

        {/* Navegação por Data - Enhanced responsive container */}
        <div className="w-full bg-white border-b border-gray-100">
          <div className="container-responsive responsive-padding">
            <div className="max-w-[800px] mx-auto">
              <DateNavigation 
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
          </div>
        </div>

        {/* Toggle de Visualização - Enhanced responsive */}
        <div className="w-full bg-white border-b border-gray-100">
          <div className="container-responsive responsive-padding flex justify-end">
            <ViewToggle 
              label="Vista Compacta"
              defaultValue={compactView}
              onChange={setCompactView}
            />
          </div>
        </div>

        {/* Hero Section - Enhanced responsive */}
        <div className="container-responsive responsive-padding text-center content-transition">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-transition">
            O que você aprendeu hoje?
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-8 font-medium text-transition">
            Registre e organize seus aprendizados
          </p>

          {/* Review Badge - Enhanced with transitions */}
          {reviewsToday.length > 0 && (
            <div className="mb-8 flex justify-center">
              <Button
                onClick={() => setShowReviewModal(true)}
                className="bg-white hover:bg-red-50 text-red-700 border-2 border-red-200 hover:border-red-300 rounded-full px-8 py-3 text-base font-semibold btn-press-effect"
                style={{ boxShadow: '0 6px 20px rgba(239, 68, 68, 0.15)' }}
              >
                {reviewsToday.length} revisões pendentes
              </Button>
            </div>
          )}
        </div>

        {/* Conteúdo Principal - Enhanced responsive container */}
        <div className="container-responsive responsive-padding pb-24 md:pb-32 content-transition">
          <EnhancedTodaysLearning 
            entries={todaysEntries}
            onDelete={handleDeleteEntry}
            onUpdate={handleUpdateLearning}
            compact={compactView}
          />
        </div>

        {/* Add Learning Modal */}
        <CleanAddLearningModal 
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddLearning}
        />

        {/* Review Modal */}
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          reviews={reviewsToday}
          onCompleteReview={handleCompleteReview}
        />
      </div>
    </NavigationLayout>
  );
};

export default EnhancedHome;
