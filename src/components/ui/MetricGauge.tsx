import React from 'react';

interface MetricGaugeProps {
  label: string;
  value: number;
  unit: string;
  maxRecommended?: number;
  statusText?: string;
  statusType?: 'good' | 'warning' | 'danger' | 'neutral';
  icon?: React.ReactNode;
  subtitle?: string;
}

export const MetricGauge: React.FC<MetricGaugeProps> = ({
  label,
  value,
  unit,
  maxRecommended = 100,
  statusText,
  statusType = 'neutral',
  icon,
  subtitle,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / maxRecommended) * 100));

  const getStatusColor = () => {
    switch (statusType) {
      case 'good':
        return {
          bar: 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_#00F5A0]',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
      case 'warning':
        return {
          bar: 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_10px_#FBBF24]',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        };
      case 'danger':
        return {
          bar: 'bg-gradient-to-r from-rose-500 to-red-500 shadow-[0_0_10px_#FF4D6D]',
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        };
      case 'neutral':
      default:
        return {
          bar: 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_#00D9FF]',
          badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        };
    }
  };

  const colors = getStatusColor();

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-400">{icon}</span>}
          <span className="text-xs font-tech font-bold uppercase tracking-wider text-slate-400">
            {label}
          </span>
        </div>
        {statusText && (
          <span className={`text-[10px] font-tech font-bold px-2 py-0.5 rounded-full border ${colors.badge}`}>
            {statusText}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1 my-1">
        <span className="text-2xl font-black font-display text-white tracking-tight">
          {value}
        </span>
        <span className="text-xs font-tech text-slate-400">{unit}</span>
      </div>

      {subtitle && (
        <span className="text-[11px] text-slate-400 mb-2">{subtitle}</span>
      )}

      {/* Progress Bar with glowing fill */}
      <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
