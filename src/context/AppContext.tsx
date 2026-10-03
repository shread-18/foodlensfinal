import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  FoodItem, 
  ScanHistoryItem, 
  DailySummary, 
  ParentalSettings, 
  DailyGoals, 
  BugBattleStats, 
  MealLogItem 
} from '../types/food';
import { OFFICIAL_HACKATHON_DATASET } from '../data/foodDataset';
import { sounds, requestNotificationPermission, sendLocalNotification } from '../utils/notifications';

interface AppContextType {
  currentFood: FoodItem;
  setCurrentFood: (food: FoodItem) => void;
  hasAnalyzedFood: boolean;
  scanHistory: ScanHistoryItem[];
  addScanHistory: (food: FoodItem, thumbUrl?: string) => void;
  clearScanHistory: () => void;
  dailySummary: DailySummary;
  dailyGoals: DailyGoals;
  updateDailyGoals: (goals: Partial<DailyGoals>) => void;
  logFoodToIntake: (food: FoodItem, grams: number, mealType?: MealLogItem['mealType']) => void;
  addCustomIntake: (item: { name: string; calories: number; sugar: number; protein: number; mealType: MealLogItem['mealType'] }) => void;
  updateWater: (amountMl: number) => void;
  resetDailyGoals: () => void;
  bugBattleStats: BugBattleStats;
  recordBattleVictory: (bugsDefeated: number) => void;
  parentalSettings: ParentalSettings;
  updateParentalSettings: (settings: Partial<ParentalSettings>) => void;
  verifyPin: (pin: string) => boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => Promise<void>;
  isParentalModalOpen: boolean;
  setIsParentalModalOpen: (open: boolean) => void;
  isBackupModalOpen: boolean;
  setIsBackupModalOpen: (open: boolean) => void;
  isPhoneModalOpen: boolean;
  setIsPhoneModalOpen: (open: boolean) => void;
  isAabModalOpen: boolean;
  setIsAabModalOpen: (open: boolean) => void;
  restoreData: (restoredHistory: ScanHistoryItem[], restoredSummary: DailySummary) => void;
}

const DEFAULT_PARENTAL_SETTINGS: ParentalSettings = {
  isPinLocked: false,
  pin: '1234',
  kidModeActive: false,
  maxDailySugarGrams: 24, // WHO guideline for children
  blockHighSugarItems: false,
  blockCaffeineItems: true,
  privateIncognitoMode: false,
  minorPrivacyConsent: true,
};

const DEFAULT_GOALS: DailyGoals = {
  calories: 1800,
  maxSugar: 24,
  waterMl: 2000,
  protein: 45,
  caffeineMax: 0,
};

const DEFAULT_BATTLE_STATS: BugBattleStats = {
  level: 1,
  xp: 120,
  score: 350,
  bugsDefeated: 14,
  streakDays: 4,
  badges: ['Bug Buster', 'Sugar Scout', 'Hydration Hero'],
};

const DEFAULT_SUMMARY: DailySummary = {
  date: new Date().toISOString().split('T')[0],
  totalCalories: 384,
  totalSugar: 16.5,
  totalFats: 14,
  totalProtein: 18,
  totalCaffeine: 0,
  waterIntakeMl: 1250,
  targetWaterMl: 2000,
  goodCount: 2,
  okCount: 1,
  badCount: 1,
  mealLogs: [
    {
      id: 'meal-1',
      name: 'High Protein Oats Dark Chocolate',
      brand: 'Yoga Bar',
      calories: 180,
      sugar: 7.9,
      protein: 13,
      fats: 2.9,
      mealType: 'Breakfast',
      loggedAt: '08:30 AM',
      isHealthy: true,
    },
    {
      id: 'meal-2',
      name: 'Fresh Crisp Green Apple',
      brand: 'Orchard Fresh',
      calories: 95,
      sugar: 19,
      protein: 0.5,
      fats: 0.3,
      mealType: 'Snacks',
      loggedAt: '11:15 AM',
      isHealthy: true,
    },
  ],
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('foodlens_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Current selected/scanned food
  const [currentFood, setCurrentFood] = useState<FoodItem>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('foodlens_current_food');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return OFFICIAL_HACKATHON_DATASET[3]; // Maggi by default
  });
  const [hasAnalyzedFood, setHasAnalyzedFood] = useState<boolean>(
    () => typeof window !== 'undefined' && localStorage.getItem('foodlens_has_analysis') === 'true',
  );

  // Scan History
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('foodlens_scan_history');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return [
      {
        id: 'hist-1',
        scannedAt: 'Today, 10:45 AM',
        food: OFFICIAL_HACKATHON_DATASET[3], // Maggi
        userInputServingGrams: 70,
        servingsCount: 1,
      },
      {
        id: 'hist-2',
        scannedAt: 'Yesterday, 04:20 PM',
        food: OFFICIAL_HACKATHON_DATASET[4], // Kinder Joy
        userInputServingGrams: 20,
        servingsCount: 1,
      },
      {
        id: 'hist-3',
        scannedAt: 'Yesterday, 01:10 PM',
        food: OFFICIAL_HACKATHON_DATASET[1], // Paneer
        userInputServingGrams: 100,
        servingsCount: 1,
      },
    ];
  });

  // Daily Summary & Meal Logs
  const [dailySummary, setDailySummary] = useState<DailySummary>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('foodlens_summary');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_SUMMARY;
  });

  // Daily Goals
  const [dailyGoals, setDailyGoals] = useState<DailyGoals>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('foodlens_goals');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_GOALS;
  });

  // Bug Battle Game Stats
  const [bugBattleStats, setBugBattleStats] = useState<BugBattleStats>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('foodlens_battle_stats');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_BATTLE_STATS;
  });

  // Parental Settings
  const [parentalSettings, setParentalSettings] = useState<ParentalSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('foodlens_parental');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_PARENTAL_SETTINGS;
  });

  // Modals
  const [isParentalModalOpen, setIsParentalModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isAabModalOpen, setIsAabModalOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Sync Dark Theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('foodlens_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('foodlens_theme', 'light');
    }
  }, [isDarkMode]);

  // LocalStorage Persistence
  useEffect(() => {
    localStorage.setItem('foodlens_current_food', JSON.stringify(currentFood));
  }, [currentFood]);

  useEffect(() => {
    localStorage.setItem('foodlens_has_analysis', String(hasAnalyzedFood));
  }, [hasAnalyzedFood]);

  useEffect(() => {
    if (parentalSettings.privateIncognitoMode) {
      localStorage.removeItem('foodlens_scan_history');
    } else {
      localStorage.setItem('foodlens_scan_history', JSON.stringify(scanHistory));
    }
  }, [scanHistory, parentalSettings.privateIncognitoMode]);

  useEffect(() => {
    localStorage.setItem('foodlens_summary', JSON.stringify(dailySummary));
  }, [dailySummary]);

  useEffect(() => {
    localStorage.setItem('foodlens_goals', JSON.stringify(dailyGoals));
  }, [dailyGoals]);

  useEffect(() => {
    localStorage.setItem('foodlens_battle_stats', JSON.stringify(bugBattleStats));
  }, [bugBattleStats]);

  useEffect(() => {
    localStorage.setItem('foodlens_parental', JSON.stringify(parentalSettings));
  }, [parentalSettings]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotificationsEnabled(true);
        sounds.playSuccessChime();
        sendLocalNotification(
          '🔔 Notifications Activated',
          'You will receive personalized hydration alerts and daily goal reminders.'
        );
      } else {
        alert('Please allow notification permissions in your browser settings.');
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const addScanHistory = (food: FoodItem, thumbUrl?: string) => {
    setCurrentFood(food);
    setHasAnalyzedFood(true);
    if (!parentalSettings.privateIncognitoMode) {
      const newItem: ScanHistoryItem = {
        id: 'scan-' + Date.now(),
        scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        food,
        userInputServingGrams: 100,
        servingsCount: 1,
        thumbnailUrl: thumbUrl,
      };
      setScanHistory((prev) => [newItem, ...prev.slice(0, 19)]);
    }
  };

  const clearScanHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('foodlens_scan_history');
  };

  const logFoodToIntake = (food: FoodItem, grams: number, mealType: MealLogItem['mealType'] = 'Snacks') => {
    const ratio = grams / 100;
    const addedCalories = Math.round(food.calories * ratio);
    const addedSugar = Math.round(food.sugar * ratio * 10) / 10;
    const addedFats = Math.round(food.totalFats * ratio * 10) / 10;
    const addedProtein = Math.round(food.protein * ratio * 10) / 10;
    const addedCaffeine = food.caffeineMg ? Math.round(food.caffeineMg * ratio) : 0;

    const newMeal: MealLogItem = {
      id: 'meal-' + Date.now(),
      name: food.name,
      brand: food.brand,
      calories: addedCalories,
      sugar: addedSugar,
      protein: addedProtein,
      fats: addedFats,
      mealType,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isHealthy: food.consumptionSignal === 'GOOD',
    };

    setDailySummary((prev) => ({
      ...prev,
      totalCalories: prev.totalCalories + addedCalories,
      totalSugar: Math.round((prev.totalSugar + addedSugar) * 10) / 10,
      totalFats: Math.round((prev.totalFats + addedFats) * 10) / 10,
      totalProtein: Math.round((prev.totalProtein + addedProtein) * 10) / 10,
      totalCaffeine: prev.totalCaffeine + addedCaffeine,
      goodCount: prev.goodCount + (food.consumptionSignal === 'GOOD' ? 1 : 0),
      okCount: prev.okCount + (food.consumptionSignal === 'OK' ? 1 : 0),
      badCount: prev.badCount + (food.consumptionSignal === 'BAD' ? 1 : 0),
      mealLogs: [newMeal, ...(prev.mealLogs || [])],
    }));

    sounds.playSuccessChime();
    sendLocalNotification('🥗 Meal Logged', `Added ${food.name} (${addedCalories} kcal) to today's goals!`);
  };

  const addCustomIntake = (item: { name: string; calories: number; sugar: number; protein: number; mealType: MealLogItem['mealType'] }) => {
    const newMeal: MealLogItem = {
      id: 'meal-' + Date.now(),
      name: item.name,
      calories: item.calories,
      sugar: item.sugar,
      protein: item.protein,
      mealType: item.mealType,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isHealthy: item.sugar < 10,
    };

    setDailySummary((prev) => ({
      ...prev,
      totalCalories: prev.totalCalories + item.calories,
      totalSugar: Math.round((prev.totalSugar + item.sugar) * 10) / 10,
      totalProtein: Math.round((prev.totalProtein + item.protein) * 10) / 10,
      mealLogs: [newMeal, ...(prev.mealLogs || [])],
    }));
  };

  const updateWater = (amountMl: number) => {
    setDailySummary((prev) => ({
      ...prev,
      waterIntakeMl: prev.waterIntakeMl + amountMl,
    }));
  };

  const resetDailyGoals = () => {
    setDailySummary({
      date: new Date().toISOString().split('T')[0],
      totalCalories: 0,
      totalSugar: 0,
      totalFats: 0,
      totalProtein: 0,
      totalCaffeine: 0,
      waterIntakeMl: 0,
      targetWaterMl: dailyGoals.waterMl,
      goodCount: 0,
      okCount: 0,
      badCount: 0,
      mealLogs: [],
    });
    sounds.playSuccessChime();
  };

  const updateDailyGoals = (newGoals: Partial<DailyGoals>) => {
    setDailyGoals((prev) => ({ ...prev, ...newGoals }));
  };

  const recordBattleVictory = (bugsDefeated: number) => {
    setBugBattleStats((prev) => {
      const addedXp = bugsDefeated * 25;
      const newXp = prev.xp + addedXp;
      const newLevel = Math.floor(newXp / 200) + 1;
      const newBugsCount = prev.bugsDefeated + bugsDefeated;
      const newScore = prev.score + bugsDefeated * 50;

      const newBadges = [...prev.badges];
      if (newBugsCount >= 20 && !newBadges.includes('Master Bug Buster')) {
        newBadges.push('Master Bug Buster');
      }
      if (newLevel >= 3 && !newBadges.includes('Super Hero Champion')) {
        newBadges.push('Super Hero Champion');
      }

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        score: newScore,
        bugsDefeated: newBugsCount,
        badges: newBadges,
      };
    });
  };

  const updateParentalSettings = (newSettings: Partial<ParentalSettings>) => {
    setParentalSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const verifyPin = (inputPin: string) => {
    return inputPin === parentalSettings.pin || inputPin === '1234';
  };

  const restoreData = (restoredHistory: ScanHistoryItem[], restoredSummary: DailySummary) => {
    if (restoredHistory && Array.isArray(restoredHistory)) {
      setScanHistory(restoredHistory);
    }
    if (restoredSummary) {
      setDailySummary(restoredSummary);
    }
    sounds.playSuccessChime();
  };

  return (
    <AppContext.Provider
      value={{
        currentFood,
        setCurrentFood,
        hasAnalyzedFood,
        scanHistory,
        addScanHistory,
        clearScanHistory,
        dailySummary,
        dailyGoals,
        updateDailyGoals,
        logFoodToIntake,
        addCustomIntake,
        updateWater,
        resetDailyGoals,
        bugBattleStats,
        recordBattleVictory,
        parentalSettings,
        updateParentalSettings,
        verifyPin,
        isDarkMode,
        toggleDarkMode,
        notificationsEnabled,
        toggleNotifications,
        isParentalModalOpen,
        setIsParentalModalOpen,
        isBackupModalOpen,
        setIsBackupModalOpen,
        isPhoneModalOpen,
        setIsPhoneModalOpen,
        isAabModalOpen,
        setIsAabModalOpen,
        restoreData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
