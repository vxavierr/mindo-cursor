
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Plus, Calendar, Moon, Sun } from 'lucide-react';
import CleanAddLearningModal from '@/components/learning/CleanAddLearningModal';
import CleanTodaysLearning from '@/components/learning/CleanTodaysLearning';
import ReviewModal from '@/components/learning/ReviewModal';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center animate-pulse">
            <Brain className="w-5 h-5 text-white dark:text-gray-900" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-light">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center">
            <Brain className="w-4 h-4 text-white dark:text-gray-900" />
          </div>
          <h1 className="text-lg font-light text-gray-900 dark:text-white">SpaceLearn</h1>
        </div>
        
        <div className="flex items-center space-x-1">
          {permission !== 'granted' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={requestPermission}
              className="text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs px-3 h-8"
            >
              🔔 Notificações
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-8 h-8 p-0 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6">
        {/* Hero Section */}
        <div className="py-16 text-center">
          <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-3">
            O que você aprendeu hoje?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-12 font-light">
            Registre e organize seus aprendizados
          </p>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-3 mb-16">
            <Button
              onClick={() => setShowAddModal(true)}
              className="h-11 px-6 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 text-white rounded-full font-light"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Aprendizado
            </Button>

            <Button
              onClick={() => setShowReviewModal(true)}
              variant="outline"
              className="h-11 px-6 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full font-light relative"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Revisar
              {reviewsToday.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {reviewsToday.length}
                </span>
              )}
            </Button>
          </div>
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
    </div>
  );
};

export default CleanHome;
