
-- Adicionar política RLS para permitir que usuários criem seus próprios perfis
CREATE POLICY "Users can create own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);
