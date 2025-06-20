
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, Eye, EyeOff, AlertCircle, RefreshCw } from 'lucide-react';

interface UpdatedLoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onResendConfirmation: (email: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  errorType: string | null;
}

export const UpdatedLoginForm = ({ 
  onLogin, 
  onResendConfirmation, 
  isLoading, 
  error, 
  errorType 
}: UpdatedLoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      await onLogin(email, password);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) return;
    setIsResending(true);
    await onResendConfirmation(email);
    setIsResending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant={errorType === 'email_not_confirmed' ? 'default' : 'destructive'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            {errorType === 'email_not_confirmed' && (
              <div className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResendConfirmation}
                  disabled={!email || isResending}
                  className="text-xs"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Reenviando...
                    </>
                  ) : (
                    'Reenviar email de confirmação'
                  )}
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

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

      <Button
        type="submit"
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        disabled={isLoading}
      >
        {isLoading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
};
