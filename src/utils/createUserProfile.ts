
import { supabase } from '@/integrations/supabase/client';

export const createUserProfileIfNotExists = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    // Verificar se o perfil já existe
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingProfile) return;

    // Criar perfil se não existir
    const { error } = await supabase
      .from('profiles')
      .insert([{
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || 'Xavier'
      }]);

    if (error) {
      console.error('Erro ao criar perfil:', error);
    } else {
      console.log('Perfil criado com sucesso');
    }
  } catch (error) {
    console.error('Erro inesperado ao criar perfil:', error);
  }
};
