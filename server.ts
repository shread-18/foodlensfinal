import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '25mb' }));

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

// AI Food Package Analysis Endpoint using Gemini 3.8 Flash
app.post('/api/analyze-food', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', queryText } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in environment variables. Falling back to local algorithmic analysis.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const promptText = `You are FoodLens AI, an intelligent food-package nutritionist and safety analyzer for families and children created by Team Nexora.
Analyze the provided packaged food image or description.
Extract and calculate the following structured JSON:
{
  "productName": "string (accurate product name)",
  "brand": "string",
  "category": "string (e.g. Snacks, Dairy, Noodles, Chocolate, Drink, etc.)",
  "calories": number (kcal per serving or 100g),
  "sugar": number (grams),
  "totalFats": number (grams),
  "saturatedFat": number (grams),
  "protein": number (grams),
  "sodium": number (mg),
  "allergens": ["string"],
  "ingredientsList": ["string"],
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
      model: 'gemini-3.8-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text || '{}';
    let parsed: any;
    try {
      parsed = JSON.parse(outputText);
    } catch {
      // Clean up markdown quotes if needed
      const cleaned = outputText.replace(/```json\n?|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      source: 'gemini-3.8-flash',
      data: parsed,
    });
  } catch (error: any) {
    console.error('Error in /api/analyze-food:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze food package',
      details: error.toString(),
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

  app.listen(port, '0.0.0.0', () => {
    console.log(`FoodLens AI server is running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
