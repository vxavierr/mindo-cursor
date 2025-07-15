import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  bio: string;
}

export interface NotificationSettings {
  push: boolean;
  email: boolean;
  reviews: boolean;
  achievements: boolean;
  dailyTime: string;
  weekdays: boolean[];
}

export interface LearningSettings {
  dailyGoal: number;
  reviewInterval: number;
  difficulty: 'easy' | 'medium' | 'hard';
  autoReview: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
}

export interface AppearanceSettings {
  darkMode: boolean;
  accentColor: string;
  language: string;
}

export interface PrivacySettings {
  publicProfile: boolean;
  shareProgress: boolean;
  twoFactorEnabled: boolean;
}

export interface UserSettings {
  profile: ProfileData;
  notifications: NotificationSettings;
  learning: LearningSettings;
  appearance: AppearanceSettings;
  privacy: PrivacySettings;
}

const defaultSettings: UserSettings = {
  profile: {
    name: 'Usuário',
    email: '',
    phone: '',
    avatar: null,
    bio: ''
  },
  notifications: {
    push: true,
    email: true,
    reviews: true,
    achievements: true,
    dailyTime: '06:30',
    weekdays: [true, true, true, true, true, true, true]
  },
  learning: {
    dailyGoal: 5,
    reviewInterval: 24,
    difficulty: 'medium',
    autoReview: true,
    soundEffects: true,
    hapticFeedback: false
  },
  appearance: {
    darkMode: true,
    accentColor: 'from-purple-500 to-blue-500',
    language: 'pt-br'
  },
  privacy: {
    publicProfile: false,
    shareProgress: true,
    twoFactorEnabled: false
  }
};

export const useUserSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carregar configurações do localStorage e dados do usuário
  const loadSettings = useCallback(async () => {
    try {
      // Carregar configurações do localStorage
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }

      // Se há usuário logado, carregar dados do perfil do Supabase Auth
      if (user) {
        setSettings(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
            email: user.email || '',
            avatar: user.user_metadata?.avatar_url || null
          }
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Salvar configurações
  const saveSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
    setSaving(true);

    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);

      // Salvar no localStorage
      localStorage.setItem('userSettings', JSON.stringify(updatedSettings));

      // Se há usuário logado, atualizar metadados do usuário no Supabase Auth
      if (user && newSettings.profile) {
        const { error } = await supabase.auth.updateUser({
          data: {
            full_name: newSettings.profile.name,
            avatar_url: newSettings.profile.avatar
          }
        });

        if (error) {
          console.error('Erro ao atualizar perfil:', error);
        }
      }

      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram salvas com sucesso"
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  }, [settings, user, toast]);

  // Atualizar seção específica
  const updateSection = useCallback(async (
    section: keyof UserSettings,
    data: Partial<UserSettings[keyof UserSettings]>
  ) => {
    const newSettings = {
      ...settings,
      [section]: { ...settings[section], ...data }
    };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  // Exportar dados
  const exportData = useCallback(async () => {
    try {
      const { data: learningData, error } = await supabase
        .from('revisoes')
        .select('*')
        .eq('usuario_id', user?.id || null);

      if (error) {
        console.error('Erro ao exportar dados:', error);
        toast({
          title: "Erro ao exportar",
          description: "Tente novamente em alguns instantes",
          variant: "destructive"
        });
        return;
      }

      const exportData = {
        version: "1.0",
        exported_at: new Date().toISOString(),
        settings: settings,
        learning_entries: learningData || []
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindo-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();

      URL.revokeObjectURL(url);

      toast({
        title: "Backup criado!",
        description: "Seus dados foram exportados com sucesso"
      });
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast({
        title: "Erro ao exportar",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    }
  }, [settings, user, toast]);

  // Importar dados
  const importData = useCallback(async (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);

      if (!data.settings || !data.learning_entries) {
        throw new Error('Formato inválido');
      }

      // Atualizar configurações
      await saveSettings(data.settings);

      // Importar aprendizados (se houver usuário)
      if (user && data.learning_entries.length > 0) {
        const { error } = await supabase
          .from('revisoes')
          .upsert(
            data.learning_entries.map((entry: any) => ({
              ...entry,
              usuario_id: user.id
            })),
            { onConflict: 'id' }
          );

        if (error) {
          console.error('Erro ao importar aprendizados:', error);
        }
      }

      toast({
        title: "Importação concluída!",
        description: "Seus dados foram importados com sucesso"
      });
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      toast({
        title: "Erro na importação",
        description: "Verifique se o formato dos dados está correto",
        variant: "destructive"
      });
    }
  }, [saveSettings, user, toast]);

  // Excluir todos os dados
  const deleteAllData = useCallback(async () => {
    try {
      // Excluir configurações do localStorage
      localStorage.removeItem('userSettings');
      setSettings(defaultSettings);

      // Se há usuário, excluir aprendizados do banco
      if (user) {
        await supabase
          .from('revisoes')
          .delete()
          .eq('usuario_id', user.id);
      }

      toast({
        title: "Dados excluídos",
        description: "Todos os dados foram removidos"
      });
    } catch (error) {
      console.error('Erro ao excluir dados:', error);
      toast({
        title: "Erro ao excluir",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  // Carregar configurações quando o componente montar
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    saving,
    saveSettings,
    updateSection,
    exportData,
    importData,
    deleteAllData,
    loadSettings
  };
}; 