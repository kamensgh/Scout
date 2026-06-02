import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Scout — Search once. Pay less.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px',
          justifyContent: 'space-between',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              background: '#ffffff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="#0a0a0a" strokeWidth="2.5" />
              <path d="m21 21-4.35-4.35" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ color: '#ffffff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>
            Scout
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              color: '#ffffff',
              fontSize: '80px',
              fontWeight: '800',
              lineHeight: '0.95',
              letterSpacing: '-3px',
            }}
          >
            Search once.
            <br />
            Pay less.
          </div>
          <div style={{ color: '#666666', fontSize: '26px', maxWidth: '680px', lineHeight: '1.4' }}>
            Live prices from retailers near you — compare, save and buy with one click.
          </div>
        </div>

        {/* Stats + badge */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '56px' }}>
            {[
              { value: '50+', label: 'Retailers' },
              { value: '3.2M', label: 'Live prices' },
              { value: '18%', label: 'Avg saving' },
            ].map(({ value, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ color: '#ffffff', fontSize: '40px', fontWeight: '700', letterSpacing: '-1px' }}>
                  {value}
                </span>
                <span style={{ color: '#444444', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '100px',
              padding: '10px 22px',
              color: '#888888',
              fontSize: '16px',
            }}
          >
            scout-six-taupe.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
