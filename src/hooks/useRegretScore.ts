import { useMemo } from 'react';
import { RegretScore, SpendType } from '@/types/spend';

export function useRegretScore(
  amount: number,
  rate: number,
  type?: SpendType
): RegretScore {
  return useMemo(() => {
    // Base score from amount (0-40 points)
    const amountScore = Math.min(40, (amount / 500) * 40);
    
    // Interest rate factor (0-20 points)
    const rateScore = ((rate - 8) / 7) * 20;
    
    // Type multiplier (0-40 points)
    let typeScore = 20; // default
    if (type === 'need') typeScore = 5;
    else if (type === 'want') typeScore = 25;
    else if (type === 'impulse') typeScore = 40;
    
    const totalScore = Math.min(100, Math.max(0, amountScore + rateScore + typeScore));
    
    let level: 'low' | 'medium' | 'high';
    if (totalScore < 35) level = 'low';
    else if (totalScore < 65) level = 'medium';
    else level = 'high';
    
    return { score: totalScore, level };
  }, [amount, rate, type]);
}
