import { ConsumptionSignal, FoodItem, HazardLevel, NutriGrade } from '../types/food';
import { calculateHealthScore } from './healthScore';

export interface AlgorithmBreakdown {
  baseScore: number;
  sugarPenalty: number;
  saturatedFatPenalty: number;
  sodiumPenalty: number;
  additivesPenalty: number;
  proteinBonus: number;
  finalScore: number;
  nutriGrade: NutriGrade;
  signal: ConsumptionSignal;
  kidSafetyScore: number;
  kidHazardLevel: HazardLevel;
  kidSugarExceedPercent: number; // relative to 24g max daily child cap
  caffeineWarning: string | null;
  formulas: {
    sugarFormula: string;
    sodiumFormula: string;
    fatFormula: string;
    kidSafetyFormula: string;
  };
}

export function evaluateFoodNutrition(food: Partial<FoodItem>): AlgorithmBreakdown {
  const sugar = food.sugar || 0;
  const totalFats = food.totalFats || 0;
  const saturatedFat = food.saturatedFat ?? (totalFats * 0.45);
  const protein = food.protein || 0;
  const sodium = food.sodium || 0;
  const caffeine = food.caffeineMg || 0;
  const harmfulAdditivesCount = food.kidSuitability?.harmfulAdditives?.length || 0;

  // 1. Sugar Penalty: Non-linear penalty steepening above 12g
  let sugarPenalty = 0;
  if (sugar <= 5) {
    sugarPenalty = sugar * 1.0;
  } else if (sugar <= 15) {
    sugarPenalty = 5 + (sugar - 5) * 1.8;
  } else if (sugar <= 30) {
    sugarPenalty = 23 + (sugar - 15) * 2.2;
  } else {
    sugarPenalty = 56 + Math.min(30, (sugar - 30) * 1.4);
  }

  // 2. Saturated Fat Penalty
  const satFatPenalty = Math.min(25, saturatedFat * 1.8);

  // 3. Sodium Penalty (mg)
  let sodiumPenalty = 0;
  if (sodium > 800) {
    sodiumPenalty = 22 + Math.min(10, (sodium - 800) / 100);
  } else if (sodium > 400) {
    sodiumPenalty = 10 + (sodium - 400) / 40;
  } else if (sodium > 150) {
    sodiumPenalty = (sodium - 150) / 30;
  }

  // 4. Additives & Processing Penalty
  const additivesPenalty = Math.min(20, harmfulAdditivesCount * 5.5);

  // 5. Positive Nutrient Bonus (Protein & Whole Nutrients)
  const proteinBonus = Math.min(22, protein * 1.2);

  const finalScore = calculateHealthScore(food).score;

  // Nutri-Grade determination
  let nutriGrade: NutriGrade = 'C';
  if (finalScore >= 85) nutriGrade = 'A';
  else if (finalScore >= 70) nutriGrade = 'B';
  else if (finalScore >= 50) nutriGrade = 'C';
  else if (finalScore >= 35) nutriGrade = 'D';
  else nutriGrade = 'E';

  // Continuous Consumption Signal
  let signal: ConsumptionSignal = 'OK';
  if (finalScore >= 70) {
    signal = 'GOOD';
  } else if (finalScore < 50) {
    signal = 'BAD';
  } else {
    signal = 'OK';
  }

  // Child Safety Hazard Algorithm (WHO baseline: 24g max free sugar for children)
  const childDailySugarCap = 24; // grams
  const kidSugarExceedPercent = Math.round((sugar / childDailySugarCap) * 100);

  let kidHazardLevel: HazardLevel = 'low';
  let kidSafetyScore = 100 - (sugar * 1.8) - (sodium / 25) - (harmfulAdditivesCount * 12);
  if (caffeine > 0) {
    kidSafetyScore -= (caffeine * 2.5); // Strict penalty for caffeine in children
  }

  if (sugar > 35 || caffeine > 20 || harmfulAdditivesCount >= 2 || finalScore < 30) {
    kidHazardLevel = 'critical';
  } else if (sugar > 20 || sodium > 600 || caffeine > 0 || finalScore < 50) {
    kidHazardLevel = 'high';
  } else if (sugar > 10 || sodium > 300 || finalScore < 68) {
    kidHazardLevel = 'moderate';
  } else {
    kidHazardLevel = 'low';
  }

  let caffeineWarning: string | null = null;
  if (caffeine > 0) {
    caffeineWarning = `${caffeine}mg caffeine detected. Health authorities advise 0mg caffeine for children under 12.`;
  }

  return {
    baseScore: 100,
    sugarPenalty: Math.round(sugarPenalty * 10) / 10,
    saturatedFatPenalty: Math.round(satFatPenalty * 10) / 10,
    sodiumPenalty: Math.round(sodiumPenalty * 10) / 10,
    additivesPenalty: Math.round(additivesPenalty * 10) / 10,
    proteinBonus: Math.round(proteinBonus * 10) / 10,
    finalScore,
    nutriGrade,
    signal,
    kidSafetyScore: Math.max(0, Math.min(100, Math.round(kidSafetyScore))),
    kidHazardLevel,
    kidSugarExceedPercent,
    caffeineWarning,
    formulas: {
      sugarFormula: 'P_sugar = (sugar <= 5) ? sugar : 5 + (sugar-5)*1.8 + exp(sugar/15)',
      sodiumFormula: 'P_sodium = (sodium > 400) ? 10 + (sodium-400)/40 : (sodium-150)/30',
      fatFormula: 'P_satFat = min(25, saturatedFat * 1.8)',
      kidSafetyFormula: 'Safety_Kid = 100 - (Sugar * 1.8) - (Sodium / 25) - (Caffeine * 2.5) - (AzoDyes * 12)',
    },
  };
}
