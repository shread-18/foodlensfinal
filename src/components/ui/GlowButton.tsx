import React from 'react';
import { sounds } from '../../utils/notifications';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cyan' | 'kids' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  playSound?: boolean;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  playSound = true,
  onClick,
  className = '',
  disabled,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (playSound && !disabled) {
      sounds.playScanClick();
    }
    if (onClick) {
      onClick(e);
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs rounded-xl gap-1.5';
      case 'lg':
        return 'px-6 py-3.5 text-sm md:text-base rounded-2xl gap-2.5 font-bold tracking-wide';
      case 'md':
      default:
        return 'px-4 py-2.5 text-xs md:text-sm rounded-xl gap-2 font-bold';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-slate-900/80 border border-slate-700/80 hover:border-slate-500 text-slate-200 hover:text-white hover:bg-slate-800/80 backdrop-blur-md shadow-sm';
      case 'cyan':
        return 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold shadow-[0_0_20px_rgba(0,217,255,0.35)] hover:shadow-[0_0_28px_rgba(0,217,255,0.55)] hover:scale-[1.02] active:scale-[0.98] border border-cyan-300/40';
      case 'kids':
        return 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-slate-950 font-fun font-black shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:scale-[1.03] active:scale-[0.98] border border-amber-300';
      case 'danger':
        return 'bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold shadow-[0_0_15px_rgba(255,77,109,0.35)] hover:shadow-[0_0_25px_rgba(255,77,109,0.55)] hover:scale-[1.02] active:scale-[0.98] border border-rose-400/30';
      case 'ghost':
        return 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50';
      case 'primary':
      default:
        return 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 text-slate-950 font-extrabold shadow-[0_0_20px_rgba(0,245,160,0.4)] hover:shadow-[0_0_30px_rgba(0,245,160,0.6)] hover:scale-[1.02] active:scale-[0.98] border border-emerald-300/50';
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${getSizeStyles()} ${getVariantStyles()} ${className}`}
      {...rest}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
