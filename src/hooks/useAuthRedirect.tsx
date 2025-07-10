import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface UseAuthRedirectOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

export const useAuthRedirect = (options: UseAuthRedirectOptions = {}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { redirectTo = '/', requireAuth = true } = options;

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !user) {
      // Se autenticação é necessária mas não há usuário, redireciona para login
      navigate('/auth', { state: { from: location } });
    } else if (!requireAuth && user) {
      // Se não precisa de autenticação mas há usuário logado, redireciona
      const from = location.state?.from?.pathname || redirectTo;
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location, redirectTo, requireAuth]);

  return { user, loading };
}; 