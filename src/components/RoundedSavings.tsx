import React from 'react';
import { formatCurrency } from '@/hooks/useFutureValue';
import { cn } from '@/lib/utils';
import { PiggyBank } from 'lucide-react';

interface RoundedSavingsProps {
  amount: number;
  totalSpent: number;
  className?: string;
}

export function RoundedSavings({ amount, totalSpent, className }: RoundedSavingsProps) {
  if (amount <= 0) return null;

  return (
    <div className={cn(
      "p-4 rounded-xl bg-primary/5 border border-primary/20",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <PiggyBank className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Round-up savings potential
          </p>
          <p className="text-xl font-bold text-primary">
            {formatCurrency(amount)}
          </p>
          <p className="text-xs text-muted-foreground">
            If you rounded each spend to nearest ₹10
          </p>
        </div>
      </div>
    </div>
  );
}
