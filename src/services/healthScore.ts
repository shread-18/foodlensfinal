import { FoodItem } from '../types/food';

export interface HealthScoreResult {
  score: number;
  label: 'Excellent' | 'Good' | 'Moderate' | 'Needs Attention';
  reasons: string[];
}

type NutrientKey = 'calories' | 'protein' | 'carbohydrates' | 'sugar' | 'totalFats' | 'saturatedFat' | 'fiber' | 'sodium';

export function calculateHealthScore(food: Partial<FoodItem>): HealthScoreResult {
  const unavailable = new Set(food.unavailableNutrition ?? []);
  const has = (key: NutrientKey): boolean =>
    !unavailable.has(key) && typeof food[key] === 'number' && Number.isFinite(food[key]);
  const value = (key: NutrientKey): number => has(key) ? food[key] as number : 0;
  const hasNutritionData = ([
    'calories', 'protein', 'carbohydrates', 'sugar', 'totalFats', 'saturatedFat', 'fiber', 'sodium',
  ] as const).some(has);
  if (!hasNutritionData) {
    return {
      score: 0,
      label: 'Needs Attention',
      reasons: ['There is not enough nutrition information to calculate a reliable score.'],
    };
  }

  let score = 60;
  const reasons: string[] = [];

  if (has('sugar')) {
    if (value('sugar') > 20) {
      score -= 20;
      reasons.push('Sugar is above 20 g in the reported amount.');
    } else if (value('sugar') > 10) {
      score -= 10;
      reasons.push('Sugar is above 10 g in the reported amount.');
    } else if (value('sugar') <= 5) {
      score += 5;
      reasons.push('Sugar is 5 g or less in the reported amount.');
    }
  }

  if (has('sodium')) {
    if (value('sodium') > 600) {
      score -= 20;
      reasons.push('Sodium is above 600 mg in the reported amount.');
    } else if (value('sodium') > 400) {
      score -= 10;
      reasons.push('Sodium is above 400 mg in the reported amount.');
    }
  }

  if (has('totalFats') && value('totalFats') > 20) {
    score -= 8;
    reasons.push('Total fat is above 20 g in the reported amount.');
  }
  if (has('saturatedFat') && value('saturatedFat') > 5) {
    score -= 8;
    reasons.push('Saturated fat is above 5 g in the reported amount.');
  }
  if (has('protein') && value('protein') >= 5) {
    score += 5;
    reasons.push('Provides at least 5 g of protein in the reported amount.');
  }
  if (has('fiber') && value('fiber') >= 3) {
    score += 5;
    reasons.push('Provides at least 3 g of fiber in the reported amount.');
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const label: HealthScoreResult['label'] =
    score >= 85 ? 'Excellent' :
      score >= 70 ? 'Good' :
        score >= 50 ? 'Moderate' : 'Needs Attention';

  return {
    score,
    label,
    reasons: reasons.length ? reasons : ['No standout observations from the available nutrition values.'],
  };
}
