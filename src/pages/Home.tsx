import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Plus, 
  Calendar, 
  Clock, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Settings, 
  Search,
  Bell,
  User,
  ArrowRight,
  CheckCircle,
  RefreshCw,
  Star,
  Zap,
  BarChart3,
  Timer,
  Award,
  Filter,
  Grid,
  List,
  ChevronDown,
  Activity,
  Users,
  Globe,
  MessageCircle,
  Menu,
  Moon,
  Sun,
  Brush
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import AddLearningModal from '@/components/learning/AddLearningModal';
import ReviewModal from '@/components/learning/ReviewModal';
import NavigationLayout from '@/components/layout/NavigationLayout';
import DateNavigation from '@/components/navigation/DateNavigation';
import { useLearning } from '@/hooks/useLearning';
import { useNotifications } from '@/hooks/useNotifications';
import LearningCard from '@/components/learning/LearningCard';
import { useLearningCardLayout } from '@/components/learning/LearningCardLayoutContext';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { UserDropdown } from '@/components/ui/UserDropdown';
import { getGreeting } from '@/utils/timeUtils';
import { GRADIENT_BACKGROUNDS } from '@/constants/reviewConstants';
import BackdropCard from '@/components/ui/BackdropCard';
import { useAuth } from '@/contexts/AuthContext';

// Mobile Home Component
function MobileHome({
  currentTime,
  selectedTab,
  setSelectedTab,
  pendingReviews,
  completedToday,
  learningStreak,
  recentLearnings,
  stats,
  getGreeting,
  handleAddLearning,
  handleReview,
  showNotifications,
  setShowNotifications,
  notifications,
  onUpdateLearning,
  onDeleteLearning,
  navigateToReviews,
  navigate,
  userName
}: any) {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-900 via-purple-800 to-black relative overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-purple-700/30 to-black/90" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Top glow effect */}
      <motion.div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Scrollable Content Area */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pt-12 pb-4"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <BackdropCard size="sm" className="w-10 h-10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </BackdropCard>
              <span className="text-xl font-bold text-white">Mindo</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <BackdropCard size="sm" className="p-0">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 relative"
                  >
                    <Bell className="w-5 h-5 text-white" />
                    {notifications.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                    )}
                  </button>
                </BackdropCard>
                
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute right-0 mt-2 w-80 z-50"
                    >
                      <BackdropCard variant="solid" className="p-4">
                        <h3 className="font-semibold text-white mb-3">Notificações</h3>
                        <div className="space-y-2">
                          {notifications.map((notification: any) => (
                            <BackdropCard key={notification.id} variant="glass" size="sm">
                              <p className="text-white/90 text-sm">{notification.message}</p>
                              <span className="text-white/60 text-xs">{notification.time}</span>
                            </BackdropCard>
                          ))}
                        </div>
                      </BackdropCard>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <UserDropdown variant="mobile" />
            </div>
          </div>

          {/* Greeting */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">
              {getGreeting()}, {userName}!
            </h1>
            <p className="text-white/70">
              O que você vai aprender hoje?
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-6 mb-6"
        >
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat: any, index: number) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/10 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <div className="relative z-10">
                    <stat.icon className="w-6 h-6 text-white/80 mb-2" />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-white/60">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pending Reviews Alert */}
        {pendingReviews > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="px-6 mb-6"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={navigateToReviews}
              className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-4 border border-orange-500/30 relative overflow-hidden cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {pendingReviews} revisões pendentes
                    </h3>
                    <p className="text-white/70 text-sm">
                      Vamos revisar para fixar o conhecimento
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-white/70" />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Recent Learnings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Aprendizados Recentes</h2>
            <button className="text-white/70 hover:text-white text-sm">
              Ver todos
            </button>
          </div>

          <div className="space-y-4">
            {recentLearnings.map((learning: any, index: number) => (
              <LearningCard
                key={learning.id}
                entry={learning}
                onDelete={onDeleteLearning}
                onUpdate={onUpdateLearning}
                variant="enhanced"
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* Bottom padding to ensure content doesn't get hidden behind fixed elements */}
        <div className="h-32"></div>
      </div>

      {/* Fixed Bottom Elements */}
      <div className="relative z-20 bg-gradient-to-t from-black/80 to-transparent">
        {/* Add Learning Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="px-6 pb-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddLearning}
            className="w-full relative group"
          >
            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 h-14 rounded-2xl transition-all duration-300 flex items-center justify-center">
              <div className="flex items-center space-x-2 text-white font-semibold">
                <Plus className="w-5 h-5" />
                <span>Registrar Aprendizado</span>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Bottom Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-black/40 backdrop-blur-2xl border-t border-white/10 px-6 py-4"
        >
          <div className="flex items-center justify-around">
{[
              { icon: BookOpen, label: 'Home', id: 'home' },
              { icon: RefreshCw, label: 'Revisões', id: 'reviews' },
              { icon: Search, label: 'Buscar', id: 'search' },
              { icon: Settings, label: 'Config', id: 'settings' }
            ].map((tab: any) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedTab(tab.id);
                  if (tab.id === 'reviews') {
                    navigateToReviews();
                  } else if (tab.id === 'settings') {
                    navigate('/settings');
                  } else if (tab.id === 'new') {
                    navigate('/new-learning');
                  }
                }}
                className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${
                  tab.special 
                    ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400'
                    : selectedTab === tab.id 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/60 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Desktop Home Component
function DesktopHome({
  currentTime,
  selectedTab,
  setSelectedTab,
  pendingReviews,
  completedToday,
  learningStreak,
  recentLearnings,
  stats,
  getGreeting,
  handleAddLearning,
  handleReview,
  showNotifications,
  setShowNotifications,
  notifications,
  viewMode,
  setViewMode,
  quickActions,
  onUpdateLearning,
  onDeleteLearning,
  navigateToReviews,
  navigate,
  userName
}: any) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-purple-800 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-purple-700/30 to-black/90" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Top glow effect */}
      <motion.div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple-400/20 blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 h-screen flex">
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 bg-black/40 backdrop-blur-2xl border-r border-white/10 p-6 flex flex-col fixed left-0 top-0 h-full rounded-r-3xl"
        >
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Mindo</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 mb-8">
            {[
              { icon: BookOpen, label: 'Dashboard', id: 'home', active: true },
              { icon: RefreshCw, label: 'Revisões', id: 'reviews' },
              { icon: Search, label: 'Explorar', id: 'search' },
              { icon: TrendingUp, label: 'Progresso', id: 'progress' },
              { icon: Users, label: 'Comunidade', id: 'community' },
              { icon: Settings, label: 'Configurações', id: 'settings' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedTab(item.id);
                  if (item.id === 'reviews') {
                    navigateToReviews();
                  } else if (item.id === 'settings') {
                    navigate('/settings');
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  item.active 
                    ? 'bg-white/10 text-white border border-white/20' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide">Ações Rápidas</h3>
            {quickActions.map((action: any, index: number) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.label === 'Novo Aprendizado' ? handleAddLearning : 
                        action.label === 'Revisar Pendentes' ? navigateToReviews : undefined}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-white/80 hover:text-white transition-all group"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} opacity-80 group-hover:opacity-100 flex items-center justify-center`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col ml-80 h-screen overflow-hidden">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-8 pt-8 pb-6 border-b border-white/10 flex-shrink-0"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {getGreeting()}, {userName}!
                </h1>
                <p className="text-white/70 text-lg">
                  {currentTime.toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 relative"
                  >
                    <Bell className="w-5 h-5 text-white" />
                    {notifications.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 p-4 z-50"
                      >
                        <h3 className="font-semibold text-white mb-3">Notificações</h3>
                        <div className="space-y-2">
                          {notifications.map((notification: any) => (
                            <div key={notification.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                              <p className="text-white/90 text-sm">{notification.message}</p>
                              <span className="text-white/60 text-xs">{notification.time}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <UserDropdown variant="desktop" />
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="flex-1 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="px-8 py-6"
            >
            <div className="grid grid-cols-3 gap-6 mb-8">
              {stats.map((stat: any, index: number) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group"
                >
                  <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <stat.icon className="w-8 h-8 text-white/80" />
                        <span className="text-sm text-green-400 font-medium">{stat.change}</span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                      <div className="text-white/60">{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pending Reviews Alert */}
            {pendingReviews > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={navigateToReviews}
                  className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30 relative overflow-hidden cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {pendingReviews} revisões pendentes
                        </h3>
                        <p className="text-white/70">
                          Vamos revisar para fixar o conhecimento e manter sua sequência
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-white/70" />
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Recent Learnings */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Aprendizados Recentes</h2>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white">
                  <Filter className="w-4 h-4" />
                  <span>Filtrar</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="text-white/70 hover:text-white">
                  Ver todos
                </button>
              </div>
            </div>

            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {recentLearnings.map((learning: any, index: number) => (
                <LearningCard
                  key={learning.id}
                  entry={learning}
                  onDelete={onDeleteLearning}
                  onUpdate={onUpdateLearning}
                  variant="enhanced"
                  index={index}
                        />
              ))}
            </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Home Component
const Home = () => {
  const isMobile = useIsMobile();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState('home');
  const [viewMode, setViewMode] = useState('grid');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  // Add auth hook
  const { user } = useAuth();

  // Existing hooks
  const {
    learningEntries,
    todaysEntries,
    reviewsToday,
    loading,
    addLearningEntry,
    updateLearningEntry,
    completeReview,
    deleteEntry
  } = useLearning();

  const {
    permission,
    requestPermission,
    scheduleDailyReminder
  } = useNotifications();

  const { layout, setLayout } = useLearningCardLayout();
  const { toast } = useToast();

  // Get user name from user metadata or fallback
  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      // Extract first name from full name
      return user.user_metadata.full_name.split(' ')[0];
    }
    // Fallback to email if no name is available
    return 'Usuário';
  };

  // Data for the new designs
  const pendingReviews = reviewsToday.length;
  const completedToday = todaysEntries.filter(e => e.step === -1).length;
  const learningStreak = 7; // This could be calculated from your data

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (reviewsToday.length > 0) {
      scheduleDailyReminder(reviewsToday.length);
    }
  }, [reviewsToday.length, scheduleDailyReminder]);

  // Using shared greeting utility - removed duplicate function

  // Usar dados reais dos aprendizados (primeiros 6)
  const recentLearnings = learningEntries.slice(0, 6);

  const stats = [
    { label: 'Total Aprendizados', value: learningEntries.length, icon: BookOpen, color: 'from-blue-500 to-cyan-500', change: '+12%' },
    { label: 'Sequência Atual', value: learningStreak, icon: Target, color: 'from-green-500 to-emerald-500', change: '+2 dias' },
    { label: 'Concluídos Hoje', value: completedToday, icon: CheckCircle, color: 'from-purple-500 to-violet-500', change: '+5' },
    { label: 'Tempo Médio', value: '24min', icon: Timer, color: 'from-orange-500 to-red-500', change: '-3min' },
    { label: 'Nível Atual', value: 'Pro', icon: Award, color: 'from-yellow-500 to-amber-500', change: '+1' },
    { label: 'Precisão', value: '94%', icon: Activity, color: 'from-pink-500 to-rose-500', change: '+2%' }
  ];

  const quickActions = [
    { label: 'Novo Aprendizado', icon: Plus, color: 'from-blue-500 to-cyan-500' },
    { label: 'Revisar Pendentes', icon: RefreshCw, color: 'from-orange-500 to-red-500' },
    { label: 'Estatísticas', icon: BarChart3, color: 'from-purple-500 to-violet-500' },
    { label: 'Configurações', icon: Settings, color: 'from-green-500 to-emerald-500' }
  ];

  const notifications = [
    { id: 1, type: 'review', message: `Você tem ${pendingReviews} revisões programadas para agora`, time: '2min' },
    { id: 2, type: 'achievement', message: 'Parabéns! Você completou 7 dias seguidos', time: '5min' },
    { id: 3, type: 'reminder', message: 'Lembrete: Estudar Algoritmos às 14h', time: '1h' }
  ];

  // Event handlers
  const handleAddLearning = async (content?: string, title?: string, tags?: string[]) => {
    if (content && title) {
      await addLearningEntry(content, title, tags || []);
      setShowAddModal(false);
    } else {
      // On mobile, redirect to dedicated new learning page
      if (isMobile) {
        navigate('/new-learning');
      } else {
        setShowAddModal(true);
      }
    }
  };

  const handleUpdateLearning = async (entryId: string, updates: { title?: string; content?: string; tags?: string[]; context?: string }) => {
    return await updateLearningEntry(entryId, updates);
  };

  const handleDeleteLearning = async (entryId: string) => {
    await deleteEntry(entryId);
  };

  const handleCompleteReview = async (entryId: string, difficulty: 'easy' | 'medium' | 'hard', questions: string[], answers: string[]) => {
    await completeReview(entryId, difficulty, questions, answers);
  };

  const handleReview = () => {
    setShowReviewModal(true);
  };

  const handleNavigate = (path: string) => {
    console.log('Navigate to:', path);
  };

  const handleCreateLearning = () => {
    setShowAddModal(true);
  };

  // Navigation functions
  const navigateToReviews = () => {
    navigate('/reviews');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-purple-800 to-black relative overflow-hidden flex items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-purple-700/30 to-black/90" />
        
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Top glow effect */}
        <motion.div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        {/* Loading Content */}
        <div className="relative z-10 text-center space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Mindo</h2>
            <p className="text-white/70 font-medium">Carregando...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Render based on device type
  if (isMobile) {
    return (
      <>
        <MobileHome
          currentTime={currentTime}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          pendingReviews={pendingReviews}
          completedToday={completedToday}
          learningStreak={learningStreak}
          recentLearnings={recentLearnings}
          stats={stats.slice(0, 3)} // Mobile shows only 3 stats
          getGreeting={getGreeting}
          handleAddLearning={handleAddLearning}
          handleReview={handleReview}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          notifications={notifications}
          onUpdateLearning={handleUpdateLearning}
          onDeleteLearning={handleDeleteLearning}
          navigateToReviews={navigateToReviews}
          navigate={navigate}
          userName={getUserName()}
        />
        
        {/* Add Learning Modal */}
        <AddLearningModal 
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddLearning}
        />

        {/* Review Modal */}
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          reviews={reviewsToday.filter(e => e.step !== -1)}
          onCompleteReview={handleCompleteReview}
        />
      </>
    );
  }

  return (
    <>
      <DesktopHome
        currentTime={currentTime}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        pendingReviews={pendingReviews}
        completedToday={completedToday}
        learningStreak={learningStreak}
        recentLearnings={recentLearnings}
        stats={stats}
        getGreeting={getGreeting}
        handleAddLearning={handleAddLearning}
        handleReview={handleReview}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notifications={notifications}
        viewMode={viewMode}
        setViewMode={setViewMode}
        quickActions={quickActions}
        onUpdateLearning={handleUpdateLearning}
        onDeleteLearning={handleDeleteLearning}
        navigateToReviews={navigateToReviews}
        navigate={navigate}
        userName={getUserName()}
      />
      
      {/* Add Learning Modal */}
      <AddLearningModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddLearning}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        reviews={reviewsToday.filter(e => e.step !== -1)}
        onCompleteReview={handleCompleteReview}
      />
    </>
  );
};

export default Home; 