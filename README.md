# FoodLens — Ultra-Futuristic AI Food Intelligence Platform

FoodLens is a comprehensive AI-powered food intelligence, package analysis, and pediatric health safety platform. Designed for families, parents, and children, FoodLens combines multi-modal image and barcode recognition, an algorithmic NutriGrade engine, WHO guideline tracking, gamified kids' digestion battle animations, and Zero-Knowledge End-to-End Encrypted (E2EE) backup.

---

## 🌟 Key Features

1. **AI & Algorithmic Package Scanner (`ARFoodScanner`)**
   - Live camera scanning with OCR (`tesseract.js`) and Barcode detection (`html5-qrcode`).
   - Image upload support with automatic Gemini 2.5 Flash multi-modal vision analysis.
   - Built-in algorithmic fallback to the verified `OFFICIAL_HACKATHON_DATASET` ensuring 100% reliability even if external AI quotas are limited.
   - Real-time AR floating tags highlighting proteins, hidden sugars, harmful additives, and pediatric warnings.

2. **Pediatric Health & Kid Harm Visualizer (`KidHarmVisualizer`, `KidsBugBattleAnimation`)**
   - Sugar-to-teaspoons visualizer based on WHO daily limits (24g sugar max for children).
   - Organ harm simulation mapping ingredients to impact on teeth, brain focus, tummy digestion, energy spikes, and heart health.
   - Interactive Bug Battle gamification: Good Warrior Microbes fight off Sugar Bugs based on nutritional density.

3. **NutriGrade Engine & Smart Swaps (`NutritionalDataView`)**
   - Clear NutriGrade scoring (A, B, C, D, E) and consumption signals (GOOD, OK, BAD).
   - Curated healthier alternatives and smart swaps with side-by-side nutritional comparisons.

4. **WHO Daily Goals & Intake Tracker (`DailyGoalsIntake`)**
   - Tracks daily calories, sugar, saturated fats, protein, and water hydration.
   - Visual progress rings and dynamic alerts when exceeding child health thresholds.

5. **Parental Controls & Minor Privacy (`ParentalControlModal`)**
   - PIN-protected controls to block high-sugar and caffeine-containing foods.
   - Incognito mode and minor data privacy compliance.

6. **Zero-Knowledge E2EE Cloud Backup (`EncryptedBackupModal`)**
   - Client-side AES-GCM encryption with SHA-256 integrity verification.
   - Encrypted payloads synced to `/api/backup/save` without the server ever seeing plaintext data.

7. **Cross-Platform Android Support**
   - Powered by Capacitor 8 (`@capacitor/android`) for native Android APK/AAB packaging.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Motion (Framer Motion), Lucide React, Canvas Confetti
- **Backend / Serverless:** Node.js, Express, `@google/genai` (Gemini 2.5 Flash)
- **Scanning:** `tesseract.js` (OCR), `html5-qrcode` (Barcodes)
- **Mobile:** Capacitor 8 (`@capacitor/core`, `@capacitor/android`, `@capacitor/cli`)
- **Deployment:** Vercel (Serverless API + Vite SPA)

---

## 📁 Project Structure

```
FoodLens/
├── api/
│   └── index.ts                 # Express API router & Vercel Serverless Function
├── android/                     # Capacitor Android native project
├── public/
│   ├── foodlens-icon.svg        # App icons & branding
│   └── products/                # High-res verified product packaging images
├── src/
│   ├── components/
│   │   ├── ARFoodScanner.tsx    # Multi-modal camera/upload scanner
│   │   ├── NutritionalDataView.tsx # Nutrition breakdown & Kid warnings
│   │   ├── KidsBugBattleAnimation.tsx # Gamified bug battle
│   │   ├── DailyGoalsIntake.tsx # WHO intake tracking
│   │   ├── DatasetExplorer.tsx  # Verified food catalog
│   │   ├── Header.tsx           # Navigation & quick toggles
│   │   ├── HomeScreen.tsx       # Main dashboard
│   │   ├── KidHarmVisualizer.tsx # Organ impact visualizer
│   │   ├── ParentalControlModal.tsx # PIN-protected parental safeguards
│   │   ├── EncryptedBackupModal.tsx # E2EE backup manager
│   │   ├── AlgorithmTransparencyModal.tsx # Scoring methodology audit
│   │   └── ui/                  # Reusable futuristic UI primitives
│   ├── data/
│   │   └── foodDataset.ts       # Verified hackathon dataset & products
│   ├── services/
│   │   ├── cryptoBackup.ts      # Web Crypto AES-GCM encryption
│   │   └── nutritionAlgorithm.ts # Health score & NutriGrade calculation
│   ├── types/
│   │   └── food.ts              # Core TypeScript interfaces
│   ├── App.tsx                  # Master application container
│   ├── index.css                # Global futuristic styles & theme
│   └── main.tsx                 # React DOM mount point
├── capacitor.config.ts          # Capacitor configuration
├── package.json                 # Dependencies & scripts
├── server.ts                    # Local Express + Vite development server
├── vercel.json                  # Vercel serverless routing configuration
└── vite.config.ts               # Vite bundler configuration
```

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3000
```
*(Note: If no API key is provided, FoodLens automatically runs in safe offline mode using the verified algorithmic engine).*

### 3. Run Dev Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Deploying to Vercel

### Method 1: Git-Connected Automatic Deployment (Recommended)
1. Push your repository to GitHub:
   ```bash
   git push origin main
   ```
2. Go to **[vercel.com/new](https://vercel.com/new)**.
3. Import your GitHub repository (`shread-18/foodlensfinal`).
4. Vercel automatically detects the configuration from `vercel.json`:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = your Google Gemini API key
6. Click **Deploy**!

### Method 2: Vercel CLI
```bash
npx vercel login
npx vercel --prod
```

---

## 📡 API Endpoints

- `GET /api/health` — Service health status
- `GET /api/products` — Retrieve all verified food items (supports `?q=search`)
- `GET /api/products/:identifier` — Look up product by ID or barcode
- `POST /api/analyze-food` — AI vision analysis for packaged foods
- `POST /api/backup/save` — Store zero-knowledge encrypted backup
- `GET /api/backup/load/:backupId` — Retrieve encrypted backup by ID

---

## 🔒 Security & Privacy

- **Zero-Knowledge Architecture:** Scan data is encrypted client-side before transmission.
- **Children's Online Privacy:** Kid mode restricts non-pediatric content and disables marketing trackers.
- **Algorithm Transparency:** Every NutriGrade score and signal can be audited directly from the transparency modal.
