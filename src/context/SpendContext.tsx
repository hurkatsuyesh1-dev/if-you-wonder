import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Spend, SpendType, MonthlyStats, Category, MoodTag } from '@/types/spend';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface SpendContextType {
  spends: Spend[];
  addSpend: (spend: Omit<Spend, 'id' | 'createdAt'>) => Promise<Spend>;
  updateSpendType: (id: string, type: SpendType) => Promise<void>;
  getMonthlyStats: () => MonthlyStats;
  interestRate: number;
  setInterestRate: (rate: number) => void;
  streakDays: number;
  lastRegretFreeDate: string | null;
  loading: boolean;
}

const SpendContext = createContext<SpendContextType | undefined>(undefined);

const SETTINGS_KEY = 'regret-calculator-settings';

export function SpendProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [spends, setSpends] = useState<Spend[]>([]);
  const [interestRate, setInterestRate] = useState(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored).interestRate : 10;
  });
  const [streakDays, setStreakDays] = useState(0);
  const [lastRegretFreeDate, setLastRegretFreeDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load spends from database
  useEffect(() => {
    if (!user) {
      setSpends([]);
      setLoading(false);
      return;
    }

    const loadSpends = async () => {
      try {
        const { data, error } = await supabase
          .from('spends')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedSpends: Spend[] = (data || []).map(spend => ({
          id: spend.id,
          amount: Number(spend.amount),
          category: spend.category as Category,
          date: spend.date,
          mood: spend.mood as MoodTag,
          type: spend.type as SpendType,
          createdAt: spend.created_at
        }));

        setSpends(formattedSpends);
      } catch (error: any) {
        console.error('Error loading spends:', error);
        toast.error('Failed to load spending history');
      } finally {
        setLoading(false);
      }
    };

    loadSpends();
  }, [user]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ interestRate }));
  }, [interestRate]);

  // Calculate streak
  useEffect(() => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const daySpends = spends.filter(s => s.date === dateStr && s.type === 'impulse');
      
      if (daySpends.length === 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
        
        // Check if there were any spends on this day at all
        const anySpends = spends.filter(s => s.date === dateStr);
        if (anySpends.length === 0 && streak > 1) {
          // No data for this day, stop counting
          break;
        }
      } else {
        break;
      }
      
      if (streak > 365) break; // Safety limit
    }
    
    setStreakDays(Math.max(0, streak - 1)); // Subtract 1 because today might not be complete
  }, [spends]);

  const addSpend = async (spendData: Omit<Spend, 'id' | 'createdAt'>): Promise<Spend> => {
    if (!user) {
      throw new Error('User must be logged in to add spends');
    }

    try {
      const { data, error } = await supabase
        .from('spends')
        .insert({
          user_id: user.id,
          amount: spendData.amount,
          category: spendData.category,
          date: spendData.date,
          mood: spendData.mood,
          type: spendData.type
        })
        .select()
        .single();

      if (error) throw error;

      const newSpend: Spend = {
        id: data.id,
        amount: Number(data.amount),
        category: data.category as Category,
        date: data.date,
        mood: data.mood as MoodTag,
        type: data.type as SpendType,
        createdAt: data.created_at
      };

      setSpends(prev => [newSpend, ...prev]);
      return newSpend;
    } catch (error: any) {
      console.error('Error adding spend:', error);
      toast.error('Failed to save spend');
      throw error;
    }
  };

  const updateSpendType = async (id: string, type: SpendType) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('spends')
        .update({ type })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setSpends(prev => prev.map(s => s.id === id ? { ...s, type } : s));
    } catch (error: any) {
      console.error('Error updating spend:', error);
      toast.error('Failed to update spend');
    }
  };

  const getMonthlyStats = (): MonthlyStats => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthSpends = spends.filter(s => new Date(s.date) >= monthStart);

    const totalSpent = monthSpends.reduce((sum, s) => sum + s.amount, 0);
    
    const rate = interestRate / 100;
    const totalFutureLost = monthSpends.reduce((sum, s) => {
      return sum + (s.amount * Math.pow(1 + rate, 10));
    }, 0);

    const byCategory = {} as Record<Category, number>;
    const byMood = {} as Record<MoodTag, number>;
    const byType = {} as Record<SpendType, number>;

    monthSpends.forEach(s => {
      byCategory[s.category] = (byCategory[s.category] || 0) + s.amount;
      byMood[s.mood] = (byMood[s.mood] || 0) + s.amount;
      if (s.type) {
        byType[s.type] = (byType[s.type] || 0) + s.amount;
      }
    });

    // Sort by regret (impulse spends with high amounts)
    const sortedByRegret = [...monthSpends]
      .filter(s => s.type)
      .sort((a, b) => {
        const regretA = a.type === 'impulse' ? a.amount * 3 : a.type === 'want' ? a.amount * 2 : a.amount;
        const regretB = b.type === 'impulse' ? b.amount * 3 : b.type === 'want' ? b.amount * 2 : b.amount;
        return regretB - regretA;
      });

    const roundedSavings = monthSpends.reduce((sum, s) => {
      const rounded = Math.ceil(s.amount / 10) * 10;
      return sum + (rounded - s.amount);
    }, 0);

    return {
      totalSpent,
      totalFutureLost,
      byCategory,
      byMood,
      byType,
      topRegrets: sortedByRegret.slice(0, 5),
      leastRegrets: sortedByRegret.slice(-5).reverse(),
      streakDays,
      roundedSavings,
    };
  };

  return (
    <SpendContext.Provider value={{
      spends,
      addSpend,
      updateSpendType,
      getMonthlyStats,
      interestRate,
      setInterestRate,
      streakDays,
      lastRegretFreeDate,
      loading,
    }}>
      {children}
    </SpendContext.Provider>
  );
}

export function useSpends() {
  const context = useContext(SpendContext);
  if (!context) {
    throw new Error('useSpends must be used within SpendProvider');
  }
  return context;
}
