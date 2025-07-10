'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Hook para detectar dispositivos móveis
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouchDevice && isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// Componente Input para mobile
function MobileInput({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={`w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder:text-white/40 text-base focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 ${className}`}
      {...props}
    />
  )
}

// Componente Principal
export function Component() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Validação
  const validateForm = (isSignUp: boolean = false) => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'Senha é obrigatória';
    else if (password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    if (isSignUp) {
      if (!fullName) newErrors.fullName = 'Nome é obrigatório';
      if (!confirmPassword) newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      else if (password !== confirmPassword) newErrors.confirmPassword = 'Senhas não coincidem';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (!error) navigate('/');
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm(true)) return;
    setIsLoading(true);
    try {
      const { error } = await signUp(email, password, fullName);
      if (!error) {
        setEmail(''); setPassword(''); setFullName(''); setConfirmPassword('');
        setIsSignUpMode(false);
        toast({ title: "Conta criada com sucesso! 📧", description: "Verifique seu email para confirmar sua conta." });
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = isSignUpMode ? handleSignUp : handleLogin;

  // Versão Mobile
  if (isMobile) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-purple-900 via-purple-800 to-black relative overflow-hidden" style={{ height: '100dvh' }}>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-purple-700/30 to-black/90" />
        
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Top glow effect */}
        <motion.div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header Section */}
          <div className="flex-1 flex flex-col justify-center items-center pt-16 pb-8 px-6">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="mb-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center relative overflow-hidden">
                <span className="text-2xl font-bold text-white">M</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              </div>
            </motion.div>

            {/* Welcome Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold text-white mb-2">
                {isSignUpMode ? "Criar sua conta" : "Bem-vindo de volta"}
              </h1>
              <p className="text-white/60 text-base">
                {isSignUpMode ? "Junte-se ao Mindo" : "Entre para continuar no Mindo"}
              </p>
            </motion.div>
          </div>

          {/* Login Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex-1 relative"
          >
            <div className="bg-black/40 backdrop-blur-2xl rounded-t-3xl border-t border-white/10 shadow-2xl min-h-[60vh] relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" 
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                  }}
                />
              </div>

              <div className="relative z-10 p-6 pt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome Input (apenas no modo cadastro) */}
                  <AnimatePresence>
                    {isSignUpMode && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative"
                      >
                        <div className="relative">
                          <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                            focusedInput === "fullName" ? 'text-white' : 'text-white/40'
                          }`} />
                          <MobileInput
                            type="text"
                            placeholder="Nome completo"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            onFocus={() => setFocusedInput("fullName")}
                            onBlur={() => setFocusedInput(null)}
                            className="pl-12 pr-4"
                          />
                          {focusedInput === "fullName" && (
                            <motion.div 
                              layoutId="input-border"
                              className="absolute inset-0 rounded-xl border-2 border-white/30 pointer-events-none"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            />
                          )}
                        </div>
                        {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email Input */}
                  <motion.div 
                    className="relative"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="relative">
                      <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                        focusedInput === "email" ? 'text-white' : 'text-white/40'
                      }`} />
                      <MobileInput
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput(null)}
                        className="pl-12 pr-4"
                      />
                      {focusedInput === "email" && (
                        <motion.div 
                          layoutId="input-border"
                          className="absolute inset-0 rounded-xl border-2 border-white/30 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </div>
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </motion.div>

                  {/* Password Input */}
                  <motion.div 
                    className="relative"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                        focusedInput === "password" ? 'text-white' : 'text-white/40'
                      }`} />
                      <MobileInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput(null)}
                        className="pl-12 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
                        ) : (
                          <Eye className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
                        )}
                      </button>
                      {focusedInput === "password" && (
                        <motion.div 
                          layoutId="input-border"
                          className="absolute inset-0 rounded-xl border-2 border-white/30 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </div>
                    {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                  </motion.div>

                  {/* Confirm Password Input (apenas no modo cadastro) */}
                  <AnimatePresence>
                    {isSignUpMode && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative"
                      >
                        <div className="relative">
                          <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                            focusedInput === "confirmPassword" ? 'text-white' : 'text-white/40'
                          }`} />
                          <MobileInput
                            type="password"
                            placeholder="Confirmar senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onFocus={() => setFocusedInput("confirmPassword")}
                            onBlur={() => setFocusedInput(null)}
                            className="pl-12 pr-4"
                          />
                          {focusedInput === "confirmPassword" && (
                            <motion.div 
                              layoutId="input-border"
                              className="absolute inset-0 rounded-xl border-2 border-white/30 pointer-events-none"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            />
                          )}
                        </div>
                        {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Remember me & Forgot password */}
                  {!isSignUpMode && (
                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                            rememberMe ? 'bg-white border-white' : 'border-white/30 bg-transparent'
                          }`}>
                            {rememberMe && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center justify-center h-full"
                              >
                                <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </motion.div>
                            )}
                          </div>
                        </div>
                        <span className="text-white/70 text-base">Remember me</span>
                      </label>
                      <button type="button" className="text-white/70 hover:text-white transition-colors text-base">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Sign in button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative group mt-8"
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative overflow-hidden bg-white text-black font-semibold h-14 rounded-2xl transition-all duration-300 flex items-center justify-center text-base">
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            <span>{isSignUpMode ? 'Criando conta...' : 'Entrando...'}</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="sign-in"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center space-x-2"
                          >
                            <span>{isSignUpMode ? 'Criar conta' : 'Entrar'}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>

                  {/* Sign up link */}
                  <motion.p 
                    className="text-center text-white/60 mt-6 text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {isSignUpMode ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
                    <button 
                      type="button"
                      onClick={() => {
                        setIsSignUpMode(!isSignUpMode);
                        setErrors({});
                        setEmail(''); setPassword(''); setFullName(''); setConfirmPassword('');
                      }}
                      className="text-white font-medium hover:text-white/80 transition-colors"
                    >
                      {isSignUpMode ? 'Entrar' : 'Criar conta'}
                    </button>
                  </motion.p>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Versão Desktop (design original simplificado)
  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <div className="relative group">
          <div className="relative bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08] shadow-2xl overflow-hidden">
            {/* Logo and header */}
            <div className="text-center space-y-1 mb-5">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="mx-auto w-10 h-10 rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden"
              >
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">M</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
              >
                {isSignUpMode ? 'Criar Conta' : 'Bem-vindo de volta'}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/60 text-xs"
              >
                {isSignUpMode ? 'Junte-se ao Mindo e comece a aprender' : 'Entre para continuar no Mindo'}
              </motion.p>
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                {/* Name input - only for signup */}
                {isSignUpMode && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                  >
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <User className="absolute left-3 w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        placeholder="Nome completo"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white/5 border border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-3 focus:bg-white/10 rounded-lg focus:outline-none"
                        required={isSignUpMode}
                      />
                    </div>
                    {errors.fullName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs mt-1"
                      >
                        {errors.fullName}
                      </motion.p>
                    )}
                  </motion.div>
                )}

                {/* Email input */}
                <motion.div className="relative">
                  <div className="relative flex items-center overflow-hidden rounded-lg">
                    <Mail className="absolute left-3 w-4 h-4 text-white/40" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-3 focus:bg-white/10 rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs mt-1"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </motion.div>

                {/* Password input */}
                <motion.div className="relative">
                  <div className="relative flex items-center overflow-hidden rounded-lg">
                    <Lock className="absolute left-3 w-4 h-4 text-white/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-10 focus:bg-white/10 rounded-lg focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs mt-1"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </motion.div>
                
                {/* Confirm Password input - only for signup */}
                {isSignUpMode && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                  >
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Lock className="absolute left-3 w-4 h-4 text-white/40" />
                      <input
                        type="password"
                        placeholder="Confirmar senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white/5 border border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-3 focus:bg-white/10 rounded-lg focus:outline-none"
                        required={isSignUpMode}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs mt-1"
                      >
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Remember me & Forgot password - only for login mode */}
              {!isSignUpMode && (
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="appearance-none h-4 w-4 rounded border border-white/20 bg-white/5 checked:bg-white checked:border-white focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-200"
                      />
                      {rememberMe && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center text-black pointer-events-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </motion.div>
                      )}
                    </div>
                    <label htmlFor="remember-me" className="text-xs text-white/60 hover:text-white/80 transition-colors duration-200">
                      Remember me
                    </label>
                  </div>
                  
                  <div className="text-xs relative group/link">
                    <a href="#" className="text-white/60 hover:text-white transition-colors duration-200">
                      Forgot password?
                    </a>
                  </div>
                </div>
              )}

              {/* Sign in button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full relative group/button mt-5"
              >
                <div className="relative overflow-hidden bg-white text-black font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center"
                      >
                        <div className="w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="button-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-1 text-sm font-medium"
                      >
                        {isSignUpMode ? 'Criar Conta' : 'Entrar'}
                        <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform duration-300" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>

              {/* Toggle between login and signup */}
              <motion.p 
                className="text-center text-xs text-white/60 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {isSignUpMode ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
                <a 
                  href="#" 
                  className="relative inline-block group/signup"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSignUpMode(!isSignUpMode);
                    setErrors({});
                    setEmail(''); setPassword(''); setFullName(''); setConfirmPassword('');
                  }}
                >
                  <span className="relative z-10 text-white group-hover/signup:text-white/70 transition-colors duration-300 font-medium">
                    {isSignUpMode ? 'Entrar' : 'Criar conta'}
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover/signup:w-full transition-all duration-300" />
                </a>
              </motion.p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Export default para compatibilidade com imports existentes
export default Component; 