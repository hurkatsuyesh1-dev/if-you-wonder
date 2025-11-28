import React from 'react';
import { Nudge } from '@/lib/nudges';
import { cn } from '@/lib/utils';
import { X, AlertTriangle, Lightbulb, PartyPopper } from 'lucide-react';

interface HabitNudgeProps {
  nudge: Nudge;
  onDismiss?: () => void;
  className?: string;
}

export function HabitNudge({ nudge, onDismiss, className }: HabitNudgeProps) {
  const config = {
    warning: {
      bg: 'bg-spend-want/10 border-spend-want/30',
      icon: <AlertTriangle className="w-5 h-5 text-spend-want" />,
    },
    tip: {
      bg: 'bg-primary/10 border-primary/30',
      icon: <Lightbulb className="w-5 h-5 text-primary" />,
    },
    celebration: {
      bg: 'bg-spend-need/10 border-spend-need/30',
      icon: <PartyPopper className="w-5 h-5 text-spend-need" />,
    },
  };

  const { bg, icon } = config[nudge.type];

  return (
    <div className={cn(
      "relative p-4 rounded-xl border animate-slide-up",
      bg,
      className
    )}>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-foreground/10 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 pr-6">
          <p className="font-semibold text-foreground mb-1">{nudge.title}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{nudge.message}</p>
        </div>
        <span className="text-2xl flex-shrink-0">{nudge.icon}</span>
      </div>
    </div>
  );
}
