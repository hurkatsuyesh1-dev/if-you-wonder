export type MoodTag = 'hungry' | 'bored' | 'stressed' | 'tired';
export type SpendType = 'need' | 'want' | 'impulse';
export type Category = 'food' | 'transport' | 'shopping' | 'entertainment' | 'bills' | 'health' | 'other';

export interface Spend {
  id: string;
  amount: number;
  category: Category;
  date: string;
  mood: MoodTag;
  type?: SpendType;
  description?: string;
  createdAt: string;
}

export interface FutureValue {
  year1: number;
  year5: number;
  year10: number;
}

export interface RegretScore {
  score: number; // 0-100
  level: 'low' | 'medium' | 'high';
}

export interface MonthlyStats {
  totalSpent: number;
  totalFutureLost: number;
  byCategory: Record<Category, number>;
  byMood: Record<MoodTag, number>;
  byType: Record<SpendType, number>;
  topRegrets: Spend[];
  leastRegrets: Spend[];
  streakDays: number;
  roundedSavings: number;
}

export interface Alternative {
  original: string;
  suggestion: string;
  savings: number;
  icon: string;
}
