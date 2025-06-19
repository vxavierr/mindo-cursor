
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, User, Settings, Moon, Sun, LogOut, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import ChatInterface from '@/components/learning/ChatInterface';
import ReviewCards from '@/components/learning/ReviewCards';
import StatsPanel from '@/components/learning/StatsPanel';
import SettingsPanel from '@/components/settings/SettingsPanel';

interface DashboardProps {
  user: any;
  onLogout: () => void;
  toggleTheme: () => void;
  darkMode: boolean;
}

const Dashboard = ({ user, onLogout, toggleTheme, darkMode }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('learn');
  const [learningEntries, setLearningEntries] = useState([]);
  const [reviewsToday, setReviewsToday] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    // Load mock data
    const mockEntries = [
      {
        id: '0001',
        content: 'JavaScript closures são funções que têm acesso ao escopo externo mesmo após a função externa ter retornado',
        context: 'Estudando conceitos avançados de JavaScript',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        step: 1,
        nextReview: new Date()
      }
    ];
    setLearningEntries(mockEntries);
    setReviewsToday(mockEntries.filter(entry => entry.nextReview <= new Date()));
  }, []);

  const addLearningEntry = (content: string, context?: string) => {
    const newEntry = {
      id: String(learningEntries.length + 1).padStart(4, '0'),
      content,
      context: context || '',
      createdAt: new Date(),
      step: 0,
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
    };
    setLearningEntries([...learningEntries, newEntry]);
  };

  const completeReview = (entryId: string) => {
    setLearningEntries(entries => 
      entries.map(entry => {
        if (entry.id === entryId) {
          const intervals = [1, 3, 7, 14, 30, 60]; // days
          const nextStep = Math.min(entry.step + 1, intervals.length - 1);
          const nextReview = new Date(Date.now() + intervals[nextStep] * 24 * 60 * 60 * 1000);
          return { ...entry, step: nextStep, nextReview };
        }
        return entry;
      })
    );
    setReviewsToday(reviews => reviews.filter(review => review.id !== entryId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SpaceLearn</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Olá, {user.name}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-gray-600 dark:text-gray-300"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-gray-600 dark:text-gray-300 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'learn', label: 'Aprender', icon: BookOpen },
              { id: 'review', label: 'Revisar', icon: Calendar, badge: reviewsToday.length },
              { id: 'stats', label: 'Estatísticas', icon: TrendingUp },
              { id: 'settings', label: 'Configurações', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  {tab.badge && tab.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {activeTab === 'learn' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                O que você aprendeu hoje?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Digite naturalmente seus aprendizados e deixe o sistema cuidar das revisões
              </p>
            </div>
            <ChatInterface onAddEntry={addLearningEntry} />
          </div>
        )}

        {activeTab === 'review' && (
          <div className="max-w-4xl mx-auto">
            <ReviewCards 
              reviews={reviewsToday} 
              onCompleteReview={completeReview}
            />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="max-w-6xl mx-auto">
            <StatsPanel entries={learningEntries} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto">
            <SettingsPanel 
              isOpen={true}
              onClose={() => setActiveTab('learn')}
              entries={learningEntries}
              onImport={() => {}}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
