
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
        {/* Header Melhorado */}
        <header className="px-6 py-6 flex justify-between items-center bg-white border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              SL
            </div>
            <h1 className="text-xl font-semibold text-gray-900">SpaceLearn</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <StreakBadge days={0} label="Hoje" />
            
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
        </header>

        {/* Navegação por Data */}
        <DateNavigation 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {/* Toggle de Visualização */}
        <ViewToggle 
          label="Vista Compacta"
          defaultValue={compactView}
          onChange={setCompactView}
        />

        <div className="max-w-3xl mx-auto px-6">
          {/* Hero Section */}
          <div className="py-16 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que você aprendeu hoje?
            </h2>
            <p className="text-lg text-gray-600 mb-12 font-medium">
              Registre e organize seus aprendizados
            </p>

            {/* Review Badge */}
            {reviewsToday.length > 0 && (
              <div className="mb-12">
                <Button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-white hover:bg-red-50 text-red-700 border-2 border-red-200 hover:border-red-300 rounded-full px-8 py-3 text-base font-semibold transition-all duration-200"
                  style={{ boxShadow: '0 6px 20px rgba(239, 68, 68, 0.15)' }}
                >
                  {reviewsToday.length} revisão{reviewsToday.length > 1 ? 'ões' : ''} pendente{reviewsToday.length > 1 ? 's' : ''}
                </Button>
              </div>
            )}
          </div>

          {/* Enhanced Learning Entries */}
          <div className="pb-20">
            <EnhancedTodaysLearning 
              entries={todaysEntries}
              onDelete={handleDeleteEntry}
              compact={compactView}
            />
          </div>
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
