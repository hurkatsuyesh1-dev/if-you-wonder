import React, { useRef } from 'react';
import { MonthlyStats, Category, MoodTag, SpendType } from '@/types/spend';
import { formatCurrency } from '@/hooks/useFutureValue';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingDown, 
  TrendingUp, 
  Brain, 
  Download,
  AlertTriangle,
  ThumbsUp
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface MonthlyReportCardProps {
  stats: MonthlyStats;
  recommendation: string;
  className?: string;
}

const categoryEmojis: Record<Category, string> = {
  food: '🍕',
  transport: '🚕',
  shopping: '🛍️',
  entertainment: '🎮',
  bills: '📄',
  health: '💊',
  other: '📦',
};

const moodEmojis: Record<MoodTag, string> = {
  hungry: '🍔',
  bored: '😴',
  stressed: '😤',
  tired: '😩',
};

const typeLabels: Record<SpendType, { label: string; color: string }> = {
  need: { label: 'Needs', color: 'text-spend-need' },
  want: { label: 'Wants', color: 'text-spend-want' },
  impulse: { label: 'Impulse', color: 'text-spend-impulse' },
};

export function MonthlyReportCard({ stats, recommendation, className }: MonthlyReportCardProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!reportRef.current) return;
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `regret-report-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const sortedCategories = Object.entries(stats.byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const sortedMoods = Object.entries(stats.byMood)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Monthly Regret Report</h2>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div ref={reportRef} className="space-y-4 p-4 bg-background rounded-xl">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingDown className="w-4 h-4" />
                <span className="text-xs">Total Spent</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">Future Value Lost</span>
              </div>
              <p className="text-2xl font-bold text-destructive">
                {formatCurrency(stats.totalFutureLost)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Spend by Type */}
        {Object.keys(stats.byType).length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Spending by Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(Object.entries(stats.byType) as [SpendType, number][]).map(([type, amount]) => {
                const { label, color } = typeLabels[type];
                const percentage = (amount / stats.totalSpent * 100).toFixed(0);
                return (
                  <div key={type} className="flex items-center gap-2">
                    <span className={cn("text-sm font-medium w-16", color)}>{label}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          type === 'need' && "bg-spend-need",
                          type === 'want' && "bg-spend-want",
                          type === 'impulse' && "bg-spend-impulse"
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-20 text-right">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Top Regrets */}
        {stats.topRegrets.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                Most Regrettable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.topRegrets.slice(0, 5).map((spend, i) => (
                  <div key={spend.id} className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{i + 1}.</span>
                    <span>{categoryEmojis[spend.category]}</span>
                    <span className="flex-1 truncate">{spend.description || spend.category}</span>
                    <span className="font-medium">{formatCurrency(spend.amount)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Least Regrets */}
        {stats.leastRegrets.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-spend-need" />
                Smart Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.leastRegrets.slice(0, 5).map((spend, i) => (
                  <div key={spend.id} className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{i + 1}.</span>
                    <span>{categoryEmojis[spend.category]}</span>
                    <span className="flex-1 truncate">{spend.description || spend.category}</span>
                    <span className="font-medium text-spend-need">{formatCurrency(spend.amount)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mood Correlations */}
        {Object.keys(stats.byMood).length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Mood-Spend Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {sortedMoods.map(([mood, amount]) => (
                  <div 
                    key={mood} 
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                  >
                    <span className="text-xl">{moodEmojis[mood as MoodTag]}</span>
                    <div>
                      <p className="text-xs text-muted-foreground capitalize">{mood}</p>
                      <p className="text-sm font-medium">{formatCurrency(amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendation */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="text-sm font-medium text-primary mb-1">
                  Recommendation for next month
                </p>
                <p className="text-sm text-muted-foreground">{recommendation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
