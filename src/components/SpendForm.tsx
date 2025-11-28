import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Category, MoodTag, Spend } from '@/types/spend';
import { cn } from '@/lib/utils';
import { Calendar, DollarSign } from 'lucide-react';

interface SpendFormProps {
  onSubmit: (spend: Omit<Spend, 'id' | 'createdAt' | 'type'>) => void;
  className?: string;
}

const categories: { value: Category; label: string; icon: string }[] = [
  { value: 'food', label: 'Food', icon: '🍕' },
  { value: 'transport', label: 'Transport', icon: '🚕' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'entertainment', label: 'Fun', icon: '🎮' },
  { value: 'bills', label: 'Bills', icon: '📄' },
  { value: 'health', label: 'Health', icon: '💊' },
  { value: 'other', label: 'Other', icon: '📦' },
];

const moods: { value: MoodTag; label: string; icon: string; color: string }[] = [
  { value: 'hungry', label: 'Hungry', icon: '🍔', color: 'bg-mood-hungry/10 border-mood-hungry text-mood-hungry' },
  { value: 'bored', label: 'Bored', icon: '😴', color: 'bg-mood-bored/10 border-mood-bored text-mood-bored' },
  { value: 'stressed', label: 'Stressed', icon: '😤', color: 'bg-mood-stressed/10 border-mood-stressed text-mood-stressed' },
  { value: 'tired', label: 'Tired', icon: '😩', color: 'bg-mood-tired/10 border-mood-tired text-mood-tired' },
];

export function SpendForm({ onSubmit, className }: SpendFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [mood, setMood] = useState<MoodTag>('bored');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    onSubmit({
      amount: Number(amount),
      category,
      mood,
      date,
      description: description || undefined,
    });

    setAmount('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {/* Amount Input - Hero */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm font-medium">
          How much did you spend?
        </Label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="amount"
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-12 text-3xl h-16 font-bold text-center"
            autoFocus
          />
        </div>
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">What was it for?</Label>
        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={cn(
                "flex flex-col items-center p-3 rounded-xl border-2 transition-all",
                "hover:scale-105 active:scale-95",
                category === cat.value
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <span className="text-2xl mb-1">{cat.icon}</span>
              <span className="text-xs font-medium">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mood Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">How were you feeling?</Label>
        <div className="grid grid-cols-4 gap-2">
          {moods.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(m.value)}
              className={cn(
                "flex flex-col items-center p-3 rounded-xl border-2 transition-all",
                "hover:scale-105 active:scale-95",
                mood === m.value
                  ? m.color
                  : "border-border bg-card"
              )}
            >
              <span className="text-2xl mb-1">{m.icon}</span>
              <span className="text-xs font-medium">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date" className="text-sm font-medium">When?</Label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="pl-12"
          />
        </div>
      </div>

      {/* Optional Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Quick note (optional)
        </Label>
        <Input
          id="description"
          placeholder="What did you buy?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <Button 
        type="submit" 
        size="lg" 
        className="w-full h-14 text-lg font-semibold"
        disabled={!amount || Number(amount) <= 0}
      >
        Calculate My Regret 🔮
      </Button>
    </form>
  );
}
