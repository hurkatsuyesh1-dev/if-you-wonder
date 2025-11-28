import React from 'react';
import { Alternative } from '@/types/spend';
import { formatCurrency } from '@/hooks/useFutureValue';
import { cn } from '@/lib/utils';
import { Lightbulb, ArrowRight } from 'lucide-react';

interface AlternativeSuggestionProps {
  alternative: Alternative;
  className?: string;
}

export function AlternativeSuggestion({ alternative, className }: AlternativeSuggestionProps) {
  return (
    <div className={cn(
      "p-4 rounded-xl bg-primary/5 border border-primary/20",
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Regret-free alternative:
          </p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{alternative.icon}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm line-through text-muted-foreground">
                {alternative.original}
              </span>
              <ArrowRight className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                {alternative.suggestion}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Potential savings: <span className="font-semibold text-primary">{formatCurrency(alternative.savings)}</span> per instance
          </p>
        </div>
      </div>
    </div>
  );
}
