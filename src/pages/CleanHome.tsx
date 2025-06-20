
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Moon, Sun } from 'lucide-react';
import CleanAddLearningModal from '@/components/learning/CleanAddLearningModal';
import CleanTodaysLearning from '@/components/learning/CleanTodaysLearning';
import ReviewModal from '@/components/learning/ReviewModal';
import NavigationLayout from '@/components/layout/NavigationLayout';
import { useCleanLearning } from '@/hooks/useCleanLearning';
import { useReviewSystem } from '@/hooks/useReviewSystem';
import { useNotifications } from '@/hooks/useNotifications';
import { useEffect } from 'react';

const CleanHome = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

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
    // Implementar navegação aqui
  };

  const handleFabClick = () => {
    setShowAddModal(true);
  };

  if (loading) {
    return (
      <NavigationLayout activeNavItem="home">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center animate-pulse">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <p className="text-gray-500 font-light">Carregando...</p>
          </div>
        </div>
      </NavigationLayout>
    );
  }

  return (
    <NavigationLayout 
      activeNavItem="home"
      onNavigate={handleNavigate}
      onFabClick={handleFabClick}
    >
      {/* Header */}
      <header className="px-6 py-6 flex justify-between items-center bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-light text-gray-900">SpaceLearn</h1>
        </div>
        
        <div className="flex items-center space-x-1">
          {permission !== 'granted' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={requestPermission}
              className="text-gray-500 hover:bg-gray-50 text-xs px-3 h-8"
            >
              🔔 Notificações
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-8 h-8 p-0 text-gray-500 hover:bg-gray-50"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6">
        {/* Hero Section */}
        <div className="py-16 text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-3">
            O que você aprendeu hoje?
          </h2>
          <p className="text-gray-500 mb-12 font-light">
            Registre e organize seus aprendizados
          </p>

          {/* Review Badge */}
          {reviewsToday.length > 0 && (
            <div className="mb-12">
              <Button
                onClick={() => setShowReviewModal(true)}
                className="bg-white hover:bg-gray-50 text-red-600 border border-red-200 rounded-full px-6 py-2 text-sm font-medium"
                style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)' }}
              >
                {reviewsToday.length} revisão{reviewsToday.length > 1 ? 'ões' : ''} pendente{reviewsToday.length > 1 ? 's' : ''}
              </Button>
            </div>
          )}
        </div>

        {/* Today's Learning Entries */}
        <div className="pb-16">
          <CleanTodaysLearning 
            entries={todaysEntries}
            onDelete={deleteEntry}
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
    </NavigationLayout>
  );
};

export default CleanHome;
