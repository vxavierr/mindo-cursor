
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { User, Bell, Download, Upload, FileText, Save, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SettingsPanelProps {
  user: any;
}

const SettingsPanel = ({ user }: SettingsPanelProps) => {
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    notifications: true,
    dailyReminder: true,
    reminderTime: '06:30'
  });

  const [importData, setImportData] = useState('');

  const handleSaveProfile = () => {
    // Simulate saving
    toast({
      title: "Perfil atualizado!",
      description: "Suas configurações foram salvas com sucesso."
    });
  };

  const handleExportData = () => {
    // Mock export data
    const exportData = {
      user: user,
      entries: [
        {
          id: '0001',
          content: 'JavaScript closures são funções que têm acesso ao escopo externo',
          createdAt: new Date().toISOString(),
          step: 1
        }
      ],
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `spacelearn-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Backup exportado!",
      description: "Seus dados foram exportados com sucesso."
    });
  };

  const handleImportData = () => {
    if (!importData.trim()) {
      toast({
        title: "Dados inválidos",
        description: "Por favor, cole os dados de backup no campo de texto.",
        variant: "destructive"
      });
      return;
    }

    try {
      const data = JSON.parse(importData);
      console.log('Importing data:', data);
      
      toast({
        title: "Dados importados!",
        description: "Seus dados foram importados com sucesso. Recarregue a página para ver as mudanças."
      });
      
      setImportData('');
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Formato de dados inválido. Verifique se o JSON está correto.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Configurações
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Personalize sua experiência de aprendizado
        </p>
      </div>

      <div className="grid gap-8 max-w-4xl mx-auto">
        {/* Profile Settings */}
        <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Perfil
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nome</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  id="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
            </div>
            
            <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              Salvar Perfil
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Bell className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Notificações
              </h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">Notificações Push</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Receber notificações no navegador
                  </p>
                </div>
                <Switch
                  checked={profile.notifications}
                  onCheckedChange={(checked) => setProfile({ ...profile, notifications: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">Lembrete Diário</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Lembrete para fazer suas revisões
                  </p>
                </div>
                <Switch
                  checked={profile.dailyReminder}
                  onCheckedChange={(checked) => setProfile({ ...profile, dailyReminder: checked })}
                />
              </div>
              
              {profile.dailyReminder && (
                <div className="space-y-2 ml-4">
                  <Label htmlFor="reminderTime" className="text-gray-700 dark:text-gray-300">
                    Horário do Lembrete
                  </Label>
                  <Input
                    id="reminderTime"
                    type="time"
                    value={profile.reminderTime}
                    onChange={(e) => setProfile({ ...profile, reminderTime: e.target.value })}
                    className="w-32 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Backup & Import */}
        <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Backup e Importação
              </h3>
            </div>
            
            <div className="space-y-6">
              {/* Export */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Exportar Dados
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Faça backup de todos os seus aprendizados e configurações
                  </p>
                  <Button onClick={handleExportData} variant="outline" className="bg-white dark:bg-gray-700">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Backup (JSON)
                  </Button>
                </div>
              </div>

              {/* Import */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Importar Dados
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Restaure seus dados de um backup anterior
                  </p>
                  
                  <div className="space-y-4">
                    <Textarea
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      placeholder="Cole aqui o conteúdo do arquivo JSON de backup..."
                      className="h-32 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    />
                    
                    <div className="flex items-start space-x-2 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Atenção:</strong> A importação irá substituir seus dados atuais. 
                        Certifique-se de fazer um backup antes de continuar.
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleImportData}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={!importData.trim()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Importar Dados
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPanel;
