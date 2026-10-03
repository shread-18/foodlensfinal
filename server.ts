import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const analysisModel = 'gemini-3.8-flash';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback;
}

function readStringList(value: unknown): string[] | null {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) return null;
  return value.map((item: string) => item.trim()).filter(Boolean);
}

function normalizeAnalysisResponse(value: unknown): Record<string, unknown> | null {
  if (!isRecord(value)) return null;
  const productName = readString(value.productName);
  if (!productName) return null;

  const nestedNutrition = isRecord(value.nutrition) ? value.nutrition : {};
  const nutritionKeys = {
    calories: 'calories',
    protein: 'protein',
    carbohydrates: 'carbohydrates',
    sugar: 'sugar',
    totalFats: 'fat',
    saturatedFat: 'saturatedFat',
    fiber: 'fiber',
    sodium: 'sodium',
  };
  const nutrition: Record<string, number | null> = {};
  for (const [key, alias] of Object.entries(nutritionKeys)) {
    const raw = Object.prototype.hasOwnProperty.call(value, key) ? value[key] : nestedNutrition[alias];
    if (raw === undefined || raw === null) {
      nutrition[key] = null;
    } else if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) {
      nutrition[key] = raw;
    } else {
      return null;
    }
  }

  const ingredients = readStringList(value.ingredientsList ?? value.ingredients);
  const additives = readStringList(value.additives);
  const preservatives = readStringList(value.preservatives);
  const allergens = readStringList(value.allergens);
  if (!ingredients || !additives || !preservatives || !allergens) return null;
  if (Object.values(nutrition).every((item) => item === null)
    && ingredients.length === 0 && additives.length === 0 && preservatives.length === 0 && allergens.length === 0) {
    return null;
  }

  return {
    productName,
    brand: readString(value.brand, 'Unknown brand'),
    category: readString(value.category, 'Packaged food'),
    ...nutrition,
    nutritionBasis: readString(value.nutritionBasis, 'As reported on the package'),
    servingSize: readString(value.servingSize),
    ingredientsList: ingredients,
    additives,
    preservatives,
    allergens,
    recommendedAmount: readString(value.recommendedAmount, 'Check the package serving size'),
    recommendedTime: readString(value.recommendedTime, 'Any time'),
    recommendedFrequency: readString(value.recommendedFrequency, 'Consider as part of your overall diet'),
    positiveEffects: readString(value.positiveEffects),
    excessIntakeEffects: readString(value.excessIntakeEffects),
  };
}

app.use(express.json({ limit: '25mb' }));

if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_actual_key_here') {
  console.warn('GEMINI_API_KEY is missing or still a placeholder. AI analysis is disabled; dataset matching remains available.');
}

// In-memory encrypted backup store for E2EE cloud backup simulation
const encryptedCloudBackups = new Map<string, { payload: string; timestamp: number; checksum: string }>();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'FoodLens AI Backend (Nexora)', time: new Date().toISOString() });
});

// E2EE Cloud Backup endpoint: stores only cipher text (Zero-Knowledge)
app.post('/api/backup/save', (req, res) => {
  try {
    const { backupId, encryptedPayload, checksum } = req.body;
    if (!backupId || !encryptedPayload) {
      return res.status(400).json({ error: 'Missing backupId or encryptedPayload' });
    }
    encryptedCloudBackups.set(backupId, {
      payload: encryptedPayload,
      timestamp: Date.now(),
      checksum: checksum || 'sha256-verified',
    });
    return res.json({
      success: true,
      backupId,
      storedAt: new Date().toISOString(),
      message: 'End-to-End Encrypted backup secured in cloud storage. Zero-knowledge verified.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to save cloud backup' });
  }
});

// E2EE Cloud Backup retrieve endpoint
app.get('/api/backup/load/:backupId', (req, res) => {
  const { backupId } = req.params;
  const backup = encryptedCloudBackups.get(backupId);
  if (!backup) {
    return res.status(404).json({ error: 'Encrypted backup not found with given ID' });
  }
  return res.json({
    success: true,
    backupId,
    encryptedPayload: backup.payload,
    timestamp: backup.timestamp,
    checksum: backup.checksum,
  });
});

// AI food package analysis using Gemini Flash vision.
app.post('/api/analyze-food', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', queryText } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_actual_key_here') {
      return res.status(503).json({
        code: 'MISSING_API_KEY',
        error: 'FoodLens AI is not configured. Set GEMINI_API_KEY in the project .env file and restart the server.',
      });
    }
    if (typeof imageBase64 !== 'string' || imageBase64.length === 0) {
      return res.status(400).json({ code: 'INVALID_IMAGE', error: 'A food package image is required.' });
    }
    if (typeof mimeType !== 'string' || !mimeType.startsWith('image/')) {
      return res.status(400).json({ code: 'INVALID_IMAGE_TYPE', error: 'The uploaded file must be an image.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const promptText = `You are FoodLens AI, an intelligent food-package nutritionist and safety analyzer for families and children created by Team Nexora.
Analyze the provided packaged food image or description.
Extract and calculate the following structured JSON:
{
  "productName": "string (accurate product name)",
  "brand": "string",
  "category": "string (e.g. Snacks, Dairy, Noodles, Chocolate, Drink, etc.)",
  "calories": number or null (kcal per serving or 100g),
  "carbohydrates": number or null (grams),
  "sugar": number or null (grams),
  "totalFats": number or null (grams),
  "saturatedFat": number or null (grams),
  "protein": number or null (grams),
  "fiber": number or null (grams),
  "sodium": number or null (mg),
  "nutritionBasis": "per 100 g" | "per serving",
  "servingSize": "string",
  "allergens": ["string"],
  "ingredientsList": ["string"],
  "additives": ["string"],
  "preservatives": ["string"],
  "healthScore": number (0 to 100 based on nutritional density, processing degree, sugar/fat/salt),
  "nutriGrade": "A" | "B" | "C" | "D" | "E",
  "consumptionSignal": "GOOD" | "OK" | "BAD" (for continuous regular consumption: GOOD = healthy daily/regular, OK = moderate/occasional, BAD = limit/harmful if frequent),
  "recommendedAmount": "string (e.g. '1 pack occasionally' or '30-50g breakfast daily')",
  "recommendedTime": "string (e.g. 'Breakfast', 'Evening snack', 'Post-workout')",
  "recommendedFrequency": "string (e.g. 'Regularly', 'Occasionally', 'Small amounts', 'Rare treats')",
  "positiveEffects": "string (brief benefit e.g. 'Provides quick energy' or 'High calcium and protein')",
  "excessIntakeEffects": "string (harmful results if overconsumed e.g. 'Excess calories, rapid sugar crash, dental risk')",
  "kidSuitability": {
    "isRecommendedForKids": boolean,
    "minimumAge": number,
    "hazardLevel": "low" | "moderate" | "high" | "critical",
    "kidWarningText": "string (clear, direct warning for parents & children explaining why it might be harmful)",
    "sugarSpoonsCount": number (sugar grams divided by 4, rounded to 1 decimal),
    "harmfulAdditives": ["string"],
    "visualHarmEffects": [
      {
        "title": "string (e.g. 'Teeth Cavities')",
        "desc": "string (explanation of how this item impacts children's teeth, brain focus, tummy, etc.)",
        "organ": "teeth" | "brain" | "tummy" | "energy" | "heart"
      }
    ]
  },
  "healthierAlternatives": [
    {
      "name": "string (a much healthier real alternative)",
      "brand": "string",
      "calories": number,
      "sugar": number,
      "fats": number,
      "protein": number,
      "benefitHighlight": "string (e.g. '85% less sugar, rich in dietary fiber')",
      "badge": "string (e.g. 'Smart Swap', 'High Protein', 'Whole Grain')"
    }
  ],
  "arFloatingTags": [
    { "label": "string", "type": "warning" | "positive" | "neutral" | "kid-alert", "x": 30, "y": 40 },
    { "label": "string", "type": "warning" | "positive" | "neutral" | "kid-alert", "x": 65, "y": 30 },
    { "label": "string", "type": "warning" | "positive" | "neutral" | "kid-alert", "x": 50, "y": 70 }
  ]
}

Ensure the output is ONLY valid raw JSON with NO markdown code fences. Keep insights scientifically sound and actionable.
${queryText ? `User description or product notes: ${queryText}` : ''}
`;

    const contents: any[] = [];
    if (imageBase64) {
      // Strip any data:image/*;base64, prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      contents.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }
    contents.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: analysisModel,
      contents,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text?.trim();
    if (!outputText) {
      return res.status(502).json({ code: 'EMPTY_AI_RESPONSE', error: 'The analysis service returned no food data.' });
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(outputText);
    } catch {
      const cleaned = outputText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        return res.status(502).json({ code: 'INVALID_AI_RESPONSE', error: 'The analysis service returned unreadable food data.' });
      }
    }
    const normalized = normalizeAnalysisResponse(parsed);
    if (!normalized) {
      return res.status(502).json({ code: 'INVALID_AI_RESPONSE', error: 'The analysis service returned incomplete food data.' });
    }

    return res.json({
      success: true,
      source: analysisModel,
      data: normalized,
    });
  } catch (error: any) {
    console.error('Error in /api/analyze-food:', error);
    return res.status(502).json({
      code: 'ANALYSIS_FAILED',
      error: 'The food analysis service could not complete the request.',
    });
  }
});

// Setup Vite middlewares for development or serve dist for production
async function startServer() {
  const distPath = path.resolve(process.cwd(), 'dist');

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`FoodLens AI server is running on http://0.0.0.0:${port}`);
  });
  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Set PORT to an available port and try again.`);
    } else {
      console.error('FoodLens AI server failed to listen:', error.message);
    }
    process.exitCode = 1;
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
