import React from 'react';

interface FuturisticCardProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'cyan' | 'amber' | 'neutral';
  interactive?: boolean;
  cornerBrackets?: boolean;
  className?: string;
  onClick?: () => void;
}

export const FuturisticCard: React.FC<FuturisticCardProps> = ({
  children,
  variant = 'emerald',
  interactive = false,
  cornerBrackets = false,
  className = '',
  onClick,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'cyan':
        return 'glass-panel-cyan hover:border-cyan-400/50 hover:shadow-[0_16px_35px_-8px_rgba(0,217,255,0.2)]';
      case 'amber':
        return 'glass-panel-amber hover:border-amber-400/50 hover:shadow-[0_16px_35px_-8px_rgba(251,191,36,0.2)]';
      case 'neutral':
        return 'bg-slate-900/70 border border-slate-800 hover:border-slate-700 shadow-xl';
      case 'emerald':
      default:
        return 'glass-panel hover:border-emerald-400/50 hover:shadow-[0_16px_35px_-8px_rgba(0,245,160,0.2)]';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl md:rounded-3xl p-5 md:p-6 transition-all duration-300 ${
        interactive ? 'cursor-pointer glass-interactive' : ''
      } ${getVariantStyles()} ${className}`}
    >
      {cornerBrackets && (
        <>
          <div className="corner-bracket-tl" />
          <div className="corner-bracket-tr" />
          <div className="corner-bracket-bl" />
          <div className="corner-bracket-br" />
        </>
      )}
      {children}
    </div>
  );
};
