import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpends } from '@/context/SpendContext';
import { RegretMeter } from '@/components/RegretMeter';
import { StreakCounter } from '@/components/StreakCounter';
import { HabitNudge } from '@/components/HabitNudge';
import { RoundedSavings } from '@/components/RoundedSavings';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { generateNudges } from '@/lib/nudges';
import { formatCurrency } from '@/hooks/useFutureValue';
import { PlusCircle, TrendingUp, ArrowRight } from 'lucide-react';

export default function Index() {
  const { spends, streakDays, getMonthlyStats } = useSpends();
  const [dismissedNudges, setDismissedNudges] = useState<string[]>([]);
  
  const stats = getMonthlyStats();
  const nudges = generateNudges(spends).filter(n => !dismissedNudges.includes(n.id));
  
  const recentSpends = spends.slice(0, 10);
  const avgRegret = recentSpends.length > 0
    ? recentSpends.reduce((sum, s) => {
        const baseScore = Math.min(40, (s.amount / 500) * 40);
        const typeScore = s.type === 'need' ? 5 : s.type === 'want' ? 25 : s.type === 'impulse' ? 40 : 20;
        return sum + baseScore + typeScore;
      }, 0) / recentSpends.length
    : 0;

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gradient">Regret Calculator</h1>
            <p className="text-xs text-muted-foreground">Think before you spend</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6">
        <section className="text-center animate-fade-in">
          <p className="text-sm text-muted-foreground mb-4">
            {spends.length > 0 ? "Your recent spending regret level" : "Ready to build better money habits?"}
          </p>
          <div className="flex justify-center">
            <RegretMeter score={avgRegret} size="lg" showLabel />
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="p-4 rounded-xl bg-card border border-border shadow-soft">
            <p className="text-xs text-muted-foreground mb-1">This month spent</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</p>
          </div>
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <p className="text-xs text-destructive/80 mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />Future value lost
            </p>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(stats.totalFutureLost)}</p>
          </div>
        </section>

        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <StreakCounter days={streakDays} />
        </section>

        {nudges.length > 0 && (
          <section className="space-y-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {nudges.slice(0, 2).map(nudge => (
              <HabitNudge key={nudge.id} nudge={nudge} onDismiss={() => setDismissedNudges(prev => [...prev, nudge.id])} />
            ))}
          </section>
        )}

        {stats.roundedSavings > 0 && (
          <section className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <RoundedSavings amount={stats.roundedSavings} totalSpent={stats.totalSpent} />
          </section>
        )}

        <section className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Link to="/log">
            <Button size="lg" className="w-full h-14 text-lg font-semibold shadow-glow">
              <PlusCircle className="w-5 h-5 mr-2" />Log a Spend<ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </section>

        {spends.length === 0 && (
          <section className="text-center py-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-lg font-semibold mb-2">Start your journey</h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">Log your first spend to see how small purchases today become big regrets tomorrow</p>
          </section>
        )}

        {spends.length > 0 && (
          <section className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Recent Spends</h3>
              <Link to="/report" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-2">
              {spends.slice(0, 3).map(spend => (
                <div key={spend.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {spend.category === 'food' ? '🍕' : spend.category === 'transport' ? '🚕' : spend.category === 'shopping' ? '🛍️' : spend.category === 'entertainment' ? '🎮' : spend.category === 'bills' ? '📄' : spend.category === 'health' ? '💊' : '📦'}
                    </span>
                    <div>
                      <p className="font-medium text-sm capitalize">{spend.description || spend.category}</p>
                      <p className="text-xs text-muted-foreground">{new Date(spend.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(spend.amount)}</p>
                    {spend.type && <span className={`text-xs font-medium ${spend.type === 'need' ? 'text-spend-need' : spend.type === 'want' ? 'text-spend-want' : 'text-spend-impulse'}`}>{spend.type}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}