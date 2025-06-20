
-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas seu próprio perfil
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Política para permitir que usuários atualizem apenas seu próprio perfil
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Trigger para executar a função quando um usuário é criado
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atualizar a tabela revisoes para usar RLS baseado no usuário
ALTER TABLE public.revisoes ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas suas próprias revisões
CREATE POLICY "Users can view own revisoes" 
  ON public.revisoes 
  FOR SELECT 
  USING (auth.uid() = usuario_id);

-- Política para permitir que usuários criem suas próprias revisões
CREATE POLICY "Users can create own revisoes" 
  ON public.revisoes 
  FOR INSERT 
  WITH CHECK (auth.uid() = usuario_id);

-- Política para permitir que usuários atualizem suas próprias revisões
CREATE POLICY "Users can update own revisoes" 
  ON public.revisoes 
  FOR UPDATE 
  USING (auth.uid() = usuario_id);

-- Política para permitir que usuários excluam suas próprias revisões
CREATE POLICY "Users can delete own revisoes" 
  ON public.revisoes 
  FOR DELETE 
  USING (auth.uid() = usuario_id);
