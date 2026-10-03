import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Camera, Check, ImagePlus, LoaderCircle, RotateCcw, Sparkles, Upload, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OFFICIAL_HACKATHON_DATASET } from '../data/foodDataset';
import { calculateHealthScore } from '../services/healthScore';
import { getFoodFromDataset } from '../services/foodDataset';
import { FoodItem } from '../types/food';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const nutritionAliases: Record<string, string> = {
  calories: 'calories',
  protein: 'protein',
  carbohydrates: 'carbohydrates',
  sugar: 'sugar',
  totalFats: 'fat',
  saturatedFat: 'saturatedFat',
  fiber: 'fiber',
  sodium: 'sodium',
};

function getNumber(data: Record<string, unknown>, key: string): number | undefined {
  const nutrition = data.nutrition && typeof data.nutrition === 'object'
    ? data.nutrition as Record<string, unknown>
    : {};
  const value = Object.prototype.hasOwnProperty.call(data, key)
    ? data[key]
    : nutrition[nutritionAliases[key] ?? key];
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : undefined;
}

function getString(data: Record<string, unknown>, key: string, fallback: string): string {
  const value = data[key];
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function getStringList(data: Record<string, unknown>, key: string, alias = key): string[] {
  const value = data[key] ?? data[alias];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : [];
}

function makeFoodItem(data: Record<string, unknown>): FoodItem {
  const name = getString(data, 'productName', '');
  if (!name) {
    throw new Error('The image did not contain a readable product name.');
  }

  const numericKeys = ['calories', 'protein', 'carbohydrates', 'sugar', 'totalFats', 'saturatedFat', 'fiber', 'sodium'] as const;
  const detectedValues = Object.fromEntries(numericKeys.map((key) => [key, getNumber(data, key)])) as Record<typeof numericKeys[number], number | undefined>;
  const unavailableNutrition = numericKeys.filter((key) => detectedValues[key] === undefined);
  const ingredientsList = getStringList(data, 'ingredientsList', 'ingredients');
  const additives = getStringList(data, 'additives');
  const preservatives = getStringList(data, 'preservatives');
  const allergens = getStringList(data, 'allergens');
  if (unavailableNutrition.length === numericKeys.length
    && ingredientsList.length === 0 && additives.length === 0 && preservatives.length === 0 && allergens.length === 0) {
    throw new Error('The image did not contain readable product details.');
  }
  const foodValues = {
    calories: detectedValues.calories ?? 0,
    protein: detectedValues.protein ?? 0,
    carbohydrates: detectedValues.carbohydrates,
    sugar: detectedValues.sugar ?? 0,
    totalFats: detectedValues.totalFats ?? 0,
    saturatedFat: detectedValues.saturatedFat,
    fiber: detectedValues.fiber,
    sodium: detectedValues.sodium,
  };
  const foodForScoring = { ...foodValues, unavailableNutrition };
  const score = calculateHealthScore(foodForScoring);

  return {
    id: `AI-${Date.now().toString(36)}`,
    name,
    brand: getString(data, 'brand', 'Unknown brand'),
    category: getString(data, 'category', 'Packaged food'),
    ...foodValues,
    unavailableNutrition: [...unavailableNutrition],
    nutritionBasis: getString(data, 'nutritionBasis', 'As reported on the package'),
    servingSize: getString(data, 'servingSize', ''),
    ingredientsList,
    additives,
    preservatives,
    allergens,
    recommendedAmount: getString(data, 'recommendedAmount', 'Check the package serving size'),
    recommendedTime: getString(data, 'recommendedTime', 'Any time'),
    frequency: getString(data, 'recommendedFrequency', 'Consider as part of your overall diet'),
    positiveEffects: getString(data, 'positiveEffects', 'Review the nutrition information for details.'),
    excessIntakeEffects: getString(data, 'excessIntakeEffects', 'Consider the serving size and nutrition information.'),
    healthScore: score.score,
    nutriGrade: score.score >= 85 ? 'A' : score.score >= 70 ? 'B' : score.score >= 50 ? 'C' : score.score >= 35 ? 'D' : 'E',
    consumptionSignal: score.score >= 70 ? 'GOOD' : score.score >= 50 ? 'OK' : 'BAD',
    kidSuitability: {
      isRecommendedForKids: true,
      minimumAge: 0,
      hazardLevel: score.score >= 70 ? 'low' : score.score >= 50 ? 'moderate' : 'high',
      kidWarningText: 'Check the ingredient and allergen information for your needs.',
      sugarSpoonsCount: Math.round((foodValues.sugar / 4) * 10) / 10,
      harmfulAdditives: additives,
      visualHarmEffects: [],
    },
    healthierAlternatives: [],
    arFloatingTags: [],
  };
}

export const ScanFoodPage: React.FC = () => {
  const navigate = useNavigate();
  const { addScanHistory } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDatasetFallbackAvailable, setIsDatasetFallbackAvailable] = useState(false);
  const [datasetSearch, setDatasetSearch] = useState('');

  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsCameraActive(false);
  };

  const setImagePreview = (file: File) => {
    setErrorMessage(null);
    setIsDatasetFallbackAvailable(false);
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Unable to upload the image. Please try again.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrorMessage('Please choose an image smaller than 10 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setPreview(null);
        setErrorMessage('Unable to upload the image. Please try again.');
        return;
      }
      const previewUrl = reader.result;
      const image = new Image();
      image.onload = () => {
        setPreview(previewUrl);
        setMimeType(file.type || 'image/jpeg');
      };
      image.onerror = () => {
        setPreview(null);
        setErrorMessage('This image format cannot be previewed by your browser. Please choose a JPG or PNG image.');
      };
      image.src = previewUrl;
    };
    reader.onerror = () => {
      setPreview(null);
      setErrorMessage('Unable to upload the image. Please try again.');
    };
    reader.onabort = () => {
      setPreview(null);
      setErrorMessage('Image upload was interrupted. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setImagePreview(file);
    event.target.value = '';
  };

  const openCamera = async () => {
    setErrorMessage(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage('Camera access is unavailable in this browser. Please upload an image instead.');
      return;
    }
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      setIsCameraActive(true);
    } catch {
      setErrorMessage('Unable to access the camera. Please upload an image instead.');
      stopCamera();
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setErrorMessage('The camera is not ready yet. Please try again.');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      setErrorMessage('Unable to capture an image. Please upload an image instead.');
      return;
    }
    context.drawImage(video, 0, 0);
    setPreview(canvas.toDataURL('image/jpeg', 0.9));
    setMimeType('image/jpeg');
    stopCamera();
  };

  const analyzeImage = async () => {
    if (!preview || isAnalyzing) return;
    setIsAnalyzing(true);
    setErrorMessage(null);
    let identifiedProductName = '';

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: preview,
          mimeType,
          queryText: 'Read the food package accurately. Report nutrition values using the labeled basis and do not guess values that are not visible.',
        }),
      });
      const result: { code?: string; data?: Record<string, unknown> } = await response.json();
      if (!response.ok) {
        if (result.code === 'MISSING_API_KEY' || response.status === 503) {
          throw new Error('missing-api-key');
        }
        throw new Error('request-failed');
      }
      if (!result.data) {
        throw new Error('The image could not be analyzed.');
      }
      identifiedProductName = getString(result.data, 'productName', '');
      const food = { ...makeFoodItem(result.data), analysisMode: 'AI' as const };
      addScanHistory(food, preview);
      navigate('/result');
    } catch (error) {
      console.warn('Food package analysis failed:', error);
      if (identifiedProductName) {
        const match = getFoodFromDataset(identifiedProductName);
        if (match) {
          addScanHistory({ ...match, analysisMode: 'Dataset' }, preview);
          navigate('/result');
          return;
        }
      }
      if (error instanceof Error && error.message === 'missing-api-key') {
        setIsDatasetFallbackAvailable(true);
        setErrorMessage('AI analysis needs a Gemini API key. Add GEMINI_API_KEY to the project .env file and restart the server. Your image has not been analyzed.');
        return;
      }
      setIsDatasetFallbackAvailable(true);
      setErrorMessage(
        error instanceof Error && (error.message.includes('image') || error.message.includes('nutrition information'))
          ? "We couldn't analyze this image. Please upload a clearer food package image."
          : 'AI analysis could not complete. You can select a matching product from the local dataset, or try again later.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const showDatasetMatch = () => {
  const search = datasetSearch.trim();

  if (!search) {
    setErrorMessage(
      'Please enter a product or brand name, for example "Maggi", "Yoga Bar", "Doritos", or "Britannia".'
    );
    return;
  }

  const match = getFoodFromDataset(search);

  if (!match) {
    setErrorMessage(
      `No product found for "${search}". Try "Maggi", "Yoga Bar", "Paneer", "Doritos", "Britannia", or "Honey".`
    );
    return;
  }

  setErrorMessage(null);

  addScanHistory(
    {
      ...match,
      analysisMode: 'Dataset',
    },
    preview ?? undefined
  );

  navigate('/result');
};

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">FoodLens AI</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-white sm:text-4xl">Scan Your Food</h1>
        <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
          Upload a food package image to analyze its ingredients and nutritional information.
        </p>
      </div>

      <div className="mt-9 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        {isCameraActive ? (
          <div className="space-y-4">
            <video ref={videoRef} autoPlay muted playsInline className="max-h-[26rem] w-full rounded-2xl bg-slate-950 object-contain" />
            <div className="flex flex-wrap justify-center gap-3">
              <button type="button" onClick={captureImage} className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-800">
                <Camera size={18} /> Capture image
              </button>
              <button type="button" onClick={stopCamera} className="rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                Close camera
              </button>
            </div>
          </div>
        ) : preview ? (
          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
              <img src={preview} alt="Selected food package preview" className="mx-auto max-h-[26rem] w-full object-contain" />
              <button
                type="button"
                onClick={() => { setPreview(null); setErrorMessage(null); }}
                aria-label="Remove selected image"
                className="absolute right-3 top-3 rounded-full bg-white p-2 text-slate-700 shadow hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="inline-flex min-w-44 items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAnalyzing ? <><LoaderCircle size={18} className="animate-spin" /> Analyzing Food...</> : <><Sparkles size={18} /> Analyze Food</>}
              </button>
              {!isAnalyzing && (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                  <RotateCcw size={17} /> Choose another
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 px-5 py-12 text-center dark:border-slate-700 dark:bg-slate-800/50 sm:px-10">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-800 shadow-sm dark:bg-slate-900 dark:text-emerald-300">
              <ImagePlus size={26} />
            </span>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Upload Food Image</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Choose a clear photo of the package or nutrition label.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-800">
                <Upload size={18} /> Upload Food Image
              </button>
              <button type="button" onClick={openCamera} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                <Camera size={18} /> Use Camera
              </button>
            </div>
            <p className="mt-4 text-xs text-slate-500">JPG, PNG, or another common image format · Up to 10 MB</p>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelection} className="sr-only" aria-label="Choose food package image" />

        {isAnalyzing && (
          <div role="status" className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-emerald-800 dark:text-emerald-300">
            <Check size={16} /> Reading package and processing nutrition information...
          </div>
        )}
        {errorMessage && (
          <div role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
            <AlertCircle size={18} className="mt-0.5 shrink-0" /> <span>{errorMessage}</span>
          </div>
        )}
        {isDatasetFallbackAvailable && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Use the local product dataset</p>
            <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">Choose the matching product to view its saved label information. This is a dataset match, not AI analysis of the uploaded image.</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                value={datasetSearch}
                onChange={(event) => setDatasetSearch(event.target.value)}
                placeholder="Search product or brand (e.g. Maggi)"
                aria-label="Search local food dataset"
                className="min-w-0 flex-1 rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-600 dark:border-amber-800 dark:bg-slate-900 dark:text-white"
              />
              <button type="button" onClick={showDatasetMatch} className="rounded-full bg-amber-700 px-4 py-2 text-sm font-bold text-white hover:bg-amber-800">
                Show dataset match
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
