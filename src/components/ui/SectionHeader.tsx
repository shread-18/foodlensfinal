import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  action,
  align = 'center',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col ${
        align === 'center' ? 'items-center text-center' : 'items-start text-left'
      } ${className}`}
    >
      {badge && (
        <span className="text-[10px] font-tech font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full mb-2">
          {badge}
        </span>
      )}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight font-display">
          {title}
        </h2>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {subtitle && (
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-1 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
