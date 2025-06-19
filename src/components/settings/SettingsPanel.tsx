
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Download, Upload, Bell, User, Database } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  entries: any[];
  onImport: (entries: any[]) => void;
}

const SettingsPanel = ({ isOpen, onClose, entries, onImport }: SettingsPanelProps) => {
  const [importData, setImportData] = useState('');
  const [notifications, setNotifications] = useState(true);

  const exportData = () => {
    const dataToExport = {
      version: "1.0",
      exported_at: new Date().toISOString(),
      entries: entries
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spacelearn-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Backup criado!",
      description: "Seus dados foram exportados com sucesso."
    });
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importData);
      
      if (!data.entries || !Array.isArray(data.entries)) {
        throw new Error('Formato inválido');
      }
      
      // Merge with existing entries, avoiding duplicates
      const existingIds = new Set(entries.map(e => e.id));
      const newEntries = data.entries.filter((entry: any) => !existingIds.has(entry.id));
      
      const mergedEntries = [...entries, ...newEntries];
      onImport(mergedEntries);
      localStorage.setItem('learningEntries', JSON.stringify(mergedEntries));
      
      setImportData('');
      
      toast({
        title: "Importação concluída!",
        description: `${newEntries.length} novos aprendizados foram importados.`
      });
      
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Verifique se o formato dos dados está correto.",
        variant: "destructive"
      });
    }
  };

  const clearAllData = () => {
    if (confirm('Tem certeza que quer limpar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('learningEntries');
      onImport([]);
      
      toast({
        title: "Dados limpos",
        description: "Todos os aprendizados foram removidos."
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotifications(true);
        toast({
          title: "Notificações ativadas!",
          description: "Você receberá lembretes para suas revisões."
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Configurações
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Account Section */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Conta</h3>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Você está usando o SpaceLearn no modo visitante. Seus dados são salvos localmente no seu navegador.
              </p>
              <Button variant="outline" className="w-full">
                Criar conta para sincronizar dados
              </Button>
            </div>
          </Card>

          {/* Notifications Section */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold">Notificações</h3>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Receba lembretes diários para suas revisões às 6:30.
              </p>
              <Button 
                onClick={requestNotificationPermission}
                variant={notifications ? "secondary" : "default"}
                className="w-full"
              >
                {notifications ? 'Notificações Ativas' : 'Ativar Notificações'}
              </Button>
            </div>
          </Card>

          {/* Data Management Section */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Gerenciar Dados</h3>
            </div>
            
            <div className="space-y-6">
              {/* Export */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exportar Dados
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Baixe um backup de todos os seus aprendizados em formato JSON.
                </p>
                <Button onClick={exportData} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Criar Backup
                </Button>
              </div>

              {/* Import */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Importar Dados
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Restaure seus dados de um backup anterior.
                </p>
                <div className="space-y-3">
                  <Textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="Cole aqui o conteúdo do arquivo JSON de backup..."
                    className="min-h-[100px]"
                  />
                  <Button 
                    onClick={handleImport} 
                    disabled={!importData.trim()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Importar Dados
                  </Button>
                </div>
              </div>

              {/* Clear Data */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium mb-2 text-red-600 dark:text-red-400">
                  Zona de Perigo
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Limpar todos os dados permanentemente.
                </p>
                <Button 
                  onClick={clearAllData} 
                  variant="destructive" 
                  className="w-full"
                >
                  Limpar Todos os Dados
                </Button>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <h3 className="text-lg font-semibold mb-4">Estatísticas</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{entries.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de aprendizados</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {entries.reduce((sum, entry) => sum + (entry.reviews?.length || 0), 0)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Revisões completadas</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPanel;
