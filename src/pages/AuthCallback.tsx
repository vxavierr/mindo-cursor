
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro na confirmação:', error);
          setStatus('error');
          setMessage('Erro ao confirmar email. O link pode ter expirado.');
          return;
        }

        if (data.session) {
          setStatus('success');
          setMessage('Email confirmado com sucesso! Você será redirecionado em instantes.');
          
          // Redirecionar após 3 segundos
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 3000);
        } else {
          setStatus('error');
          setMessage('Link de confirmação inválido ou expirado.');
        }
      } catch (error) {
        console.error('Erro inesperado:', error);
        setStatus('error');
        setMessage('Erro inesperado. Tente novamente.');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFBEA] via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              Confirmando seu email...
            </h1>
            <p className="text-gray-600">
              Aguarde enquanto processamos sua confirmação.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              Email Confirmado!
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <Button 
              onClick={() => navigate('/', { replace: true })}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Ir para o App
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              Erro na Confirmação
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/auth', { replace: true })}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Ir para Login
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Tentar Novamente
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default AuthCallback;
