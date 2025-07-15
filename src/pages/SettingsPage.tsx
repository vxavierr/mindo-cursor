import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserSettings, type NotificationSettings } from '@/hooks/useUserSettings';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, 
  ArrowLeft,
  User,
  Bell,
  Palette,
  Globe,
  Shield,
  Zap,
  Clock,
  Target,
  BookOpen,
  Volume2,
  Mic,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  Save,
  Check,
  X,
  ChevronRight,
  Settings,
  Camera,
  Mail,
  Phone,
  Calendar,
  Activity,
  Award,
  Download,
  Upload,
  Trash2,
  HelpCircle,
  LogOut,
  Plus,
  Minus,
  RotateCcw,
  Eye,
  EyeOff,
  Languages,
  Vibrate,
  VolumeX,
  RefreshCw
} from 'lucide-react';

export default function MindoSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    settings,
    loading,
    saving,
    saveSettings,
    updateSection,
    exportData,
    importData,
    deleteAllData,
    loadSettings
  } = useUserSettings();
  
  const [activeSection, setActiveSection] = useState('profile');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [importDataText, setImportDataText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  // Carregar configurações quando o componente montar
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Debug: log das configurações
  useEffect(() => {
    console.log('Settings loaded:', settings);
  }, [settings]);

  const settingSections = [
    {
      id: 'profile',
      title: 'Perfil',
      icon: User,
      description: 'Informações pessoais e foto'
    },
    {
      id: 'notifications',
      title: 'Notificações',
      icon: Bell,
      description: 'Alertas e lembretes'
    },
    {
      id: 'privacy',
      title: 'Privacidade',
      icon: Shield,
      description: 'Dados e segurança'
    },
    {
      id: 'data',
      title: 'Dados',
      icon: Download,
      description: 'Backup e exportação'
    },
    {
      id: 'help',
      title: 'Ajuda',
      icon: HelpCircle,
      description: 'Suporte e documentação'
    }
  ];

  const handleSave = async () => {
    await saveSettings(settings);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleToggleNotification = async (key: keyof NotificationSettings) => {
    await updateSection('notifications', {
      [key]: !settings.notifications[key]
    });
  };

  const handleAdjustGoal = async (change) => {
    const newGoal = Math.max(1, Math.min(20, settings.learning.dailyGoal + change));
    await updateSection('learning', { dailyGoal: newGoal });
  };

  const handleAdjustReviewInterval = async (change) => {
    const newInterval = Math.max(1, Math.min(72, settings.learning.reviewInterval + change));
    await updateSection('learning', { reviewInterval: newInterval });
  };

  const renderProfileSection = () => (
    <div className="space-y-8">
      {/* Avatar Section */}
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold mb-4">
            {settings.profile.avatar ? (
              <img src={settings.profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              settings.profile.name.split(' ').map(n => n[0]).join('')
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
          >
            <Camera className="w-5 h-5 text-white" />
          </motion.button>
        </div>
        <p className="text-white/60 text-sm">Clique na câmera para alterar sua foto</p>
      </div>

      {/* Profile Form */}
      <div className="space-y-6">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Nome completo</label>
          <input
            type="text"
            value={settings.profile.name}
            onChange={(e) => updateSection('profile', { name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={settings.profile.email}
            onChange={(e) => updateSection('profile', { email: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Telefone</label>
          <input
            type="tel"
            value={settings.profile.phone}
            onChange={(e) => updateSection('profile', { phone: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Bio</label>
          <textarea
            value={settings.profile.bio}
            onChange={(e) => updateSection('profile', { bio: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all resize-none"
            rows={3}
            placeholder="Fale um pouco sobre você..."
          />
        </div>
      </div>
    </div>
  );

  const renderLearningSection = () => (
    <div className="space-y-8">
      {/* Daily Goal */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Meta Diária
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80">Aprendizados por dia</p>
            <p className="text-white/60 text-sm">Defina quantos aprendizados você quer completar diariamente</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleAdjustGoal(-1)}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-2xl font-bold text-white min-w-[3rem] text-center">
              {settings.learning.dailyGoal}
            </span>
            <button
              onClick={() => handleAdjustGoal(1)}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Review Interval */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Intervalo de Revisão
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80">Horas entre revisões</p>
            <p className="text-white/60 text-sm">Tempo ideal para revisar o conteúdo aprendido</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleAdjustReviewInterval(-1)}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-2xl font-bold text-white min-w-[4rem] text-center">
              {settings.learning.reviewInterval}h
            </span>
            <button
              onClick={() => handleAdjustReviewInterval(1)}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Difficulty Level */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Nível de Dificuldade
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'easy', label: 'Fácil', color: 'from-green-500 to-emerald-500' },
            { value: 'medium', label: 'Médio', color: 'from-yellow-500 to-orange-500' },
            { value: 'hard', label: 'Difícil', color: 'from-red-500 to-pink-500' }
          ].map((level) => (
            <button
              key={level.value}
              onClick={() => updateSection('learning', { difficulty: level.value as 'easy' | 'medium' | 'hard' })}
              className={`p-4 rounded-xl border transition-all ${
                settings.learning.difficulty === level.value
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${level.color} mx-auto mb-2`} />
              <p className="text-white text-sm font-medium">{level.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Preferências</h3>
        <div className="space-y-4">
          {[
            { key: 'autoReview', label: 'Revisão automática', description: 'Programa revisões automaticamente', icon: RotateCcw },
            { key: 'soundEffects', label: 'Efeitos sonoros', description: 'Sons de feedback e notificações', icon: Volume2 },
            { key: 'hapticFeedback', label: 'Feedback tátil', description: 'Vibração ao completar ações', icon: Vibrate }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <setting.icon className="w-5 h-5 text-white/80" />
                </div>
                <div>
                  <p className="text-white font-medium">{setting.label}</p>
                  <p className="text-white/60 text-sm">{setting.description}</p>
                </div>
              </div>
              <button
                onClick={() => updateSection('learning', { [setting.key]: !settings.learning[setting.key] })}
                className={`w-12 h-6 rounded-full transition-all ${
                  settings.learning[setting.key] ? 'bg-blue-500' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-all ${
                  settings.learning[setting.key] ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-8">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Tipos de Notificação</h3>
        <div className="space-y-4">
          {[
            { key: 'push', label: 'Notificações push', description: 'Receber notificações no dispositivo', icon: Smartphone },
            { key: 'email', label: 'Email', description: 'Receber notificações por email', icon: Mail }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <notification.icon className="w-5 h-5 text-white/80" />
                </div>
                <div>
                  <p className="text-white font-medium">{notification.label}</p>
                  <p className="text-white/60 text-sm">{notification.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleNotification(notification.key as keyof NotificationSettings)}
                className={`w-12 h-6 rounded-full transition-all ${
                  settings.notifications[notification.key as keyof NotificationSettings] ? 'bg-blue-500' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-all ${
                  settings.notifications[notification.key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Conteúdo das Notificações</h3>
        <div className="space-y-4">
          {[
            { key: 'reviews', label: 'Revisões', description: 'Lembrar de revisar conteúdo', icon: RotateCcw },
            { key: 'achievements', label: 'Conquistas', description: 'Notificar sobre conquistas', icon: Award }
          ].map((content) => (
            <div key={content.key} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <content.icon className="w-5 h-5 text-white/80" />
                </div>
                <div>
                  <p className="text-white font-medium">{content.label}</p>
                  <p className="text-white/60 text-sm">{content.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleNotification(content.key as keyof NotificationSettings)}
                className={`w-12 h-6 rounded-full transition-all ${
                  settings.notifications[content.key as keyof NotificationSettings] ? 'bg-blue-500' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-all ${
                  settings.notifications[content.key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-8">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Tema</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => updateSection('appearance', { darkMode: false })}
            className={`p-6 rounded-xl border transition-all ${
              !settings.appearance.darkMode ? 'border-white/30 bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 mx-auto mb-3 flex items-center justify-center">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <p className="text-white font-medium">Claro</p>
          </button>
          <button
            onClick={() => updateSection('appearance', { darkMode: true })}
            className={`p-6 rounded-xl border transition-all ${
              settings.appearance.darkMode ? 'border-white/30 bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 mx-auto mb-3 flex items-center justify-center">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <p className="text-white font-medium">Escuro</p>
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Cores de Destaque</h3>
        <div className="grid grid-cols-6 gap-3">
          {[
            'from-purple-500 to-blue-500',
            'from-blue-500 to-cyan-500',
            'from-green-500 to-emerald-500',
            'from-yellow-500 to-orange-500',
            'from-red-500 to-pink-500',
            'from-pink-500 to-purple-500'
          ].map((gradient, index) => (
            <button
              key={index}
              className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} hover:scale-105 transition-transform`}
            />
          ))}
        </div>
      </div>
    </div>
  );

    const renderPrivacySection = () => (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Privacidade dos Dados</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-white/80" />
              </div>
              <div>
                <p className="text-white font-medium">Perfil público</p>
                <p className="text-white/60 text-sm">Permitir que outros vejam seu perfil</p>
              </div>
            </div>
            <button className="w-12 h-6 rounded-full bg-white/20">
              <div className="w-5 h-5 rounded-full bg-white translate-x-0.5" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white/80" />
              </div>
              <div>
                <p className="text-white font-medium">Compartilhar progresso</p>
                <p className="text-white/60 text-sm">Permitir compartilhamento de estatísticas</p>
              </div>
            </div>
            <button className="w-12 h-6 rounded-full bg-blue-500">
              <div className="w-5 h-5 rounded-full bg-white translate-x-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Segurança</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
            <span>Alterar senha</span>
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
            <span>Autenticação de dois fatores</span>
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
            <span>Sessões ativas</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderDataSection = () => (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Backup e Exportação</h3>
        <div className="space-y-3">
          <button 
            onClick={exportData}
            className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5" />
              <span>Exportar dados</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowImportModal(true)}
            className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Upload className="w-5 h-5" />
              <span>Importar dados</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5" />
              <span>Backup automático</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4">Zona de Perigo</h3>
        <div className="space-y-3">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span>Excluir todos os dados</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Excluir conta</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderHelpSection = () => (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Central de Ajuda</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5" />
              <span>Guia de uso</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-5 h-5" />
              <span>Perguntas frequentes</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5" />
              <span>Entrar em contato</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Sobre o Mindo</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/80">Versão</span>
            <span className="text-white">2.1.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80">Última atualização</span>
            <span className="text-white">15 Jul 2025</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80">Licença</span>
            <span className="text-white">MIT</span>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-white/60 text-sm leading-relaxed">
            Mindo é uma plataforma de aprendizado que utiliza técnicas de repetição espaçada 
            e inteligência artificial para otimizar seu processo de aprendizado.
          </p>
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'privacy':
        return renderPrivacySection();
      case 'data':
        return renderDataSection();
      case 'help':
        return renderHelpSection();
      default:
        return renderProfileSection();
    }
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
            <h2 className="text-2xl font-bold text-white mb-2">Carregando Configurações</h2>
            <p className="text-white/70 font-medium">Aguarde um momento...</p>
          </motion.div>
        </div>
      </div>
    );
  }

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
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Configurações</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 mb-8">
            {settingSections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeSection === section.id
                    ? 'bg-white/10 text-white border border-white/20' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-medium">{section.title}</span>
              </button>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide">Ações Rápidas</h3>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={saving || loading}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-white/80 hover:text-white transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 opacity-80 group-hover:opacity-100 flex items-center justify-center">
                <Save className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowImportModal(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-white/80 hover:text-white transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 opacity-80 group-hover:opacity-100 flex items-center justify-center">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">Importar Dados</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportData}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-white/80 hover:text-white transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 opacity-80 group-hover:opacity-100 flex items-center justify-center">
                <Download className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">Exportar Dados</span>
            </motion.button>
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
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {settingSections.find(s => s.id === activeSection)?.title}
              </h1>
              <p className="text-white/70 text-lg">
                {settingSections.find(s => s.id === activeSection)?.description}
              </p>
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <motion.div 
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="px-8 py-6"
            >
              {renderActiveSection()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSaveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-green-500/20 backdrop-blur-xl rounded-2xl border border-green-500/30 p-4 z-50"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">Configurações salvas</p>
                <p className="text-white/60 text-sm">Suas alterações foram aplicadas com sucesso</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/80 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 w-full max-w-md"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Importar Dados</h3>
              <p className="text-white/70 mb-6">
                Cole aqui o conteúdo do arquivo JSON de backup:
              </p>
              
              <textarea
                value={importDataText}
                onChange={(e) => setImportDataText(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all resize-none mb-6"
                rows={8}
                placeholder="Cole o conteúdo do arquivo JSON aqui..."
              />
              
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 h-12 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={async () => {
                    setShowImportModal(false);
                    await importData(importDataText);
                    setImportDataText('');
                  }}
                  disabled={!importDataText.trim()}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-white/20 disabled:cursor-not-allowed h-12 rounded-2xl flex items-center justify-center text-white font-semibold transition-colors"
                >
                  Importar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/80 backdrop-blur-2xl rounded-3xl border border-red-500/20 p-8 w-full max-w-md text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Excluir todos os dados?</h3>
              <p className="text-white/70 mb-8 leading-relaxed">
                Esta ação não pode ser desfeita. Todos os seus aprendizados, progresso 
                e configurações serão permanentemente removidos.
              </p>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 h-12 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={async () => {
                    setShowDeleteConfirm(false);
                    await deleteAllData();
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 h-12 rounded-2xl flex items-center justify-center text-white font-semibold transition-colors"
                >
                  Excluir tudo
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 