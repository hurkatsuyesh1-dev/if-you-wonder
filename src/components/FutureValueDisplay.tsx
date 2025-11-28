import React from 'react';
import { FutureValue } from '@/types/spend';
import { formatCurrency } from '@/hooks/useFutureValue';
import { cn } from '@/lib/utils';
import { TrendingUp, Clock } from 'lucide-react';

interface FutureValueDisplayProps {
  amount: number;
  futureValue: FutureValue;
  className?: string;
}

export function FutureValueDisplay({ amount, futureValue, className }: FutureValueDisplayProps) {
  const values = [
    { years: 1, value: futureValue.year1, label: '1 Year' },
    { years: 5, value: futureValue.year5, label: '5 Years' },
    { years: 10, value: futureValue.year10, label: '10 Years' },
  ];

  const maxValue = futureValue.year10;
  const lostValue = futureValue.year10 - amount;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-1">If invested instead, this could become:</p>
        <div className="flex items-center justify-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span className="text-3xl font-bold text-primary animate-number-pop">
            {formatCurrency(maxValue)}
          </span>
        </div>
        <p className="text-sm text-destructive mt-1">
          That's {formatCurrency(lostValue)} you're giving up!
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {values.map(({ years, value, label }) => {
          const growth = ((value - amount) / amount * 100).toFixed(0);
          return (
            <div 
              key={years}
              className={cn(
                "relative p-4 rounded-xl bg-card border border-border",
                "hover:shadow-soft transition-all duration-300",
                years === 10 && "ring-2 ring-primary/20"
              )}
            >
              <div className="flex items-center gap-1 text-muted-foreground mb-2">
                <Clock className="w-3 h-3" />
                <span className="text-xs font-medium">{label}</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(value)}
              </p>
              <p className="text-xs text-primary font-medium">
                +{growth}%
              </p>
              
              {/* Growth bar */}
              <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{ width: `${(value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
