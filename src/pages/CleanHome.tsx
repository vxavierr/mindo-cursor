
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
    // Implementar navegação aqui se necessário
  };

  const handleCreateLearning = () => {
    console.log('FAB - Create Learning clicked!');
    setShowAddModal(true);
  };

  const handleReview = () => {
    console.log('FAB - Review clicked!');
    setShowReviewModal(true);
  };

  console.log('CleanHome rendered, FAB handlers:', { handleCreateLearning, handleReview });

  if (loading) {
    return (
      <NavigationLayout activeNavItem="home">
        <div className="flex items-center justify-center h-screen">
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
      {/* Header */}
      <header className="px-6 py-6 flex justify-between items-center bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">SpaceLearn</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {permission !== 'granted' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={requestPermission}
              className="text-gray-600 hover:bg-gray-100 text-sm px-4 h-9 font-medium"
            >
              🔔 Notificações
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

        {/* Today's Learning Entries */}
        <div className="pb-20">
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
