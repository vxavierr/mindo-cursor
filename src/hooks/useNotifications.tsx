
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  enabled: boolean;
  dailyTime: string;
  weekdays: boolean[];
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    dailyTime: '06:30',
    weekdays: [true, true, true, true, true, true, true] // todos os dias
  });
  const { toast } = useToast();

  useEffect(() => {
    // Verificar permissão atual
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Carregar configurações salvas
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Notificações não suportadas",
        description: "Seu navegador não suporta notificações push",
        variant: "destructive"
      });
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast({
          title: "Notificações ativadas!",
          description: "Você receberá lembretes diários para suas revisões"
        });
        return true;
      } else {
        toast({
          title: "Permissão negada",
          description: "Você não receberá notificações de lembrete",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  };

  const scheduleNotification = (title: string, body: string, delay: number = 0) => {
    if (permission !== 'granted') return;

    setTimeout(() => {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'spacelearn-reminder'
      });
    }, delay);
  };

  const scheduleDailyReminder = (reviewCount: number) => {
    if (!settings.enabled || permission !== 'granted') return;

    const now = new Date();
    const [hours, minutes] = settings.dailyTime.split(':').map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // Se já passou do horário hoje, agendar para amanhã
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    // Verificar se é um dia da semana habilitado
    const dayOfWeek = scheduledTime.getDay();
    if (!settings.weekdays[dayOfWeek]) return;

    const delay = scheduledTime.getTime() - now.getTime();

    scheduleNotification(
      '⏰ Hora de revisar!',
      reviewCount > 0 
        ? `Você tem ${reviewCount} revisão${reviewCount > 1 ? 'ões' : ''} pendente${reviewCount > 1 ? 's' : ''}`
        : 'Que tal adicionar um novo aprendizado?',
      delay
    );
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));
  };

  return {
    permission,
    settings,
    requestPermission,
    scheduleNotification,
    scheduleDailyReminder,
    updateSettings
  };
};
