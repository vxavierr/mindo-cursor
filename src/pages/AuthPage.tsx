
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UpdatedLoginForm } from '@/components/auth/UpdatedLoginForm';
import { UpdatedSignupForm } from '@/components/auth/UpdatedSignupForm';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Erro no login",
        description: error.message,
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
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          name: name
        }
      }
    });

    if (error) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive"
      });
    } else if (data.user) {
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar a conta."
      });
    }
    
    setIsLoading(false);
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
            <UpdatedLoginForm onLogin={handleLogin} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="signup">
            <UpdatedSignupForm onSignup={handleSignup} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthPage;
