import { Spend, Category, MoodTag } from '@/types/spend';

export interface Nudge {
  id: string;
  title: string;
  message: string;
  icon: string;
  type: 'warning' | 'tip' | 'celebration';
}

export function generateNudges(spends: Spend[]): Nudge[] {
  const nudges: Nudge[] = [];
  const last7Days = spends.filter(s => {
    const spendDate = new Date(s.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return spendDate >= weekAgo;
  });

  // Check for food delivery pattern
  const foodDelivery = last7Days.filter(s => s.category === 'food' && s.type === 'impulse');
  if (foodDelivery.length >= 3) {
    nudges.push({
      id: 'food-delivery',
      title: 'Food delivery spree detected! 🍕',
      message: "You've ordered food 3+ times this week. Maybe it's time to meal prep? Your future self (and wallet) will thank you!",
      icon: '🍳',
      type: 'warning',
    });
  }

  // Check for cab rides pattern
  const cabRides = last7Days.filter(s => s.category === 'transport' && s.type === 'impulse');
  if (cabRides.length >= 4) {
    nudges.push({
      id: 'cab-rides',
      title: 'Cab comfort zone 🚕',
      message: "Those quick cab rides are adding up! Could metro or walking work for some trips? Small switches, big savings.",
      icon: '🚇',
      type: 'warning',
    });
  }

  // Check for late night shopping
  const lateNightSpends = last7Days.filter(s => {
    const hour = new Date(s.createdAt).getHours();
    return hour >= 22 || hour <= 4;
  });
  if (lateNightSpends.length >= 2) {
    nudges.push({
      id: 'late-night',
      title: 'Midnight spending alert 🌙',
      message: "Notice you're shopping late at night. Sleep on it! Most impulse purchases feel less urgent in the morning.",
      icon: '😴',
      type: 'warning',
    });
  }

  // Check for stress spending
  const stressSpends = last7Days.filter(s => s.mood === 'stressed' && s.type === 'impulse');
  if (stressSpends.length >= 2) {
    nudges.push({
      id: 'stress-spending',
      title: 'Stress spending pattern 💆',
      message: "When stressed, we often reach for our wallets. Try a walk, call a friend, or deep breaths instead. You've got this!",
      icon: '🧘',
      type: 'tip',
    });
  }

  // Celebration nudge for good behavior
  const impulseSpends = last7Days.filter(s => s.type === 'impulse');
  if (impulseSpends.length === 0 && last7Days.length > 0) {
    nudges.push({
      id: 'no-impulse',
      title: 'Impulse-free week! 🎉',
      message: "Zero impulse purchases this week. You're building real financial discipline. Keep it going!",
      icon: '🏆',
      type: 'celebration',
    });
  }

  return nudges;
}

export function getMonthlyRecommendation(spends: Spend[]): string {
  const thisMonth = spends.filter(s => {
    const spendDate = new Date(s.date);
    const now = new Date();
    return spendDate.getMonth() === now.getMonth() && spendDate.getFullYear() === now.getFullYear();
  });

  if (thisMonth.length === 0) {
    return "Start logging your spends to get personalized recommendations!";
  }

  const impulseByCategory: Record<Category, number> = {} as any;
  thisMonth
    .filter(s => s.type === 'impulse')
    .forEach(s => {
      impulseByCategory[s.category] = (impulseByCategory[s.category] || 0) + s.amount;
    });

  const topCategory = Object.entries(impulseByCategory)
    .sort(([, a], [, b]) => b - a)[0];

  if (!topCategory) {
    return "Great job keeping impulse spending low! Try to maintain this momentum next month.";
  }

  const recommendations: Record<Category, string> = {
    food: "Try meal prepping on Sundays. Even 2-3 meals can save ₹500+ weekly on food delivery.",
    transport: "Consider a monthly metro pass or try walking for trips under 2km. Your health and wallet will improve!",
    shopping: "Implement the 48-hour rule: wait 2 days before any non-essential purchase. Most urges fade.",
    entertainment: "Host more at home! A movie night with friends costs 1/5th of going out.",
    bills: "Review subscriptions you haven't used in 30 days. Cancel ruthlessly.",
    health: "Home workouts are free! YouTube has amazing fitness content.",
    other: "Before any purchase, ask: 'Will I use this 30 days from now?' If unsure, skip it.",
  };

  return recommendations[topCategory[0] as Category] || recommendations.other;
}
