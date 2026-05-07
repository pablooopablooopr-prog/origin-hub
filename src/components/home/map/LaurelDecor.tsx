/**
 * Decoración botánica/laurel SVG inline.
 * Reusable como esquina, separador y bordes editoriales.
 *
 * No usa imágenes externas — todo SVG paths para mantener calidad
 * a cualquier tamaño y no depender de assets.
 */

import React from 'react';

interface LaurelProps {
  size?: number;
  color?: string;
  variant?: 'corner' | 'divider' | 'sprig';
  flip?: boolean;
  className?: string;
}

export const LaurelDecor: React.FC<LaurelProps> = ({
  size = 80,
  color = '#5C6B2E',
  variant = 'corner',
  flip = false,
  className = '',
}) => {
  const transform = flip ? 'scale(-1, 1) translate(-100, 0)' : '';

  if (variant === 'divider') {
    return (
      <svg
        viewBox="0 0 200 24"
        width={size * 2.5}
        height={size * 0.3}
        className={className}
        style={{ display: 'block' }}
        aria-hidden="true"
      >
        <g stroke={color} strokeWidth="1" fill="none" opacity="0.6">
          {/* Línea central */}
          <line x1="60" y1="12" x2="140" y2="12" />
          {/* Hojas izquierda */}
          <ellipse cx="55" cy="12" rx="6" ry="2.5" fill={color} opacity="0.7" />
          <ellipse cx="48" cy="9" rx="4" ry="1.8" fill={color} opacity="0.5" />
          <ellipse cx="48" cy="15" rx="4" ry="1.8" fill={color} opacity="0.5" />
          {/* Hojas derecha */}
          <ellipse cx="145" cy="12" rx="6" ry="2.5" fill={color} opacity="0.7" />
          <ellipse cx="152" cy="9" rx="4" ry="1.8" fill={color} opacity="0.5" />
          <ellipse cx="152" cy="15" rx="4" ry="1.8" fill={color} opacity="0.5" />
          {/* Diamante central */}
          <path
            d="M100 6 L105 12 L100 18 L95 12 Z"
            fill={color}
            opacity="0.8"
            stroke="none"
          />
        </g>
      </svg>
    );
  }

  if (variant === 'sprig') {
    return (
      <svg
        viewBox="0 0 60 100"
        width={size * 0.6}
        height={size}
        className={className}
        style={{ display: 'block' }}
        aria-hidden="true"
      >
        <g
          stroke={color}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
          opacity="0.55"
          transform={transform}
        >
          {/* Tallo principal */}
          <path d="M30 95 Q28 60 30 30 Q32 12 34 5" />
          {/* Hojas alternas */}
          <ellipse
            cx="22"
            cy="78"
            rx="9"
            ry="3"
            transform="rotate(-35 22 78)"
            fill={color}
            opacity="0.5"
            stroke="none"
          />
          <ellipse
            cx="38"
            cy="65"
            rx="9"
            ry="3"
            transform="rotate(35 38 65)"
            fill={color}
            opacity="0.5"
            stroke="none"
          />
          <ellipse
            cx="22"
            cy="50"
            rx="8"
            ry="2.8"
            transform="rotate(-35 22 50)"
            fill={color}
            opacity="0.5"
            stroke="none"
          />
          <ellipse
            cx="38"
            cy="38"
            rx="7"
            ry="2.5"
            transform="rotate(35 38 38)"
            fill={color}
            opacity="0.5"
            stroke="none"
          />
          <ellipse
            cx="24"
            cy="22"
            rx="6"
            ry="2.2"
            transform="rotate(-35 24 22)"
            fill={color}
            opacity="0.5"
            stroke="none"
          />
        </g>
      </svg>
    );
  }

  // corner (default)
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={{ display: 'block' }}
      aria-hidden="true"
    >
      <g
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        opacity="0.45"
        transform={transform}
      >
        {/* Rama curva */}
        <path d="M5 50 Q20 25 50 15 Q75 8 95 5" />
        {/* Hojas a lo largo de la rama */}
        <ellipse
          cx="22"
          cy="34"
          rx="7"
          ry="2.5"
          transform="rotate(-50 22 34)"
          fill={color}
          opacity="0.5"
          stroke="none"
        />
        <ellipse
          cx="38"
          cy="22"
          rx="8"
          ry="2.8"
          transform="rotate(-30 38 22)"
          fill={color}
          opacity="0.5"
          stroke="none"
        />
        <ellipse
          cx="58"
          cy="14"
          rx="7"
          ry="2.5"
          transform="rotate(-15 58 14)"
          fill={color}
          opacity="0.5"
          stroke="none"
        />
        <ellipse
          cx="78"
          cy="9"
          rx="6"
          ry="2.2"
          transform="rotate(-5 78 9)"
          fill={color}
          opacity="0.5"
          stroke="none"
        />
        {/* Pequeñas bayas decorativas */}
        <circle cx="30" cy="40" r="1.5" fill={color} opacity="0.6" stroke="none" />
        <circle cx="48" cy="28" r="1.3" fill={color} opacity="0.6" stroke="none" />
        <circle cx="68" cy="18" r="1.2" fill={color} opacity="0.6" stroke="none" />
      </g>
    </svg>
  );
};
