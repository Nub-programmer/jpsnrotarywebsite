import React, { useState } from 'react';

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
  const [imgError, setImgError] = useState(false);

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
        {!imgError ? (
          <img
            src="/assets/interactlogo.png"
            alt="Interact Club Logo"
            className={`${currentSizeClass} object-contain rounded-md`}
            onError={() => setImgError(true)}
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            className={`${currentSizeClass} drop-shadow-sm`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Blue Shield/Circle */}
            <circle cx="50" cy="50" r="48" fill="#00246B" stroke="#F59E0B" strokeWidth="2.5" />
            
            {/* Outer Gear Teeth (24 cogs for Rotary Wheel) */}
            <g fill="#F59E0B">
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 360) / 24;
                return (
                  <rect
                    key={i}
                    x="48"
                    y="8"
                    width="4"
                    height="6"
                    rx="1"
                    transform={`rotate(${angle} 50 50)`}
                  />
                );
              })}
            </g>

            {/* Rotary Gear Rim */}
            <circle cx="50" cy="50" r="38" fill="#F59E0B" />
            <circle cx="50" cy="50" r="32" fill="#00246B" />

            {/* Inner Ring */}
            <circle cx="50" cy="50" r="18" fill="#F59E0B" />

            {/* Center Hole & Keyway */}
            <circle cx="50" cy="50" r="10" fill="#00246B" />
            <rect x="48" y="38" width="4" height="6" fill="#00246B" />

            {/* 6 Spokes */}
            <g stroke="#00246B" strokeWidth="3.5" strokeLinecap="round">
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = i * 60;
                const rad = (angle * Math.PI) / 180;
                const x2 = 50 + 26 * Math.cos(rad);
                const y2 = 50 + 26 * Math.sin(rad);
                return <line key={i} x1="50" y1="50" x2={x2} y2={y2} />;
              })}
            </g>

            {/* Interact Text Badge */}
            <path
              d="M 22 50 A 28 28 0 0 1 78 50"
              id="interactTextPath"
              fill="none"
            />
            <text fill="#FFFFFF" fontSize="7.5" fontWeight="900" letterSpacing="1.2">
              <textPath href="#interactTextPath" startOffset="50%" textAnchor="middle">
                INTERACT
              </textPath>
            </text>
          </svg>
        )}
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
