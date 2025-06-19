import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Plus, Calendar, Settings, Moon, Sun } from 'lucide-react';
import AddLearningModal from '@/components/learning/AddLearningModal';
import ReviewModal from '@/components/learning/ReviewModal';
import StatsOverview from '@/components/dashboard/StatsOverview';
import LearningGrid from '@/components/dashboard/LearningGrid';
import SettingsPanel from '@/components/settings/SettingsPanel';

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [learningEntries, setLearningEntries] = useState([]);
  const [reviewsToday, setReviewsToday] = useState([]);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Load learning entries from localStorage
    const saved = localStorage.getItem('learningEntries');
    if (saved) {
      const entries = JSON.parse(saved);
      setLearningEntries(entries);
      calculateReviewsToday(entries);
    }
  }, []);

  const calculateReviewsToday = (entries) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const intervals = [1, 3, 7, 14, 30, 60]; // days
    
    const reviewsNeeded = entries.filter(entry => {
      if (entry.completed) return false;
      
      const createdDate = new Date(entry.createdAt);
      createdDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      const currentStep = entry.step || 0;
      
      return daysDiff >= intervals[currentStep];
    });
    
    setReviewsToday(reviewsNeeded);
  };

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

  const addLearningEntry = (content, context, tags) => {
    const newEntry = {
      id: String(learningEntries.length + 1).padStart(4, '0'),
      content,
      context: context || '',
      tags: tags || [],
      createdAt: new Date().toISOString(),
      step: 0,
      completed: false,
      reviews: []
    };
    
    const updatedEntries = [...learningEntries, newEntry];
    setLearningEntries(updatedEntries);
    localStorage.setItem('learningEntries', JSON.stringify(updatedEntries));
    calculateReviewsToday(updatedEntries);
  };

  const completeReview = (entryId, questions, answers) => {
    const updatedEntries = learningEntries.map(entry => {
      if (entry.id === entryId) {
        const newStep = Math.min((entry.step || 0) + 1, 5);
        return {
          ...entry,
          step: newStep,
          reviews: [...(entry.reviews || []), {
            date: new Date().toISOString(),
            questions,
            answers,
            step: newStep
          }]
        };
      }
      return entry;
    });
    
    setLearningEntries(updatedEntries);
    localStorage.setItem('learningEntries', JSON.stringify(updatedEntries));
    calculateReviewsToday(updatedEntries);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50'
    }`}>
      {/* Header */}
      <header className="px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SpaceLearn</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Aprenda mais, lembre melhor</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
            className="rounded-full text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 pb-12">
        {/* Stats Overview */}
        <StatsOverview 
          totalEntries={learningEntries.length}
          reviewsToday={reviewsToday.length}
          entries={learningEntries}
        />

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
          <Card 
            onClick={() => setShowAddModal(true)}
            className={`p-8 cursor-pointer transition-all duration-300 hover:scale-105 border-0 shadow-xl ${
              darkMode 
                ? 'bg-gradient-to-br from-blue-600 to-purple-700 hover:from-blue-500 hover:to-purple-600' 
                : 'bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400'
            }`}
          >
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Novo</h3>
              <p className="text-white/80">Registre um novo aprendizado</p>
            </div>
          </Card>

          <Card 
            onClick={() => setShowReviewModal(true)}
            className={`p-8 cursor-pointer transition-all duration-300 hover:scale-105 border-0 shadow-xl relative ${
              darkMode 
                ? 'bg-gradient-to-br from-purple-600 to-pink-700 hover:from-purple-500 hover:to-pink-600' 
                : 'bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500'
            }`}
          >
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Revisar</h3>
              <p className="text-white/80">
                {reviewsToday.length > 0 
                  ? `${reviewsToday.length} revisão${reviewsToday.length > 1 ? 'ões' : ''} pendente${reviewsToday.length > 1 ? 's' : ''}`
                  : 'Nenhuma revisão pendente'
                }
              </p>
              {reviewsToday.length > 0 && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {reviewsToday.length}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Learning Grid */}
        <LearningGrid entries={learningEntries} />
      </div>

      {/* Modals */}
      <AddLearningModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addLearningEntry}
        existingTags={[...new Set(learningEntries.flatMap(e => e.tags))]}
      />

      <ReviewModal 
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        reviews={reviewsToday}
        onComplete={completeReview}
      />

      <SettingsPanel 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        entries={learningEntries}
        onImport={setLearningEntries}
      />
    </div>
  );
};

export default Index;
