import React from 'react';
import { cn } from '@/lib/utils';
import { Flame, Trophy } from 'lucide-react';

interface StreakCounterProps {
  days: number;
  className?: string;
}

export function StreakCounter({ days, className }: StreakCounterProps) {
  const getMessage = () => {
    if (days === 0) return "Start your streak today!";
    if (days < 3) return "Building momentum...";
    if (days < 7) return "You're on fire!";
    if (days < 14) return "Incredible discipline!";
    if (days < 30) return "Financial warrior!";
    return "Absolute legend!";
  };

  const getEmoji = () => {
    if (days === 0) return "🌱";
    if (days < 3) return "🔥";
    if (days < 7) return "💪";
    if (days < 14) return "⭐";
    if (days < 30) return "🏆";
    return "👑";
  };

  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-xl bg-card border border-border",
      days > 0 && "shadow-soft",
      className
    )}>
      <div className={cn(
        "flex items-center justify-center w-14 h-14 rounded-full",
        days > 0 ? "bg-primary/10" : "bg-muted"
      )}>
        {days > 7 ? (
          <Trophy className={cn("w-7 h-7", days > 0 ? "text-primary" : "text-muted-foreground")} />
        ) : (
          <Flame className={cn("w-7 h-7", days > 0 ? "text-primary" : "text-muted-foreground")} />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">{days}</span>
          <span className="text-sm text-muted-foreground">
            {days === 1 ? 'day' : 'days'} impulse-free
          </span>
          <span className="text-xl">{getEmoji()}</span>
        </div>
        <p className="text-sm text-muted-foreground">{getMessage()}</p>
      </div>
    </div>
  );
}
