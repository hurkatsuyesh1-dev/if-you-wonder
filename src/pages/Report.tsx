import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpends } from '@/context/SpendContext';
import { MonthlyReportCard } from '@/components/MonthlyReportCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { getMonthlyRecommendation } from '@/lib/nudges';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Report() {
  const navigate = useNavigate();
  const { spends, getMonthlyStats } = useSpends();
  
  const stats = getMonthlyStats();
  const recommendation = getMonthlyRecommendation(spends);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">Monthly Report</h1>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-6">
        {spends.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-lg font-semibold mb-2">No data yet</h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
              Start logging your spends to see insights and patterns in your monthly report
            </p>
            <Link to="/log">
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                Log Your First Spend
              </Button>
            </Link>
          </div>
        ) : (
          <div className="animate-fade-in">
            <MonthlyReportCard 
              stats={stats}
              recommendation={recommendation}
            />
          </div>
        )}
      </main>
    </div>
  );
}
