
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface UpdatedSignupFormProps {
  onSignup: (email: string, password: string, name: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export const UpdatedSignupForm = ({ 
  onSignup, 
  isLoading, 
  error, 
  success 
}: UpdatedSignupFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }

    if (name && email && password) {
      await onSignup(email, password, name);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Conta criada com sucesso!
          </h3>
          <p className="text-sm text-gray-600">
            Enviamos um email de confirmação para <strong>{email}</strong>
          </p>
          <p className="text-xs text-gray-500">
            Verifique sua caixa de entrada e clique no link para ativar sua conta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-700">Nome</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="pl-10 h-12 bg-white border-gray-200"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="pl-10 h-12 bg-white border-gray-200"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700">Senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-10 pr-10 h-12 bg-white border-gray-200"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-700">Confirmar Senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-10 h-12 bg-white border-gray-200"
            required
          />
        </div>
      </div>

      {password !== confirmPassword && confirmPassword && (
        <p className="text-sm text-red-600">As senhas não coincidem</p>
      )}

      <Button
        type="submit"
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        disabled={isLoading || password !== confirmPassword}
      >
        {isLoading ? 'Criando conta...' : 'Criar Conta'}
      </Button>
    </form>
  );
};
