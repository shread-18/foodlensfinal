import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium } from 'lucide-react';

export const MobileStatusBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).replace(/ [AP]M/, '')
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full px-7 pt-3 pb-1 flex items-center justify-between text-[13px] font-semibold text-slate-800 dark:text-slate-200 select-none z-50">
      {/* Left: Clock Time */}
      <span className="font-mono tracking-tight font-bold text-xs">{currentTime}</span>

      {/* Center: Dynamic Island Pill Notch */}
      <div className="h-4.5 w-24 bg-slate-900 dark:bg-black rounded-full shadow-inner flex items-center justify-between px-2 text-[9px] text-white">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-[8px] font-mono tracking-tighter text-slate-400">FoodLens</span>
        <span className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700"></span>
      </div>

      {/* Right: Signal, Wifi, Battery Icons */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-black tracking-tight text-slate-600 dark:text-slate-400">5G</span>
        <Wifi className="w-3.5 h-3.5" />
        <BatteryMedium className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      </div>
    </div>
  );
};
