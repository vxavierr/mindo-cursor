
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Plus, BarChart3, Search, Calendar, Settings, Moon, Sun } from 'lucide-react';
import SmartAddLearningModal from '@/components/learning/SmartAddLearningModal';
import TodaysLearning from '@/components/learning/TodaysLearning';
import { useUnifiedLearning } from '@/hooks/useUnifiedLearning';
import { useNotifications } from '@/hooks/useNotifications';

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    todaysEntries,
    reviewsToday,
    loading,
    addLearningEntry,
    deleteEntry
  } = useUnifiedLearning();

  const {
    permission,
    requestPermission,
    scheduleDailyReminder
  } = useNotifications();

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Schedule daily notifications
  useEffect(() => {
    if (reviewsToday.length > 0) {
      scheduleDailyReminder(reviewsToday.length);
    }
  }, [reviewsToday.length, scheduleDailyReminder]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleAddLearning = async (content: string, title: string, tags: string[]) => {
    await addLearningEntry(content, title, tags);
    setShowAddModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center animate-pulse">
            <Brain className="w-5 h-5 text-white dark:text-black" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Carregando seus aprendizados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-900' 
        : 'bg-white'
    }`}>
      {/* Header */}
      <header className="px-8 py-8 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-white dark:text-black" />
          </div>
          <div>
            <h1 className="text-xl font-medium text-gray-900 dark:text-white">SpaceLearn</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Top buttons - Analytics and Search */}
          <Button
            variant="ghost" 
            size="sm"
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            Analytics
          </Button>
          
          <Button
            variant="ghost"
            size="sm" 
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Search className="w-5 h-5 mr-2" />
            Buscar
          </Button>

          {/* Notifications */}
          {permission !== 'granted' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={requestPermission}
              className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              🔔 Ativar Notificações
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8">
        {/* Hero Section */}
        <div className="py-16 text-center">
          <h2 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
            O que você aprendeu hoje?
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed">
            Registre seus aprendizados
          </p>

          {/* Main Action Button */}
          <div className="flex justify-center mb-20">
            <Button
              onClick={() => setShowAddModal(true)}
              className="h-14 px-8 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-full text-base font-medium transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Aprendizado
            </Button>
          </div>

          {/* Reviews Badge */}
          {reviewsToday.length > 0 && (
            <div className="mb-12">
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {reviewsToday.length} revisão{reviewsToday.length > 1 ? 'ões' : ''} pendente{reviewsToday.length > 1 ? 's' : ''}
              </Button>
            </div>
          )}
        </div>

        {/* Today's Learning Entries */}
        <div className="pb-16">
          <TodaysLearning 
            entries={todaysEntries}
            onDelete={deleteEntry}
          />
        </div>
      </div>

      {/* Add Learning Modal */}
      <SmartAddLearningModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddLearning}
      />
    </div>
  );
};

export default Index;
