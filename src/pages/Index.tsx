
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Plus, Calendar, Settings, Moon, Sun, BarChart3 } from 'lucide-react';
import AddLearningModal from '@/components/learning/AddLearningModal';
import ReviewModal from '@/components/learning/ReviewModal';
import StatsOverview from '@/components/dashboard/StatsOverview';
import LearningGrid from '@/components/dashboard/LearningGrid';
import SearchAndFilters from '@/components/learning/SearchAndFilters';
import LearningAnalytics from '@/components/analytics/LearningAnalytics';
import SettingsPanel from '@/components/settings/SettingsPanel';
import { useSupabaseLearning } from '@/hooks/useSupabaseLearning';
import { useNotifications } from '@/hooks/useNotifications';
import { SpacedRepetitionEngine } from '@/utils/spacedRepetition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRange } from 'react-day-picker';

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Filtros para busca
  const [filters, setFilters] = useState({
    query: '',
    tags: [] as string[],
    step: 'all',
    dateRange: undefined as DateRange | undefined,
    sortBy: 'newest' as 'newest' | 'oldest' | 'step' | 'reviews' | 'id'
  });

  const {
    learningEntries,
    reviewsToday: originalReviewsToday,
    loading,
    addLearningEntry,
    completeReview
  } = useSupabaseLearning();

  const {
    permission,
    settings: notificationSettings,
    requestPermission,
    scheduleDailyReminder
  } = useNotifications();

  // Usar algoritmo melhorado para determinar revisões
  const reviewsToday = SpacedRepetitionEngine.getItemsForReview(
    learningEntries.map(entry => ({
      id: entry.id,
      createdAt: entry.createdAt,
      step: entry.step,
      reviews: entry.reviews.map(r => ({
        date: r.date,
        difficulty: 'medium' as const,
        correct: true
      })),
      lastReviewDate: entry.reviews[entry.reviews.length - 1]?.date
    }))
  ).map(item => learningEntries.find(e => e.id === item.id)!).filter(Boolean);

  // Função para buscar por ID no formato #XXXX
  const searchByIdPattern = (query: string, entry: any) => {
    const idMatch = query.match(/#(\d{1,4})/);
    if (idMatch) {
      const searchId = parseInt(idMatch[1]);
      return entry.numeroId === searchId;
    }
    return false;
  };

  // Filtrar e ordenar entradas
  const filteredEntries = learningEntries.filter(entry => {
    // Filtro por query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      
      // Busca por ID no formato #XXXX
      if (searchByIdPattern(filters.query, entry)) {
        return true;
      }
      
      // Busca normal no conteúdo, contexto e tags
      if (!entry.content.toLowerCase().includes(query) &&
          !entry.context?.toLowerCase().includes(query) &&
          !entry.tags.some(tag => tag.toLowerCase().includes(query))) {
        return false;
      }
    }

    // Filtro por tags
    if (filters.tags.length > 0) {
      if (!filters.tags.some(tag => entry.tags.includes(tag))) {
        return false;
      }
    }

    // Filtro por step
    if (filters.step && filters.step !== 'all' && entry.step !== parseInt(filters.step)) {
      return false;
    }

    // Filtro por data
    if (filters.dateRange?.from) {
      const entryDate = new Date(entry.createdAt);
      if (entryDate < filters.dateRange.from) return false;
      if (filters.dateRange.to && entryDate > filters.dateRange.to) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'id':
        return b.numeroId - a.numeroId;
      case 'step':
        return b.step - a.step;
      case 'reviews':
        return (b.reviews?.length || 0) - (a.reviews?.length || 0);
      default: // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Agendar notificações diárias
  useEffect(() => {
    if (notificationSettings.enabled && reviewsToday.length > 0) {
      scheduleDailyReminder(reviewsToday.length);
    }
  }, [reviewsToday.length, notificationSettings.enabled, scheduleDailyReminder]);

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

  const handleAddLearning = async (content: string, context?: string, tags?: string[]) => {
    await addLearningEntry(content, context, tags);
    setShowAddModal(false);
  };

  const handleCompleteReview = async (entryId: string, questions?: string[], answers?: string[]) => {
    await completeReview(entryId, questions, answers);
  };

  const handleImport = (entries: any[]) => {
    // Para import, ainda usaremos localStorage temporariamente
    // Em uma implementação futura, isso pode ser migrado para Supabase
    localStorage.setItem('learningEntries', JSON.stringify(entries));
    window.location.reload(); // Recarrega para aplicar os dados importados
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
          {/* Notificações */}
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

        {/* Tabs para diferentes visualizações */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="pb-16">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="search">Buscar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Overview */}
            <StatsOverview 
              totalEntries={learningEntries.length}
              reviewsToday={reviewsToday.length}
              entries={learningEntries}
            />

            {/* Learning Grid */}
            <LearningGrid entries={learningEntries.slice(0, 10)} />
          </TabsContent>

          <TabsContent value="analytics">
            <LearningAnalytics entries={learningEntries} />
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <SearchAndFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableTags={[...new Set(learningEntries.flatMap(e => e.tags))]}
              totalResults={filteredEntries.length}
            />
            
            <LearningGrid entries={filteredEntries} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <AddLearningModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddLearning}
        existingTags={[...new Set(learningEntries.flatMap(e => e.tags))]}
      />

      <ReviewModal 
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        reviews={reviewsToday}
        onComplete={handleCompleteReview}
      />

      <SettingsPanel 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        entries={learningEntries}
        onImport={handleImport}
      />
    </div>
  );
};

export default Index;
