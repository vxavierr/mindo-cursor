
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
      icon: BookOpen
    },
    {
      title: 'Esta Semana',
      value: stats.weeklyEntries,
      subtitle: 'novos',
      icon: TrendingUp
    },
    {
      title: 'Revisões',
      value: stats.totalReviews,
      subtitle: 'completadas',
      icon: Target
    },
    {
      title: 'Hoje',
      value: reviewsToday,
      subtitle: 'pendentes',
      icon: Calendar
    }
  ];

  if (totalEntries === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-6 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-light text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsOverview;
