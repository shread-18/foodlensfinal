import React from 'react';

interface ScannerFrameProps {
  children?: React.ReactNode;
  isScanning?: boolean;
  aspectRatio?: 'video' | 'square' | 'portrait';
  overlayContent?: React.ReactNode;
  hudText?: string;
  className?: string;
}

export const ScannerFrame: React.FC<ScannerFrameProps> = ({
  children,
  isScanning = false,
  aspectRatio = 'video',
  overlayContent,
  hudText = 'AI SCANNING SENSOR ACTIVE',
  className = '',
}) => {
  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'portrait': return 'aspect-[3/4]';
      case 'video':
      default: return 'aspect-video';
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-slate-950/80 shadow-[0_0_30px_rgba(0,245,160,0.12)] ${getAspectClass()} ${className}`}>
      {/* Corner targeting brackets */}
      <div className="corner-bracket-tl w-5 h-5 !border-t-2 !border-l-2 !border-emerald-400" />
      <div className="corner-bracket-tr w-5 h-5 !border-t-2 !border-r-2 !border-emerald-400" />
      <div className="corner-bracket-bl w-5 h-5 !border-b-2 !border-l-2 !border-emerald-400" />
      <div className="corner-bracket-br w-5 h-5 !border-b-2 !border-r-2 !border-emerald-400" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,245,160,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,245,160,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Animated Laser Sweep Beam */}
      {isScanning && (
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#00F5A0] animate-scan-line z-20 pointer-events-none" />
      )}

      {/* Crosshairs in center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-36 h-36 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-emerald-400/80 animate-ping" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
          {/* Axis markers */}
          <div className="absolute -top-2 w-3 h-0.5 bg-emerald-400/60" />
          <div className="absolute -bottom-2 w-3 h-0.5 bg-emerald-400/60" />
          <div className="absolute -left-2 w-0.5 h-3 bg-emerald-400/60" />
          <div className="absolute -right-2 w-0.5 h-3 bg-emerald-400/60" />
        </div>
      </div>

      {/* Top HUD bar */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-20 text-[10px] font-tech text-emerald-400/80 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-wider uppercase">{hudText}</span>
        </div>
        <div className="text-slate-500 font-mono tracking-widest">
          SYS.60FPS
        </div>
      </div>

      {/* Main Content (Camera feed, upload preview, etc.) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        {children}
      </div>

      {/* Custom Overlay Content (floating tags, banners, etc.) */}
      {overlayContent && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          {overlayContent}
        </div>
      )}
    </div>
  );
};
