
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
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8">
        {/* Hero Section */}
        <div className="py-16 text-center">
          <h2 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
            O que você aprendeu hoje?
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed">
            Registre seus aprendizados e deixe que a revisão espaçada cuide do resto
          </p>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Button
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto h-14 px-8 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-full text-base font-medium transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Aprendizado
            </Button>

            <Button
              onClick={() => setShowReviewModal(true)}
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full text-base font-medium transition-all duration-200 relative"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Revisar
              {reviewsToday.length > 0 && (
                <span className="ml-2 w-6 h-6 bg-red-500 text-white text-sm rounded-full flex items-center justify-center">
                  {reviewsToday.length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview 
          totalEntries={learningEntries.length}
          reviewsToday={reviewsToday.length}
          entries={learningEntries}
        />

        {/* Learning Grid */}
        <div className="pb-16">
          <LearningGrid entries={learningEntries} />
        </div>
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
