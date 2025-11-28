import { useMemo } from 'react';
import { FutureValue } from '@/types/spend';

export function useFutureValue(amount: number, rate: number): FutureValue {
  return useMemo(() => {
    const r = rate / 100;
    return {
      year1: amount * Math.pow(1 + r, 1),
      year5: amount * Math.pow(1 + r, 5),
      year10: amount * Math.pow(1 + r, 10),
    };
  }, [amount, rate]);
}

export function calculateFutureValue(amount: number, rate: number, years: number): number {
  return amount * Math.pow(1 + rate / 100, years);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
