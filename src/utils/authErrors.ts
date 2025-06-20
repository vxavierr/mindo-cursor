
export const translateAuthError = (error: string): string => {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Email ou senha incorretos',
    'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
    'User already registered': 'Este email já está cadastrado',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
    'Unable to validate email address: invalid format': 'Formato de email inválido',
    'Signup requires a valid password': 'Senha é obrigatória para o cadastro',
    'Email rate limit exceeded': 'Muitas tentativas. Aguarde alguns minutos.',
    'For security purposes, you can only request this after': 'Por segurança, aguarde alguns minutos antes de tentar novamente',
    'Invalid email or password': 'Email ou senha incorretos',
    'Email link is invalid or has expired': 'Link de email inválido ou expirado',
    'Token has expired': 'Token expirado. Solicite um novo link de confirmação.',
    'Invalid token': 'Token inválido'
  };

  // Procurar por correspondências parciais
  for (const [key, value] of Object.entries(errorMap)) {
    if (error.includes(key)) {
      return value;
    }
  }

  return error; // Retorna o erro original se não encontrar tradução
};

export const getAuthErrorType = (error: string): 'email_not_confirmed' | 'invalid_credentials' | 'user_exists' | 'rate_limit' | 'validation' | 'generic' => {
  if (error.includes('Email not confirmed')) return 'email_not_confirmed';
  if (error.includes('Invalid login credentials') || error.includes('Invalid email or password')) return 'invalid_credentials';
  if (error.includes('User already registered')) return 'user_exists';
  if (error.includes('rate limit') || error.includes('For security purposes')) return 'rate_limit';
  if (error.includes('invalid format') || error.includes('Password should be')) return 'validation';
  return 'generic';
};
