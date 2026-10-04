import React from 'react';

export type StatusVariant = 'online' | 'ready' | 'active' | 'warning' | 'critical';

export interface StatusBadgeProps {
  status?: StatusVariant;
  variant?: StatusVariant;
  label: string;
  sublabel?: string;
  className?: string;
  pulse?: boolean;
  dotColor?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  label,
  sublabel,
  className = '',
  pulse = true,
  dotColor,
}) => {
  const activeStatus = variant || status || 'online';

  const getColors = () => {
    switch (activeStatus) {
      case 'online':
      case 'ready':
      case 'active':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: dotColor || 'bg-emerald-400 shadow-[0_0_8px_#00F5A0]',
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: dotColor || 'bg-amber-400 shadow-[0_0_8px_#FBBF24]',
        };
      case 'critical':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          dot: dotColor || 'bg-rose-400 shadow-[0_0_8px_#FF4D6D]',
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border backdrop-blur-md font-mono text-[10px] tracking-wider uppercase ${colors.bg} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors.dot}`}
          ></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${colors.dot}`}></span>
      </span>
      <span className="font-semibold text-slate-200">{label}</span>
      {sublabel && (
        <span className="text-slate-400 border-l border-slate-700/60 pl-1.5 ml-0.5">
          {sublabel}
        </span>
      )}
    </div>
  );
};
