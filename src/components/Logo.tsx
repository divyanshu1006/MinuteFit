import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10'
  const titleSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
  const subSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[11px]'

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Emblem SVG Icon */}
      <div className={`relative ${iconSize} shrink-0`}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="logoMintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2DD4A3" />
              <stop offset="100%" stopColor="#1B9371" />
            </linearGradient>
            <linearGradient id="logoRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Rounded Base */}
          <rect width="64" height="64" rx="18" fill="url(#logoMintGrad)" />

          {/* Stopwatch Ring Accent */}
          <circle cx="32" cy="32" r="23" stroke="url(#logoRingGrad)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="100 45" />

          {/* Dial Node */}
          <circle cx="32" cy="9" r="2.5" fill="#FFFFFF" />

          {/* '2' Stroke */}
          <path
            d="M 21 24 C 21 20.5 24 18.5 28 18.5 C 32 18.5 34 20.8 33.5 24.5 C 33 28 28.5 32 22 38.5 L 34.5 38.5"
            stroke="#FFFFFF"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* '0' Monogram */}
          <ellipse cx="43.5" cy="30" rx="6" ry="9" stroke="#FFFFFF" strokeWidth="3.6" strokeLinecap="round" />
          <circle cx="43.5" cy="30" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-widest uppercase text-[#27B68C] ${subSize}`}>MinuteFit</span>
            <span className="w-1 h-1 rounded-full bg-[#27B68C]" />
            <span className={`font-bold text-[#68857B] dark:text-[#8EA89E] tracking-wider uppercase ${subSize}`}>20 Min</span>
          </div>
          <span className={`font-black text-[#143329] dark:text-white tracking-tight ${titleSize}`}>
            Workout Companion
          </span>
        </div>
      )}
    </div>
  )
}
