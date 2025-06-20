
import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Brain, 
  Clock,
  Award,
  Zap,
  BarChart3
} from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LearningEntry {
  id: string;
  content: string;
  createdAt: string;
  step: number;
  reviews: Array<{ 
    date: string; 
    questions?: string[]; 
    answers?: string[]; 
    step?: number;
  }>;
  tags: string[];
}

interface LearningAnalyticsProps {
  entries: LearningEntry[];
}

const LearningAnalytics = ({ entries }: LearningAnalyticsProps) => {
  const analytics = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sevenDaysAgo = subDays(now, 7);

    // Dados de progresso diário (últimos 30 dias)
    const dailyProgress = [];
    for (let i = 30; i >= 0; i--) {
      const date = subDays(now, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const newEntries = entries.filter(entry => 
        format(new Date(entry.createdAt), 'yyyy-MM-dd') === dateStr
      ).length;
      
      const reviews = entries.reduce((total, entry) => {
        return total + entry.reviews.filter(review => 
          format(new Date(review.date), 'yyyy-MM-dd') === dateStr
        ).length;
      }, 0);

      dailyProgress.push({
        date: format(date, 'dd/MM', { locale: ptBR }),
        fullDate: dateStr,
        newEntries,
        reviews,
        total: newEntries + reviews
      });
    }

    // Distribuição por nível de revisão
    const stepDistribution = entries.reduce((acc, entry) => {
      const stepLabel = getStepLabel(entry.step);
      acc[stepLabel] = (acc[stepLabel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const stepData = Object.entries(stepDistribution).map(([step, count]) => ({
      step,
      count,
      percentage: Math.round((count / entries.length) * 100)
    }));

    // Top tags
    const tagCount = entries.reduce((acc, entry) => {
      entry.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const topTags = Object.entries(tagCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    // Taxa de retenção semanal
    const weeklyRetention = entries.filter(entry => {
      const created = new Date(entry.createdAt);
      return created >= sevenDaysAgo && entry.reviews.length > 0;
    }).length;

    const weeklyTotal = entries.filter(entry => {
      const created = new Date(entry.createdAt);
      return created >= sevenDaysAgo;
    }).length;

    const retentionRate = weeklyTotal > 0 ? Math.round((weeklyRetention / weeklyTotal) * 100) : 0;

    // Estatísticas gerais
    const totalReviews = entries.reduce((total, entry) => total + entry.reviews.length, 0);
    const averageReviews = entries.length > 0 ? Math.round(totalReviews / entries.length * 10) / 10 : 0;
    
    const recentEntries = entries.filter(entry => {
      const created = new Date(entry.createdAt);
      return created >= sevenDaysAgo;
    }).length;

    const streak = calculateStreak(entries);
    const monthlyGoal = 30; // meta de 30 aprendizados por mês
    const monthlyProgress = entries.length;

    return {
      dailyProgress,
      stepData,
      topTags,
      stats: {
        totalEntries: entries.length,
        totalReviews,
        averageReviews,
        retentionRate,
        recentEntries,
        streak,
        monthlyProgress,
        monthlyGoal
      }
    };
  }, [entries]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Aprendizados"
          value={analytics.stats.totalEntries}
          icon={Brain}
          color="blue"
          subtitle="registrados"
        />
        
        <StatCard
          title="Taxa de Retenção"
          value={`${analytics.stats.retentionRate}%`}
          icon={Target}
          color="green"
          subtitle="última semana"
        />
        
        <StatCard
          title="Sequência Atual"
          value={analytics.stats.streak}
          icon={Zap}
          color="orange"
          subtitle="dias consecutivos"
        />
        
        <StatCard
          title="Meta Mensal"
          value={`${analytics.stats.monthlyProgress}/${analytics.stats.monthlyGoal}`}
          icon={Award}
          color="purple"
          subtitle="aprendizados"
          progress={Math.round((analytics.stats.monthlyProgress / analytics.stats.monthlyGoal) * 100)}
        />
      </div>

      {/* Gráfico de progresso diário */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Atividade dos Últimos 30 Dias
          </h3>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.dailyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                labelFormatter={(label) => `Data: ${label}`}
                formatter={(value, name) => [
                  value, 
                  name === 'newEntries' ? 'Novos Aprendizados' : 
                  name === 'reviews' ? 'Revisões' : 'Total'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="newEntries" 
                stackId="1"
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="reviews" 
                stackId="1"
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por nível */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Distribuição por Nível
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.stepData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="step" />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'Quantidade']} />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Tags */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Tags Mais Usadas
          </h3>
          
          <div className="space-y-3">
            {analytics.topTags.slice(0, 8).map((item, index) => (
              <div key={item.tag} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm truncate max-w-32">{item.tag}</span>
                </div>
                <Badge variant="secondary">{item.count}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  color: 'blue' | 'green' | 'orange' | 'purple';
  subtitle: string;
  progress?: number;
}

const StatCard = ({ title, value, icon: Icon, color, subtitle, progress }: StatCardProps) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    green: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    orange: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
    purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {progress !== undefined && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                color === 'blue' ? 'bg-blue-600' :
                color === 'green' ? 'bg-green-600' :
                color === 'orange' ? 'bg-orange-600' :
                'bg-purple-600'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{progress}% da meta</p>
        </div>
      )}
    </Card>
  );
};

const getStepLabel = (step: number): string => {
  const labels = ['Novo', '1 dia', '3 dias', '1 semana', '2 semanas', '1 mês', '2+ meses'];
  return labels[Math.min(step, labels.length - 1)];
};

const calculateStreak = (entries: LearningEntry[]): number => {
  if (entries.length === 0) return 0;

  const today = startOfDay(new Date());
  let streak = 0;
  let currentDate = today;

  // Verificar cada dia consecutivo
  while (true) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const hasActivity = entries.some(entry => {
      const entryDate = format(new Date(entry.createdAt), 'yyyy-MM-dd');
      const hasReviews = entry.reviews.some(review => 
        format(new Date(review.date), 'yyyy-MM-dd') === dateStr
      );
      return entryDate === dateStr || hasReviews;
    });

    if (hasActivity) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }

  return streak;
};

export default LearningAnalytics;
