import React from 'react';
import logoUrl from '../../../assets/interactlogo.png';

interface InteractLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const InteractLogo: React.FC<InteractLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`relative flex-shrink-0 ${currentSizeClass} flex items-center justify-center`}>
        <img
          src={logoUrl}
          alt="Interact Club Logo"
          className={`${currentSizeClass} object-contain rounded-md`}
        />
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="font-bold text-slate-900 text-base md:text-lg tracking-tight">
            Interact Club
          </div>
          <div className="text-[10px] font-semibold text-blue-900 uppercase tracking-wider">
            JPS Noida
          </div>
        </div>
      )}
    </div>
  );
};
