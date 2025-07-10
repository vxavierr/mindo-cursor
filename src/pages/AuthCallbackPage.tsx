import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const { setManualLogin } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Pega os parâmetros da URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParams = new URLSearchParams(window.location.search);
        
        // Verifica se há tokens na URL
        const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');
        const tokenType = hashParams.get('token_type') || searchParams.get('token_type');

        if (accessToken && refreshToken) {
          // Flag para mostrar toast de boas-vindas após confirmação do email
          setManualLogin();
          
          // Define a sessão com os tokens recebidos
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            setStatus('error');
            setMessage('Erro na confirmação: ' + error.message);
            return;
          }

          if (data.session) {
            setStatus('success');
            setMessage('Email confirmado com sucesso!');
            
            // Redireciona após 2 segundos
            setTimeout(() => {
              navigate('/');
            }, 2000);
          }
        } else {
          // Tenta pegar a sessão atual
          const { data, error } = await supabase.auth.getSession();

          if (error) {
            setStatus('error');
            setMessage('Erro na confirmação: ' + error.message);
            return;
          }

          if (data.session) {
            setStatus('success');
            setMessage('Email confirmado com sucesso!');
            
            setTimeout(() => {
              navigate('/');
            }, 2000);
          } else {
            setStatus('error');
            setMessage('Link de confirmação inválido ou expirado.');
          }
        }
      } catch (err) {
        console.error('Erro na confirmação:', err);
        setStatus('error');
        setMessage('Erro inesperado na confirmação.');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-600" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-600" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Confirmando email...';
      case 'success':
        return 'Email confirmado!';
      case 'error':
        return 'Erro na confirmação';
    }
  };

  const getDescription = () => {
    switch (status) {
      case 'loading':
        return 'Aguarde enquanto confirmamos seu email.';
      case 'success':
        return 'Você será redirecionado automaticamente.';
      case 'error':
        return message;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              {getIcon()}
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {getTitle()}
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">{getDescription()}</p>

            {status === 'success' && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Bem-vindo ao Mindo! Sua conta foi ativada com sucesso.
                </AlertDescription>
              </Alert>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
                
                <Button 
                  onClick={() => navigate('/auth')}
                  className="w-full"
                  variant="outline"
                >
                  Voltar para Login
                </Button>
              </div>
            )}

            {status === 'loading' && (
              <div className="flex justify-center">
                <div className="animate-pulse flex space-x-1">
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Background decorations */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          />
          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-40 right-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          />
        </div>
      </motion.div>
    </div>
  );
} 