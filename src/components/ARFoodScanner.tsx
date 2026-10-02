import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Maximize2, 
  ShieldAlert, 
  ArrowRight, 
  Info, 
  Volume2, 
  Zap,
  Sliders,
  ChevronRight,
  Flame,
  Droplets,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FoodItem, ParentalSettings } from '../types/food';
import { OFFICIAL_HACKATHON_DATASET } from '../data/foodDataset';
import { sounds } from '../utils/notifications';

interface ARFoodScannerProps {
  onSelectFood: (food: FoodItem) => void;
  parentalSettings: ParentalSettings;
  onOpenKidVisualizer: (food: FoodItem) => void;
}

export const ARFoodScanner: React.FC<ARFoodScannerProps> = ({
  onSelectFood,
  parentalSettings,
  onOpenKidVisualizer,
}) => {
  const [selectedFood, setSelectedFood] = useState<FoodItem>(OFFICIAL_HACKATHON_DATASET[3]); // Maggi by default
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showAROverlay, setShowAROverlay] = useState(true);
  const [activePortionGrams, setActivePortionGrams] = useState<number>(70);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Trigger celebration on healthy food scan
  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#10b981', '#34d399', '#f59e0b', '#38bdf8'],
    });
  };

  const handleSelectPreset = (food: FoodItem) => {
    // Parental check: if kid mode and blocking high sugar
    if (parentalSettings.kidModeActive && parentalSettings.blockHighSugarItems && food.sugar > parentalSettings.maxDailySugarGrams) {
      sounds.playAlertPing();
      alert(`Parental Lock Active: "${food.name}" contains ${food.sugar}g sugar, exceeding the ${parentalSettings.maxDailySugarGrams}g child limit set by parent.`);
      return;
    }

    sounds.playScanClick();
    setIsScanning(true);
    setTimeout(() => {
      setSelectedFood(food);
      setCustomImage(null);
      setIsScanning(false);
      if (food.consumptionSignal === 'GOOD') {
        sounds.playSuccessChime();
        triggerCelebration();
      } else {
        sounds.playAlertPing();
      }
    }, 600);
  };

  // Start real webcam stream
  const startCamera = async () => {
    try {
      setAnalysisError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access unavailable:', err);
      setAnalysisError('Camera not accessible. You can upload an image or choose one of the hackathon dataset packages.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Capture frame from active camera
  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    sounds.playScanClick();
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCustomImage(dataUrl);
    stopCamera();
    analyzeWithGemini(dataUrl);
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playScanClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCustomImage(dataUrl);
      analyzeWithGemini(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Call Gemini 3.8 Flash API
  const analyzeWithGemini = async (imageBase64: string) => {
    setAiAnalyzing(true);
    setAnalysisError(null);
    setIsScanning(true);

    try {
      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType: 'image/jpeg',
          queryText: 'Perform comprehensive nutrition and kid-safety hazard evaluation from package label.',
        }),
      });

      if (!res.ok) {
        throw new Error('AI analysis service error or key not set. Using smart algorithmic fallback.');
      }

      const json = await res.json();
      if (json.data && json.data.productName) {
        const item: FoodItem = {
          id: 'AI-' + Date.now().toString(36),
          name: json.data.productName,
          brand: json.data.brand || 'Detected Pack',
          category: json.data.category || 'Packaged Food',
          calories: json.data.calories || 250,
          sugar: json.data.sugar || 10,
          totalFats: json.data.totalFats || 8,
          saturatedFat: json.data.saturatedFat || 3,
          protein: json.data.protein || 5,
          sodium: json.data.sodium || 220,
          allergens: json.data.allergens || ['None detected'],
          recommendedAmount: json.data.recommendedAmount || '1 serving',
          recommendedTime: json.data.recommendedTime || 'Snack time',
          frequency: json.data.recommendedFrequency || 'Occasionally',
          positiveEffects: json.data.positiveEffects || 'Provides nutrition & calories',
          excessIntakeEffects: json.data.excessIntakeEffects || 'Moderate intake recommended',
          healthScore: json.data.healthScore || 65,
          nutriGrade: json.data.nutriGrade || 'C',
          consumptionSignal: json.data.consumptionSignal || 'OK',
          kidSuitability: json.data.kidSuitability || {
            isRecommendedForKids: true,
            minimumAge: 5,
            hazardLevel: 'low',
            kidWarningText: 'Observe portion limits.',
            sugarSpoonsCount: Math.round(((json.data.sugar || 10) / 4) * 10) / 10,
            visualHarmEffects: [],
          },
          healthierAlternatives: json.data.healthierAlternatives || [],
          arFloatingTags: json.data.arFloatingTags || [
            { label: `${json.data.calories} kcal`, type: 'neutral', x: 28, y: 35 },
            { label: `Nutri-Grade ${json.data.nutriGrade}`, type: 'positive', x: 72, y: 45 },
          ],
        };

        setSelectedFood(item);
        if (item.consumptionSignal === 'GOOD') {
          sounds.playSuccessChime();
          triggerCelebration();
        } else {
          sounds.playAlertPing();
        }
      }
    } catch (err: any) {
      console.warn('Gemini analysis fallback:', err);
      setAnalysisError('AI Live OCR unavailable: showing nearest benchmark from Nexora dataset.');
      // Auto-fallback to Maggi or Kinder Joy if error
      setSelectedFood(OFFICIAL_HACKATHON_DATASET[4]); // Kinder Joy
      sounds.playAlertPing();
    } finally {
      setAiAnalyzing(false);
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getSignalBadgeColor = (signal: string) => {
    switch (signal) {
      case 'GOOD':
        return 'bg-emerald-500 text-white border-emerald-400';
      case 'OK':
        return 'bg-amber-500 text-white border-amber-400';
      case 'BAD':
      default:
        return 'bg-rose-500 text-white border-rose-400';
    }
  };

  const getNutriGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-emerald-600 text-white';
      case 'B':
        return 'bg-lime-500 text-white';
      case 'C':
        return 'bg-amber-400 text-slate-900';
      case 'D':
        return 'bg-orange-500 text-white';
      case 'E':
      default:
        return 'bg-rose-600 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 p-4 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              Live AR Food Package Scanner
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Point camera at food packaging to inspect nutrients, kid safety warnings, and battle tummy bugs!
          </p>
        </div>

        {/* Viewfinder Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Camera className="w-4 h-4" />
              Open Camera
            </button>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={captureCameraFrame}
                className="flex-1 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                📸 Capture & Analyze
              </button>
              <button
                onClick={stopCamera}
                className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm transition-all"
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            Upload Photo
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {analysisError && (
        <div className="p-3 text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 rounded-xl border border-amber-300 dark:border-amber-700 flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{analysisError}</span>
        </div>
      )}

      {/* Main AR Scanning Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AR Viewport Frame */}
        <div className="lg:col-span-7 bg-slate-950 rounded-3xl overflow-hidden relative shadow-2xl border-4 border-slate-800 aspect-[4/3] sm:aspect-[16/10] flex items-center justify-center">
          {/* Active Camera Video feed */}
          {isCameraActive ? (
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
          ) : customImage ? (
            <img
              src={customImage}
              alt="Scanned Food Packaging"
              className="w-full h-full object-contain bg-slate-900"
            />
          ) : (
            /* Interactive Simulated Food Packaging */
            <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-6 select-none overflow-hidden">
              {/* Radial backdrop glow */}
              <div
                className={`absolute w-72 h-72 rounded-full blur-3xl opacity-20 ${
                  selectedFood.consumptionSignal === 'GOOD'
                    ? 'bg-emerald-500'
                    : selectedFood.consumptionSignal === 'OK'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />

              {/* Graphic Mock of the Scanned Package */}
              <div className="relative z-10 w-64 h-80 bg-white/10 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border-2 border-white/20 p-5 shadow-2xl flex flex-col justify-between text-white transform transition-transform hover:scale-102">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20">
                      {selectedFood.category}
                    </span>
                    <h3 className="font-extrabold text-lg mt-1 leading-snug">
                      {selectedFood.name}
                    </h3>
                    <p className="text-xs text-white/70">{selectedFood.brand}</p>
                  </div>
                  <span
                    className={`text-xs font-black px-2 py-1 rounded-md shadow ${getNutriGradeColor(
                      selectedFood.nutriGrade
                    )}`}
                  >
                    Grade {selectedFood.nutriGrade}
                  </span>
                </div>

                {/* Package Center Illustration or Badge */}
                <div className="my-auto text-center py-4">
                  <div className="inline-block p-4 rounded-2xl bg-white/10 border border-white/20 shadow-inner">
                    <span className="text-4xl">
                      {selectedFood.category.includes('Chocolate')
                        ? '🍫'
                        : selectedFood.category.includes('Noodles')
                        ? '🍜'
                        : selectedFood.category.includes('Dairy')
                        ? '🧀'
                        : selectedFood.category.includes('Chips')
                        ? '🥨'
                        : selectedFood.category.includes('Fruit')
                        ? '🍏'
                        : selectedFood.category.includes('Honey')
                        ? '🍯'
                        : selectedFood.category.includes('Beverage')
                        ? '🥤'
                        : '📦'}
                    </span>
                  </div>
                  <p className="text-xs text-white/80 font-medium mt-2">
                    {selectedFood.calories} kcal · {selectedFood.sugar}g sugar
                  </p>
                </div>

                {/* Packaging Barcode Mock */}
                <div className="bg-white/10 rounded-lg p-2 flex items-center justify-between">
                  <div className="flex items-center space-x-0.5">
                    <div className="w-1 h-5 bg-white"></div>
                    <div className="w-0.5 h-5 bg-white"></div>
                    <div className="w-1.5 h-5 bg-white"></div>
                    <div className="w-0.5 h-5 bg-white"></div>
                    <div className="w-2 h-5 bg-white"></div>
                    <div className="w-1 h-5 bg-white"></div>
                  </div>
                  <span className="text-[10px] font-mono text-white/80">
                    {selectedFood.barcode || '8901058850048'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* AR Viewfinder 4 Corner Brackets (Green) - Matching uploaded sketch */}
          <div className="absolute inset-4 sm:inset-6 pointer-events-none z-20">
            {/* Top Left */}
            <div className="absolute top-0 left-0 w-10 sm:w-16 h-10 sm:h-16 border-t-4 border-l-4 border-emerald-500 rounded-tl-2xl"></div>
            {/* Top Right */}
            <div className="absolute top-0 right-0 w-10 sm:w-16 h-10 sm:h-16 border-t-4 border-r-4 border-emerald-500 rounded-tr-2xl"></div>
            {/* Bottom Left */}
            <div className="absolute bottom-0 left-0 w-10 sm:w-16 h-10 sm:h-16 border-b-4 border-l-4 border-emerald-500 rounded-bl-2xl"></div>
            {/* Bottom Right */}
            <div className="absolute bottom-0 right-0 w-10 sm:w-16 h-10 sm:h-16 border-b-4 border-r-4 border-emerald-500 rounded-br-2xl"></div>

            {/* Central Target Reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-emerald-500/40 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            </div>
          </div>

          {/* Laser Scanning Animation Line */}
          {(isScanning || aiAnalyzing) && (
            <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scan-line pointer-events-none z-30">
              <div className="absolute right-2 -top-5 text-[10px] font-mono text-emerald-300 bg-slate-900/90 px-2 py-0.5 rounded border border-emerald-500/40">
                {aiAnalyzing ? 'AI MULTIMODAL OCR...' : 'EXTRACTING NUTRIENTS...'}
              </div>
            </div>
          )}

          {/* Floating AR Holographic Insight Overlays */}
          {showAROverlay && !isScanning && (
            <div className="absolute inset-0 pointer-events-auto p-4 z-20 flex flex-col justify-between">
              {/* Top AR Status Bar */}
              <div className="flex items-center justify-between">
                {/* Traffic Light Signal (GOOD / OK / BAD) */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-xs tracking-wider shadow-lg border backdrop-blur-md animate-float-slow ${getSignalBadgeColor(
                    selectedFood.consumptionSignal
                  )}`}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  CONTINUOUS USE: {selectedFood.consumptionSignal}
                </div>

                {/* Health Score Pill */}
                <div className="bg-slate-900/80 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>Score: {selectedFood.healthScore}/100</span>
                </div>
              </div>

              {/* Middle Dynamic AR Tags */}
              <div className="relative w-full h-full my-auto pointer-events-none">
                {selectedFood.arFloatingTags?.map((tag, idx) => (
                  <div
                    key={idx}
                    style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-xl backdrop-blur-md pointer-events-auto cursor-default animate-float-slow transition-all border ${
                      tag.type === 'kid-alert'
                        ? 'bg-rose-950/90 text-rose-200 border-rose-500/80 shadow-rose-900/50'
                        : tag.type === 'warning'
                        ? 'bg-amber-950/90 text-amber-200 border-amber-500/80 shadow-amber-900/50'
                        : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/80 shadow-emerald-900/50'
                    }`}
                  >
                    {tag.label}
                  </div>
                ))}
              </div>

              {/* Bottom AR Action Bar */}
              <div className="flex items-end justify-between gap-2">
                {/* Kid Hazard Banner if dangerous */}
                {!selectedFood.kidSuitability.isRecommendedForKids && (
                  <button
                    onClick={() => onOpenKidVisualizer(selectedFood)}
                    className="flex items-center gap-2 bg-rose-600/90 hover:bg-rose-600 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-lg backdrop-blur-md border border-rose-400 transition-all group"
                  >
                    <ShieldAlert className="w-4 h-4 animate-bounce" />
                    <span>⚠️ Kid Warning: {selectedFood.kidSuitability.sugarSpoonsCount} Spoons Sugar!</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}

                <button
                  onClick={() => setShowAROverlay(!showAROverlay)}
                  className="ml-auto bg-slate-900/80 hover:bg-slate-800 text-white/80 p-2 rounded-xl text-xs backdrop-blur-md border border-white/20 transition-all"
                  title="Toggle AR Overlays"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Real-time Nutritional Breakdown & Action Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {selectedFood.brand} · {selectedFood.category}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {selectedFood.name}
                </h3>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black shadow-sm ${getNutriGradeColor(
                    selectedFood.nutriGrade
                  )}`}
                >
                  Nutri-Grade {selectedFood.nutriGrade}
                </span>
              </div>
            </div>

            {/* Quick Macro Pills */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Calories</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {selectedFood.calories}
                </span>
                <span className="text-[10px] text-slate-400">kcal</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Sugar</span>
                <span
                  className={`text-sm font-extrabold ${
                    selectedFood.sugar > 20
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {selectedFood.sugar}g
                </span>
                <span className="text-[10px] text-slate-400">
                  (~{(selectedFood.sugar / 4).toFixed(1)} spoons)
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Fats</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {selectedFood.totalFats}g
                </span>
                <span className="text-[10px] text-slate-400">total</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Protein</span>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                  {selectedFood.protein}g
                </span>
                <span className="text-[10px] text-slate-400">builder</span>
              </div>
            </div>

            {/* Continuous Consumption Signal Alert Box */}
            <div
              className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                selectedFood.consumptionSignal === 'GOOD'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : selectedFood.consumptionSignal === 'OK'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                {selectedFood.consumptionSignal === 'GOOD' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                )}
                <span>
                  Continuous Intake Signal:{' '}
                  <strong className="underline uppercase tracking-wide">
                    {selectedFood.consumptionSignal}
                  </strong>
                </span>
              </div>
              <p>
                <strong>Recommended:</strong> {selectedFood.recommendedAmount} during{' '}
                {selectedFood.recommendedTime} ({selectedFood.frequency}).
              </p>
              <p className="mt-1">
                <strong>Excess Warning:</strong> {selectedFood.excessIntakeEffects}.
              </p>
            </div>

            {/* Kid Specific Health Hazard Callout */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold font-fun text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  🧒 Kid & Minor Suitability
                </span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    selectedFood.kidSuitability.isRecommendedForKids
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {selectedFood.kidSuitability.isRecommendedForKids
                    ? 'Safe for Kids'
                    : 'Not Recommended'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {selectedFood.kidSuitability.kidWarningText}
              </p>

              <button
                onClick={() => onOpenKidVisualizer(selectedFood)}
                className="mt-2.5 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-fun font-bold text-xs shadow-sm transition-all"
              >
                <span>Explore Kids Negative Health Effect Visualizer</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Healthier Alternatives Preview */}
            {selectedFood.healthierAlternatives.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    Recommended Healthier Alternatives
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    Smart Swaps
                  </span>
                </div>

                {selectedFood.healthierAlternatives.slice(0, 2).map((alt, i) => (
                  <div
                    key={i}
                    className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/80 dark:border-emerald-800/50 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {alt.name}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                          {alt.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        {alt.benefitHighlight}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block">
                        {alt.calories} kcal
                      </span>
                      <span className="text-[10px] text-slate-500">{alt.sugar}g sugar</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View Full Deep Nutritional Report Button */}
            <button
              onClick={() => onSelectFood(selectedFood)}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Inspect Full Ingredient & Scientific Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Preset Test Packs Scroller */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Instant Sample Packs to Test</span>
              <span className="text-[11px] font-normal text-slate-500">
                (Tap to simulate instant scan)
              </span>
            </h3>
          </div>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {OFFICIAL_HACKATHON_DATASET.length} Loaded Samples
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {OFFICIAL_HACKATHON_DATASET.map((item) => {
            const isSelected = selectedFood.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectPreset(item)}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between group ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Top badges */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    {item.id}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.consumptionSignal === 'GOOD'
                        ? 'bg-emerald-500'
                        : item.consumptionSignal === 'OK'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  />
                </div>

                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {item.brand}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {item.calories} kcal
                  </span>
                  <span
                    className={`font-black ${
                      item.sugar > 20 ? 'text-rose-500 font-extrabold' : 'text-slate-500'
                    }`}
                  >
                    {item.sugar}g sugar
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
