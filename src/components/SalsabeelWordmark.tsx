import React from 'react';

interface SalsabeelWordmarkProps {
  className?: string;
  variant?: 'red-white' | 'red-gold' | 'gold';
  idPrefix?: string;
}

/**
 * Custom calligraphic SVG wordmark for "سلسبيل" matching the user's signature script:
 * tall vertical "ل" ascenders and the final "ل" looping smoothly underneath the entire word.
 */
export const SalsabeelWordmark: React.FC<SalsabeelWordmarkProps> = ({
  className = 'h-10 w-auto',
  variant = 'red-gold',
  idPrefix = 'salsabeel'
}) => {
  const gradId = `${idPrefix}-grad-${variant}`;
  const shadowId = `${idPrefix}-shadow-${variant}`;

  const gradColors =
    variant === 'gold'
      ? { top: '#fef08a', mid: '#facc15', bot: '#ca8a04', outline: '#1e1b4b' }
      : variant === 'red-white'
      ? { top: '#ff3b3b', mid: '#d81313', bot: '#8c0707', outline: '#ffffff' }
      : { top: '#ff4242', mid: '#dc1414', bot: '#990808', outline: '#fde68a' };

  return (
    <svg
      viewBox="0 0 300 116"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="سلسبيل"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="116" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={gradColors.top} />
          <stop offset="50%" stopColor={gradColors.mid} />
          <stop offset="100%" stopColor={gradColors.bot} />
        </linearGradient>
        <filter id={shadowId} x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="1.8" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Outer crisp outline for contrast */}
      <g
        stroke={gradColors.outline}
        strokeWidth="13.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${shadowId})`}
      >
        <path d="M 272 44 L 272 56 Q 272 65 264 65 Q 256 65 256 56 L 256 45 L 256 56 Q 256 65 248 65 Q 240 65 240 56 L 240 45 L 240 56 Q 240 65 230 65 L 214 65 L 214 14 L 214 65 L 202 65 Q 196 65 196 56 L 196 45 L 196 56 Q 196 65 188 65 Q 180 65 180 56 L 180 45 L 180 56 Q 180 65 172 65 Q 164 65 164 56 L 164 45 L 164 56 Q 164 65 154 65 L 143 65 L 143 46 L 143 65 L 123 65 L 123 46 L 123 65 L 103 65 L 103 14 L 103 60 C 103 75, 68 88, 40 85 C 16 82, 16 56, 42 55 C 70 54, 96 76, 132 88 C 185 103, 240 97, 272 76" />
        <circle cx="143" cy="77" r="2.2" fill={gradColors.outline} />
        <circle cx="117" cy="75" r="2.1" fill={gradColors.outline} />
        <circle cx="127" cy="76" r="2.1" fill={gradColors.outline} />
      </g>

      {/* Main glossy crimson calligraphy stroke */}
      <g
        stroke={`url(#${gradId})`}
        strokeWidth="8.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* سـلـسـبـيـل + final ل with sweeping crossing loop underneath */}
        <path d="M 272 44 L 272 56 Q 272 65 264 65 Q 256 65 256 56 L 256 45 L 256 56 Q 256 65 248 65 Q 240 65 240 56 L 240 45 L 240 56 Q 240 65 230 65 L 214 65 L 214 14 L 214 65 L 202 65 Q 196 65 196 56 L 196 45 L 196 56 Q 196 65 188 65 Q 180 65 180 56 L 180 45 L 180 56 Q 180 65 172 65 Q 164 65 164 56 L 164 45 L 164 56 Q 164 65 154 65 L 143 65 L 143 46 L 143 65 L 123 65 L 123 46 L 123 65 L 103 65 L 103 14 L 103 60 C 103 75, 68 88, 40 85 C 16 82, 16 56, 42 55 C 70 54, 96 76, 132 88 C 185 103, 240 97, 272 76" />
        {/* ب dot */}
        <circle cx="143" cy="77" r="2.2" fill={`url(#${gradId})`} stroke="none" />
        {/* ي double dots */}
        <circle cx="117" cy="75" r="2.1" fill={`url(#${gradId})`} stroke="none" />
        <circle cx="127" cy="76" r="2.1" fill={`url(#${gradId})`} stroke="none" />
      </g>

      {/* Subtle glossy bevel highlight */}
      <g
        stroke="rgba(255,255,255,0.32)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 272 44 L 272 54 M 214 15 L 214 58 M 103 15 L 103 56 C 102 70, 72 84, 42 82" />
      </g>
    </svg>
  );
};
