import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Bypass temporário para testes - verificar se há parâmetro na URL
  const urlParams = new URLSearchParams(location.search);
  const testMode = urlParams.get('test') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Bypass para testes
  if (testMode) {
    console.log('🧪 MODO DE TESTE ATIVO - Bypass de autenticação');
    return <>{children}</>;
  }

  if (!user) {
    // Redireciona para a página de login mantendo a URL de destino
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}; 