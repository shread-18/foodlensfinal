/** FoodLens AI website routes and shared layout. */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AppProvider } from './context/AppContext';

import { Header } from './components/Header';
import { WebsiteFooter } from './components/WebsiteFooter';

import { HomeOverview } from './pages/HomeOverview';
import { ScanFoodPage } from './pages/ScanFoodPage';

import {
  FoodInfoPage,
  HealthInsightsPage,
  ResultPage,
  AboutPage,
} from './pages/FoodInfoPages';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-200">

      <Header />

      <main className="flex-1">
        <Routes>

          {/* Home */}
          <Route path="/" element={<HomeOverview />} />

          {/* Food scanning */}
          <Route path="/scan" element={<ScanFoodPage />} />

          {/* Scan result */}
          <Route path="/result" element={<ResultPage />} />

          {/* Food information */}
          <Route path="/nutrition" element={<FoodInfoPage />} />
          <Route path="/ingredients" element={<FoodInfoPage />} />

          {/* Health */}
          <Route path="/health" element={<HealthInsightsPage />} />
          <Route
            path="/health-insights"
            element={<HealthInsightsPage />}
          />

          {/* About */}
          <Route path="/about" element={<AboutPage />} />

          {/* Compatibility routes */}
          <Route
            path="/growth"
            element={<Navigate to="/health" replace />}
          />

          <Route
            path="/bug-battle"
            element={<Navigate to="/health" replace />}
          />

          <Route
            path="/goals"
            element={<Navigate to="/nutrition" replace />}
          />

          <Route
            path="/kid-mode"
            element={<Navigate to="/health" replace />}
          />

          {/* Unknown URL */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </main>

      <WebsiteFooter />

    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
}