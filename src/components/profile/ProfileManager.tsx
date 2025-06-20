
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, Save, LogOut } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/hooks/useAuth';
import { useSecureLearning } from '@/hooks/useSecureLearning';

const ProfileManager = () => {
  const { profile, loading, updateProfile } = useUserProfile();
  const { signOut } = useAuth();
  const { learningEntries } = useSecureLearning();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = () => {
    setFullName(profile?.full_name || '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsUpdating(true);
    const success = await updateProfile({ full_name: fullName });
    if (success) {
      setIsEditing(false);
    }
    setIsUpdating(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFullName('');
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <Card className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 text-center">
          <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Erro ao carregar perfil do usuário</p>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalReviews = learningEntries.reduce((sum, entry) => sum + (entry.reviews?.length || 0), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Informações do Perfil */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Perfil do Usuário</h2>
        </div>

        <div className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-700">Nome completo</Label>
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="flex-1"
                />
                <Button 
                  onClick={handleSave} 
                  disabled={isUpdating}
                  size="sm"
                >
                  {isUpdating ? 'Salvando...' : <Save className="w-4 h-4" />}
                </Button>
                <Button 
                  onClick={handleCancel} 
                  variant="outline"
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-medium">
                  {profile.full_name || 'Nome não informado'}
                </span>
                <Button onClick={handleEdit} variant="outline" size="sm">
                  Editar
                </Button>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <div className="text-gray-900 font-medium">
              {profile.email}
            </div>
            <p className="text-sm text-gray-500">
              O email não pode ser alterado por questões de segurança
            </p>
          </div>

          {/* Data de Criação */}
          <div className="space-y-2">
            <Label className="text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Membro since
            </Label>
            <div className="text-gray-900 font-medium">
              {formatDate(profile.created_at)}
            </div>
          </div>
        </div>
      </Card>

      {/* Estatísticas */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Suas Estatísticas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {learningEntries.length}
            </div>
            <div className="text-gray-600">Aprendizados Criados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {totalReviews}
            </div>
            <div className="text-gray-600">Revisões Completadas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Math.round((learningEntries.reduce((sum, entry) => sum + (entry.step || 0), 0) / Math.max(learningEntries.length, 1)) * 100) / 100}
            </div>
            <div className="text-gray-600">Nível Médio</div>
          </div>
        </div>
      </Card>

      {/* Ações da Conta */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Gerenciar Conta</h3>
        <div className="space-y-4">
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Sair da conta</h4>
              <p className="text-sm text-gray-600">
                Desconectar desta sessão
              </p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileManager;
