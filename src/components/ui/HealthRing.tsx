import React from 'react';

interface HealthRingProps {
  score: number; // 0 to 100
  nutriGrade: string; // 'A' | 'B' | 'C' | 'D' | 'E'
  size?: number; // e.g. 160
  strokeWidth?: number; // e.g. 12
  label?: string;
  showGradeBadge?: boolean;
}

export const HealthRing: React.FC<HealthRingProps> = ({
  score,
  nutriGrade,
  size = 160,
  strokeWidth = 12,
  label = 'HEALTH SCORE',
  showGradeBadge = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return { stroke: '#00F5A0', glow: 'rgba(0, 245, 160, 0.45)', text: 'text-emerald-400' };
    if (score >= 65) return { stroke: '#00D9FF', glow: 'rgba(0, 217, 255, 0.45)', text: 'text-cyan-400' };
    if (score >= 50) return { stroke: '#FBBF24', glow: 'rgba(251, 191, 36, 0.45)', text: 'text-amber-400' };
    if (score >= 35) return { stroke: '#F97316', glow: 'rgba(249, 115, 22, 0.45)', text: 'text-orange-400' };
    return { stroke: '#FF4D6D', glow: 'rgba(255, 77, 109, 0.45)', text: 'text-rose-400' };
  };

  const colors = getColor();

  const getGradeBg = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-emerald-500 text-slate-950';
      case 'B': return 'bg-teal-400 text-slate-950';
      case 'C': return 'bg-amber-400 text-slate-950';
      case 'D': return 'bg-orange-500 text-white';
      case 'E':
      default: return 'bg-rose-600 text-white';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          style={{
            filter: `drop-shadow(0 0 10px ${colors.glow})`,
            transition: 'stroke-dashoffset 1s ease-out',
          }}
        />
      </svg>

      {/* Center Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`text-4xl md:text-5xl font-black tracking-tight font-display ${colors.text}`}>
          {score}
        </span>
        <span className="text-[9px] font-tech uppercase tracking-widest text-slate-400 mt-0.5">
          {label}
        </span>
        <span className="text-[10px] text-slate-500 font-mono">/100</span>

        {showGradeBadge && (
          <span
            className={`mt-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-md ${getGradeBg(
              nutriGrade
            )}`}
          >
            GRADE {nutriGrade}
          </span>
        )}
      </div>
    </div>
  );
};
