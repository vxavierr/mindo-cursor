
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UpdatedLoginForm } from '@/components/auth/UpdatedLoginForm';
import { UpdatedSignupForm } from '@/components/auth/UpdatedSignupForm';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { translateAuthError, getAuthErrorType } from '@/utils/authErrors';

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginErrorType, setLoginErrorType] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setLoginError(null);
    setLoginErrorType(null);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const translatedError = translateAuthError(error.message);
      const errorType = getAuthErrorType(error.message);
      
      setLoginError(translatedError);
      setLoginErrorType(errorType);
      
      toast({
        title: "Erro no login",
        description: translatedError,
        variant: "destructive"
      });
    } else if (data.user) {
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo de volta!`
      });
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setSignupError(null);
    setSignupSuccess(false);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          name: name
        }
      }
    });

    if (error) {
      const translatedError = translateAuthError(error.message);
      setSignupError(translatedError);
      
      toast({
        title: "Erro no cadastro",
        description: translatedError,
        variant: "destructive"
      });
    } else if (data.user) {
      setSignupSuccess(true);
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar a conta."
      });
    }
    
    setIsLoading(false);
  };

  const handleResendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });

    if (error) {
      const translatedError = translateAuthError(error.message);
      toast({
        title: "Erro ao reenviar email",
        description: translatedError,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Email reenviado!",
        description: "Verifique sua caixa de entrada."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFBEA] via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Revisão Espaçada
          </h1>
          <p className="text-gray-600 text-sm">
            Acesse sua conta para continuar aprendendo
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <UpdatedLoginForm 
              onLogin={handleLogin} 
              onResendConfirmation={handleResendConfirmation}
              isLoading={isLoading}
              error={loginError}
              errorType={loginErrorType}
            />
          </TabsContent>

          <TabsContent value="signup">
            <UpdatedSignupForm 
              onSignup={handleSignup} 
              isLoading={isLoading}
              error={signupError}
              success={signupSuccess}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthPage;
