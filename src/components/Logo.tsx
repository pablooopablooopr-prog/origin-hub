import React from 'react';

export interface LogoProps {
  size?: 24 | 20 | 18;
  showText?: boolean;
}

/**
 * RITMORIGEN Logo Component
 *
 * Renders "RITMORIGEN" text with integrated enso ○ symbol
 * positioned and centered within the letter O.
 *
 * The enso is a circular symbol that represents the seasonal cycle.
 */
export const Logo: React.FC<LogoProps> = ({ size = 24, showText = true }) => {
  // Calculate dimensions based on size
  const fontSize = size;
  const ensoSize = size * 0.85; // Enso slightly smaller than letter size
  const containerWidth = size * 2.8; // Space for "RITMORIGEN" text

  return (
    <div
      className="inline-flex items-center"
      style={{
        position: 'relative',
        height: `${fontSize}px`,
        width: showText ? `${containerWidth}px` : `${ensoSize}px`,
      }}
    >
      {showText ? (
        <span
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: 'bold',
            color: '#3D2B1F',
            letterSpacing: '-0.5px',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            whiteSpace: 'nowrap',
          }}
        >
          {/* R I T M O — letter by letter */}
          <span>RITM</span>

          {/* O with centered enso inside */}
          <span
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: `${fontSize}px`,
              height: `${fontSize}px`,
              marginLeft: '2px',
            }}
          >
            {/* The O letter itself (invisible, just for spacing) */}
            <span style={{ position: 'absolute', visibility: 'hidden' }}>O</span>

            {/* Enso centered inside O */}
            <img
              src="/lovable-uploads/enso-transparent.png"
              alt="Ensō"
              style={{
                position: 'absolute',
                width: `${ensoSize}px`,
                height: `${ensoSize}px`,
                objectFit: 'contain',
                opacity: 0.9,
                filter: 'drop-shadow(0 2px 4px rgba(184, 134, 11, 0.3))',
              }}
            />
          </span>

          {/* I G E N — remaining letters */}
          <span style={{ marginLeft: '2px' }}>IGEN</span>
        </span>
      ) : (
        /* Logo without text — just the enso */
        <img
          src="/lovable-uploads/enso-transparent.png"
          alt="Ensō"
          style={{
            width: `${ensoSize}px`,
            height: `${ensoSize}px`,
            objectFit: 'contain',
            opacity: 0.9,
            filter: 'drop-shadow(0 2px 4px rgba(184, 134, 11, 0.3))',
          }}
        />
      )}

      {/* Hover effect — subtle glow */}
      <style>{`
        .logo:hover img {
          filter: drop-shadow(0 0 8px rgba(184, 134, 11, 0.5)) !important;
        }
      `}</style>
    </div>
  );
};
