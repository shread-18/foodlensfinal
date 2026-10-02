/**
 * FoodLens AI - Smart Food Pack Scanner & Health Portal
 * Full-width Desktop & Tablet Website Architecture
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { DashboardSwitcher } from './components/DashboardSwitcher';
import { WebsiteFooter } from './components/WebsiteFooter';
import { HomeOverview } from './pages/HomeOverview';
import { ScanDashboard } from './pages/ScanDashboard';
import { NutritionDashboard } from './pages/NutritionDashboard';
import { KidGrowthDashboard } from './pages/KidGrowthDashboard';
import { GoalsDashboard } from './pages/GoalsDashboard';
import { KidModeDashboard } from './pages/KidModeDashboard';
import { ParentalControlModal } from './components/ParentalControlModal';
import { EncryptedBackupModal } from './components/EncryptedBackupModal';
import { PhoneInstallModal } from './components/PhoneInstallModal';
import { AabExportModal } from './components/AabExportModal';

const AppLayout: React.FC = () => {
  const {
    isParentalModalOpen,
    setIsParentalModalOpen,
    parentalSettings,
    updateParentalSettings,
    isBackupModalOpen,
    setIsBackupModalOpen,
    isPhoneModalOpen,
    setIsPhoneModalOpen,
    isAabModalOpen,
    setIsAabModalOpen,
    scanHistory,
    clearScanHistory,
    dailySummary,
    restoreData,
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      {/* 1. Main Website Portal Header */}
      <Header />

      {/* 2. Specialized Dashboard Switcher Bar */}
      <DashboardSwitcher />

      {/* 3. Full-width Responsive Website Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          {/* Portal Overview */}
          <Route path="/" element={<HomeOverview />} />

          {/* DASHBOARD 1: Scanner & AI Packaging Vision */}
          <Route path="/scan" element={<ScanDashboard />} />

          {/* DASHBOARD 2: Nutrition Facts & Additive Safety Intelligence */}
          <Route path="/nutrition" element={<NutritionDashboard />} />

          {/* DASHBOARD 3: Kid Body & Growth Reaction Simulator */}
          <Route path="/growth" element={<KidGrowthDashboard />} />
          <Route path="/bug-battle" element={<Navigate to="/growth" replace />} />

          {/* DASHBOARD 4: Daily Health Goals & Hydration Intake Log */}
          <Route path="/goals" element={<GoalsDashboard />} />

          {/* DASHBOARD 5: Safe Kid Mode Zone */}
          <Route path="/kid-mode" element={<KidModeDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 4. Full Website Portal Footer */}
      <WebsiteFooter />

      {/* Global Security & Admin Modals */}
      <ParentalControlModal
        isOpen={isParentalModalOpen}
        onClose={() => setIsParentalModalOpen(false)}
        settings={parentalSettings}
        onUpdateSettings={updateParentalSettings}
        onClearAllHistory={clearScanHistory}
      />

      <EncryptedBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        history={scanHistory}
        dailySummary={dailySummary}
        onRestoreData={(restoredHistory, restoredSummary) => {
          restoreData(restoredHistory, restoredSummary);
        }}
      />

      <PhoneInstallModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
      />

      <AabExportModal
        isOpen={isAabModalOpen}
        onClose={() => setIsAabModalOpen(false)}
      />
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
