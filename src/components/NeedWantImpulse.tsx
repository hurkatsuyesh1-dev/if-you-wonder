import React from 'react';
import { SpendType } from '@/types/spend';
import { cn } from '@/lib/utils';
import { Check, Heart, Zap } from 'lucide-react';

interface NeedWantImpulseProps {
  selected?: SpendType;
  onSelect: (type: SpendType) => void;
  className?: string;
}

const types: { value: SpendType; label: string; description: string; icon: React.ReactNode; color: string }[] = [
  { 
    value: 'need', 
    label: 'Need', 
    description: 'Essential for life',
    icon: <Check className="w-6 h-6" />,
    color: 'bg-spend-need/10 border-spend-need text-spend-need hover:bg-spend-need/20'
  },
  { 
    value: 'want', 
    label: 'Want', 
    description: 'Nice to have',
    icon: <Heart className="w-6 h-6" />,
    color: 'bg-spend-want/10 border-spend-want text-spend-want hover:bg-spend-want/20'
  },
  { 
    value: 'impulse', 
    label: 'Impulse', 
    description: "Didn't plan this",
    icon: <Zap className="w-6 h-6" />,
    color: 'bg-spend-impulse/10 border-spend-impulse text-spend-impulse hover:bg-spend-impulse/20'
  },
];

export function NeedWantImpulse({ selected, onSelect, className }: NeedWantImpulseProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-sm font-medium text-center text-muted-foreground">
        Be honest with yourself — was this a...
      </p>
      <div className="grid grid-cols-3 gap-3">
        {types.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => onSelect(type.value)}
            className={cn(
              "flex flex-col items-center p-4 rounded-xl border-2 transition-all",
              "hover:scale-105 active:scale-95",
              selected === type.value
                ? type.color
                : "border-border bg-card hover:border-muted-foreground/30"
            )}
          >
            <div className={cn(
              "mb-2",
              selected === type.value ? "" : "text-muted-foreground"
            )}>
              {type.icon}
            </div>
            <span className="font-semibold">{type.label}</span>
            <span className="text-xs text-muted-foreground mt-1">{type.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
