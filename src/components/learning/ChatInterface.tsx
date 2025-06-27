
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { Send, Lightbulb, BookOpen, Target, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  onAddEntry: (content: string, context?: string) => void;
}

const ChatInterface = ({ onAddEntry }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'system',
      content: 'Olá! Estou aqui para ajudar você a registrar seus aprendizados. Digite algo como "Aprendi que..." ou "Hoje descobri..." e eu organizarei tudo para suas revisões futuras.',
      timestamp: new Date()
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const detectLearningCommand = (text: string) => {
    const triggers = [
      'aprendi que',
      'hoje aprendi',
      'descobri que',
      'entendi que',
      'estudei sobre',
      'li sobre',
      'vi que',
      'percebi que',
      'compreendi que'
    ];
    
    const lowerText = text.toLowerCase();
    return triggers.some(trigger => lowerText.includes(trigger));
  };

  const extractLearningContent = (text: string) => {
    const patterns = [
      /(?:aprendi que|hoje aprendi|descobri que|entendi que|estudei sobre|li sobre|vi que|percebi que|compreendi que)\s*(.*)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return text.trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsProcessing(true);
    
    // Add user message to chat
    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, userMessage]);

    // Process the message
    setTimeout(() => {
      if (detectLearningCommand(message)) {
        const learningContent = extractLearningContent(message);
        onAddEntry(learningContent);
        
        const systemResponse = {
          type: 'system',
          content: `✅ Perfeito! Registrei seu aprendizado: "${learningContent}". Vou lembrá-lo de revisar isso em 1 dia, depois em 3 dias, e assim por diante. Continue aprendendo!`,
          timestamp: new Date()
        };
        setChatHistory(prev => [...prev, systemResponse]);
        
        toast({
          title: "Aprendizado registrado!",
          description: "Sua próxima revisão será amanhã."
        });
      } else {
        const systemResponse = {
          type: 'system',
          content: 'Hmm, não identifiquei um comando de aprendizado. Tente começar com "Aprendi que...", "Hoje descobri..." ou similar. Posso ajudar você a formular melhor?',
          timestamp: new Date()
        };
        setChatHistory(prev => [...prev, systemResponse]);
      }
      
      setMessage('');
      setIsProcessing(false);
    }, 1000);
  };

  const quickCommands = [
    { text: "Aprendi que", icon: Lightbulb },
    { text: "Hoje descobri", icon: BookOpen },
    { text: "Entendi que", icon: Target }
  ];

  return (
    <div className="space-y-6">
      {/* Chat History */}
      <Card className="h-96 overflow-y-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
        <div className="p-6 space-y-4">
          {chatHistory.map((entry, index) => (
            <div
              key={index}
              className={`flex ${entry.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  entry.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="leading-relaxed">{entry.content}</p>
                <p className={`text-xs mt-2 ${
                  entry.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {entry.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white p-4 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </Card>

      {/* Quick Commands */}
      <div className="flex flex-wrap gap-3 justify-center">
        {quickCommands.map((cmd, index) => {
          const Icon = cmd.icon;
          return (
            <Button
              key={index}
              variant="outline"
              onClick={() => setMessage(cmd.text + ' ')}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Icon className="w-4 h-4 mr-2" />
              {cmd.text}
            </Button>
          );
        })}
      </div>

      {/* Input Form */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <RichTextEditor
              content={message}
              onChange={setMessage}
              placeholder="Digite aqui... Ex: 'Aprendi que React hooks permitem usar estado em componentes funcionais'"
              minHeight="120px"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Comece com "Aprendi que...", "Hoje descobri..." ou similar
              </p>
              <Button
                type="submit"
                disabled={!message.trim() || isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                {isProcessing ? (
                  <>Processando...</>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ChatInterface;
