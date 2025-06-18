
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, BookOpen, Users, Zap, ArrowRight, Moon, Sun } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (currentUser) {
    return <Dashboard user={currentUser} onLogout={() => setCurrentUser(null)} toggleTheme={toggleTheme} darkMode={darkMode} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300`}>
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SpaceLearn</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Aprenda Mais,
                <span className="text-blue-600 dark:text-blue-400"> Lembre Melhor</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Sistema inteligente de revisão espaçada que transforma seus aprendizados em conhecimento duradouro através de comandos naturais.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Interface Conversacional</h3>
                    <p className="text-gray-600 dark:text-gray-300">Digite naturalmente: "Aprendi que..." e o sistema organiza tudo</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Revisão Espaçada</h3>
                    <p className="text-gray-600 dark:text-gray-300">Algoritmo científico: 1, 3, 7, 14, 30, 60 dias</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Multiusuário</h3>
                    <p className="text-gray-600 dark:text-gray-300">Dados seguros e privados para cada usuário</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Auth Section */}
          <div className="lg:pl-12">
            <Card className="p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-2xl">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {showLogin ? 'Entrar' : 'Criar Conta'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {showLogin ? 'Acesse sua conta e continue aprendendo' : 'Comece sua jornada de aprendizado'}
                  </p>
                </div>

                {showLogin ? (
                  <LoginForm onLogin={setCurrentUser} />
                ) : (
                  <SignupForm onSignup={setCurrentUser} />
                )}

                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => setShowLogin(!showLogin)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    {showLogin ? 'Não tem conta? Criar agora' : 'Já tem conta? Entrar'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
