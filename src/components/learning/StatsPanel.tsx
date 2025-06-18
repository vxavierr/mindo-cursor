
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BookOpen, Calendar, Target, Clock, Brain } from 'lucide-react';

interface StatsEntry {
  id: string;
  content: string;
  createdAt: Date;
  step: number;
}

interface StatsPanelProps {
  entries: StatsEntry[];
}

const StatsPanel = ({ entries }: StatsPanelProps) => {
  const totalEntries = entries.length;
  const entriesThisWeek = entries.filter(
    entry => entry.createdAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;
  const completedReviews = entries.filter(entry => entry.step > 0).length;
  const avgStep = entries.length > 0 
    ? Math.round(entries.reduce((sum, entry) => sum + entry.step, 0) / entries.length * 10) / 10
    : 0;

  const stepDistribution = entries.reduce((acc, entry) => {
    acc[entry.step] = (acc[entry.step] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const stepLabels = ['Novo', '1 dia', '3 dias', '1 semana', '2 semanas', '1 mês', '2 meses'];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Suas Estatísticas de Aprendizado
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Acompanhe seu progresso e mantenha-se motivado
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEntries}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total de Aprendizados</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{entriesThisWeek}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Esta Semana</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedReviews}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Revisões Feitas</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgStep}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Nível Médio</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Distribution */}
      <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Distribuição de Progresso
            </h3>
          </div>
          
          <div className="space-y-4">
            {stepLabels.map((label, index) => {
              const count = stepDistribution[index] || 0;
              const percentage = totalEntries > 0 ? (count / totalEntries) * 100 : 0;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-sm">
                        {label}
                      </Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {count} itens
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      {entries.length > 0 && (
        <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Atividade Recente
              </h3>
            </div>
            
            <div className="space-y-4">
              {entries
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, 5)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <Badge variant="secondary" className="mt-1">
                      {stepLabels[entry.step]}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white leading-relaxed">
                        {entry.content}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {entry.createdAt.toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StatsPanel;
