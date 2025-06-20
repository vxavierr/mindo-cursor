
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, User, LogOut } from 'lucide-react';
import CleanTodaysLearning from '@/components/learning/CleanTodaysLearning';
import CleanAddLearningModal from '@/components/learning/CleanAddLearningModal';
import SettingsPanel from '@/components/settings/SettingsPanel';
import { useCleanLearning } from '@/hooks/useCleanLearning';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';

const CleanHome = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { signOut } = useAuth();
  const { profile } = useUserProfile();
  const { 
    learningEntries, 
    todaysEntries,
    loading,
    addLearningEntry,
    completeReview
  } = useCleanLearning();

  const handleLogout = async () => {
    await signOut();
  };

  // Filter today's entries that need review based on spaced repetition logic
  const reviewsToday = learningEntries.filter(entry => {
    if (!entry.reviews || entry.reviews.length === 0) return true;
    
    const lastReview = entry.reviews[entry.reviews.length - 1];
    const daysSinceLastReview = Math.floor((Date.now() - new Date(lastReview.date).getTime()) / (1000 * 60 * 60 * 24));
    const intervals = [1, 3, 7, 14, 30, 60];
    const requiredInterval = intervals[Math.min(entry.step, intervals.length - 1)];
    
    return daysSinceLastReview >= requiredInterval;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFBEA] via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">🧠</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  SpaceLearn
                </h1>
                <p className="text-sm text-gray-600">
                  Olá, {profile?.full_name || profile?.email || 'Usuário'}!
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
                className="text-gray-600 hover:text-gray-900 hover:bg-orange-100"
              >
                <Settings className="w-5 h-5 mr-2" />
                Configurações
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">
              O que você aprendeu hoje?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Registre seus aprendizados de forma natural e deixe nossa IA criar o plano de revisão perfeito para você
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {learningEntries.length}
                </div>
                <div className="text-gray-600">Aprendizados</div>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {reviewsToday.length}
                </div>
                <div className="text-gray-600">Para revisar hoje</div>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {learningEntries.reduce((sum, entry) => sum + (entry.reviews?.length || 0), 0)}
                </div>
                <div className="text-gray-600">Revisões feitas</div>
              </div>
            </div>
          </div>

          {/* Add Learning Button */}
          <div className="text-center">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-8 py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              ✨ Adicionar Novo Aprendizado
            </Button>
          </div>

          {/* Today's Learning */}
          <CleanTodaysLearning 
            entries={learningEntries}
            reviewsToday={reviewsToday}
            onCompleteReview={completeReview}
            loading={loading}
          />
        </div>
      </main>

      {/* Modals */}
      <CleanAddLearningModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addLearningEntry}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        entries={learningEntries}
        onImport={() => {}} // This will be handled by the secure hook
      />
    </div>
  );
};

export default CleanHome;
