import { Category, Alternative } from '@/types/spend';

const alternativesMap: Record<Category, Alternative[]> = {
  food: [
    { original: 'Food delivery', suggestion: 'Cook at home', savings: 150, icon: '🍳' },
    { original: 'Restaurant meal', suggestion: 'Pack lunch from home', savings: 200, icon: '🥗' },
    { original: 'Fancy coffee', suggestion: 'Make coffee at home', savings: 100, icon: '☕' },
    { original: 'Ordering out', suggestion: 'Meal prep on Sunday', savings: 300, icon: '📦' },
  ],
  transport: [
    { original: 'Cab ride', suggestion: 'Take metro/bus', savings: 150, icon: '🚇' },
    { original: 'Uber/Ola', suggestion: 'Walk for short distances', savings: 100, icon: '🚶' },
    { original: 'Daily commute', suggestion: 'Carpool with colleagues', savings: 200, icon: '🚗' },
    { original: 'Auto rickshaw', suggestion: 'Use bike/scooter', savings: 80, icon: '🛵' },
  ],
  shopping: [
    { original: 'Impulse buy', suggestion: 'Wait 48 hours before buying', savings: 500, icon: '⏰' },
    { original: 'Brand new item', suggestion: 'Check second-hand first', savings: 300, icon: '♻️' },
    { original: 'Fast fashion', suggestion: 'Buy quality, buy less', savings: 400, icon: '👕' },
    { original: 'Online shopping', suggestion: 'Make a wishlist, review monthly', savings: 600, icon: '📝' },
  ],
  entertainment: [
    { original: 'Movie theater', suggestion: 'Home movie night', savings: 300, icon: '🎬' },
    { original: 'Subscription overload', suggestion: 'Share accounts with family', savings: 200, icon: '📺' },
    { original: 'Night out', suggestion: 'Host friends at home', savings: 500, icon: '🏠' },
    { original: 'Gaming purchases', suggestion: 'Play free games first', savings: 400, icon: '🎮' },
  ],
  bills: [
    { original: 'High electricity bill', suggestion: 'Switch off unused appliances', savings: 200, icon: '💡' },
    { original: 'Expensive phone plan', suggestion: 'Review and downgrade', savings: 150, icon: '📱' },
  ],
  health: [
    { original: 'Gym membership unused', suggestion: 'Home workouts + outdoor runs', savings: 500, icon: '🏃' },
    { original: 'Supplements', suggestion: 'Focus on whole foods first', savings: 300, icon: '🥬' },
  ],
  other: [
    { original: 'Random purchases', suggestion: 'Ask: Will I use this in 30 days?', savings: 200, icon: '🤔' },
    { original: 'Convenience fees', suggestion: 'Plan ahead to avoid rush', savings: 100, icon: '📅' },
  ],
};

export function getAlternatives(category: Category): Alternative[] {
  return alternativesMap[category] || alternativesMap.other;
}

export function getRandomAlternative(category: Category): Alternative {
  const alternatives = getAlternatives(category);
  return alternatives[Math.floor(Math.random() * alternatives.length)];
}
