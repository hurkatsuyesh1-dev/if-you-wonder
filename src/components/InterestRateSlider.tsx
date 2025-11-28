import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Percent } from 'lucide-react';

interface InterestRateSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function InterestRateSlider({ value, onChange, className }: InterestRateSliderProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Percent className="w-4 h-4" />
          Expected Return Rate
        </Label>
        <span className="text-lg font-bold text-primary">{value}%</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={8}
        max={15}
        step={0.5}
        className="py-2"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Conservative (8%)</span>
        <span>Aggressive (15%)</span>
      </div>
    </div>
  );
}
