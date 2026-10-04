export type NutriGrade = 'A' | 'B' | 'C' | 'D' | 'E';
export type ConsumptionSignal = 'GOOD' | 'OK' | 'BAD';
export type HazardLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface VisualHarmEffect {
  title: string;
  desc: string;
  organ: 'teeth' | 'brain' | 'tummy' | 'energy' | 'heart';
}

export interface KidSuitability {
  isRecommendedForKids: boolean;
  minimumAge: number;
  hazardLevel: HazardLevel;
  kidWarningText: string;
  sugarSpoonsCount: number; // 1 standard spoon = ~4g sugar
  harmfulAdditives?: string[];
  visualHarmEffects: VisualHarmEffect[];
}

export interface HealthierAlternative {
  name: string;
  brand: string;
  calories: number;
  sugar: number;
  fats: number;
  protein: number;
  benefitHighlight: string;
  badge: string;
}

export interface ARFloatingTag {
  label: string;
  type: 'warning' | 'positive' | 'neutral' | 'kid-alert';
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
}

export interface FoodItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  barcode?: string;
  calories: number;
  sugar: number; // grams
  totalFats: number; // grams
  saturatedFat?: number; // grams
  protein: number; // grams
  sodium?: number; // mg
  allergens: string[];
  recommendedAmount: string;
  recommendedTime: string;
  frequency: string;
  positiveEffects: string;
  excessIntakeEffects: string;
  healthScore: number; // 0 - 100
  nutriGrade: NutriGrade;
  consumptionSignal: ConsumptionSignal; // GOOD (Green), OK (Yellow), BAD (Red)
  kidSuitability: KidSuitability;
  healthierAlternatives: HealthierAlternative[];
  arFloatingTags: ARFloatingTag[];
  caffeineMg?: number;
  sampleImage?: string;
  image?: string;
}

export interface ScanHistoryItem {
  id: string;
  scannedAt: string;
  food: FoodItem;
  userInputServingGrams?: number;
  servingsCount: number;
}

export interface DailySummary {
  date: string;
  totalCalories: number;
  totalSugar: number;
  totalFats: number;
  totalProtein: number;
  totalCaffeine: number;
  waterIntakeMl: number;
  targetWaterMl: number;
  goodCount: number;
  okCount: number;
  badCount: number;
}

export interface ParentalSettings {
  isPinLocked: boolean;
  pin: string;
  kidModeActive: boolean;
  maxDailySugarGrams: number;
  blockHighSugarItems: boolean;
  blockCaffeineItems: boolean;
  privateIncognitoMode: boolean; // When true: history not stored/visible, only user prompt input is shown
  minorPrivacyConsent: boolean;
}

export interface WearableDeviceState {
  connected: boolean;
  provider: 'Apple Health' | 'Fitbit' | 'Garmin' | 'Google Fit' | 'None';
  steps: number;
  activeCalories: number;
  restingHeartRate: number;
  lastSyncTime: string;
}
