
import { Card } from '@/components/ui/card';
import { TrendingUp, Target, Calendar, BookOpen } from 'lucide-react';
import { useMemo } from 'react';

interface StatsOverviewProps {
  totalEntries: number;
  reviewsToday: number;
  entries: Array<{
    createdAt: string;
    step?: number;
    tags: string[];
    reviews?: Array<{ date: string }>;
  }>;
}

const StatsOverview = ({ totalEntries, reviewsToday, entries }: StatsOverviewProps) => {
  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyEntries = entries.filter(entry => 
      new Date(entry.createdAt) >= weekAgo
    ).length;
    
    const totalReviews = entries.reduce((sum, entry) => 
      sum + (entry.reviews?.length || 0), 0
    );
    
    const averageStep = entries.length > 0 
      ? entries.reduce((sum, entry) => sum + (entry.step || 0), 0) / entries.length
      : 0;

    return {
      weeklyEntries,
      totalReviews,
      averageStep: Math.round(averageStep * 10) / 10
    };
  }, [entries]);

  const statCards = [
    {
      title: 'Total',
      value: totalEntries,
      subtitle: 'aprendizados',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Esta Semana',
      value: stats.weeklyEntries,
      subtitle: 'novos registros',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Revisões',
      value: stats.totalReviews,
      subtitle: 'completadas',
      icon: Target,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Hoje',
      value: reviewsToday,
      subtitle: 'para revisar',
      icon: Calendar,
      color: reviewsToday > 0 ? 'from-orange-500 to-red-500' : 'from-gray-400 to-gray-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{stat.subtitle}</p>
              </div>
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsOverview;
