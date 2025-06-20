
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
        // Se o perfil não existe, criar um
        if (error.code === 'PGRST116') {
          await createProfile();
        } else {
          toast({
            title: "Erro ao carregar perfil",
            description: "Verifique sua conexão e tente novamente",
            variant: "destructive"
          });
        }
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Erro inesperado ao carregar perfil:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente recarregar a página",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email || ''
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar perfil:', error);
        return;
      }

      setProfile(data);
      toast({
        title: "Perfil criado!",
        description: "Seu perfil foi configurado com sucesso."
      });
    } catch (error) {
      console.error('Erro inesperado ao criar perfil:', error);
    }
  };

  const updateProfile = async (updates: Partial<Pick<UserProfile, 'full_name'>>) => {
    if (!user || !profile) return false;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        toast({
          title: "Erro ao atualizar",
          description: "Verifique sua conexão e tente novamente",
          variant: "destructive"
        });
        return false;
      }

      setProfile(data);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso."
      });
      return true;
    } catch (error) {
      console.error('Erro inesperado ao atualizar perfil:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  return {
    profile,
    loading,
    updateProfile,
    refreshProfile: loadProfile
  };
};
