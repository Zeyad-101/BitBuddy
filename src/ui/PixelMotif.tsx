import type { PetType } from '../features/pet/types';

interface PixelMotifProps {
  type: PetType | 'sparkle';
  size?: number;
  className?: string;
}

/**
 * Authentic vector pixel-art icons and particles rendered with integer grid
 * coordinates and crisp-edges rendering (no blurred/anti-aliased edges).
 */
export function PixelMotif({ type, size = 24, className }: PixelMotifProps) {
  if (type === 'cat') {
    // Cozy Yarn Ball (12x12 grid)
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        className={className}
        aria-hidden="true"
      >
        {/* Shadow base */}
        <rect x="3" y="1" width="6" height="10" fill="#c9568d" />
        <rect x="1" y="3" width="10" height="6" fill="#c9568d" />
        <rect x="2" y="2" width="8" height="8" fill="#c9568d" />
        {/* Main yarn body (pink) */}
        <rect x="3" y="1" width="5" height="9" fill="#ff7eb6" />
        <rect x="2" y="2" width="7" height="7" fill="#ff7eb6" />
        <rect x="1" y="3" width="9" height="5" fill="#ff7eb6" />
        {/* Woven yarn thread highlights */}
        <rect x="4" y="2" width="2" height="1" fill="#fff7e0" />
        <rect x="3" y="4" width="2" height="1" fill="#fff7e0" />
        <rect x="6" y="5" width="2" height="1" fill="#fff7e0" />
        <rect x="4" y="7" width="3" height="1" fill="#fff7e0" />
        <rect x="7" y="3" width="1" height="2" fill="#fff7e0" />
        {/* Trailing loose thread */}
        <rect x="9" y="8" width="1" height="2" fill="#ff7eb6" />
        <rect x="10" y="10" width="2" height="1" fill="#ff7eb6" />
      </svg>
    );
  }

  if (type === 'dog') {
    // Classic Dog Bone (14x8 grid)
    return (
      <svg
        width={size}
        height={Math.round((size * 8) / 14)}
        viewBox="0 0 14 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        className={className}
        aria-hidden="true"
      >
        {/* Shadow underside */}
        <rect x="1" y="6" width="2" height="1" fill="#c9a87a" />
        <rect x="11" y="6" width="2" height="1" fill="#c9a87a" />
        <rect x="3" y="5" width="8" height="1" fill="#c9a87a" />
        {/* Main bone body (cream) */}
        <rect x="0" y="1" width="2" height="2" fill="#f4e8c1" />
        <rect x="0" y="5" width="2" height="2" fill="#f4e8c1" />
        <rect x="1" y="2" width="2" height="4" fill="#f4e8c1" />
        <rect x="3" y="2" width="8" height="3" fill="#f4e8c1" />
        <rect x="11" y="2" width="2" height="4" fill="#f4e8c1" />
        <rect x="12" y="1" width="2" height="2" fill="#f4e8c1" />
        <rect x="12" y="5" width="2" height="2" fill="#f4e8c1" />
        {/* Top highlight */}
        <rect x="4" y="2" width="6" height="1" fill="#ffffff" />
      </svg>
    );
  }

  if (type === 'hamster') {
    // Striped Sunflower Seed (10x12 grid)
    return (
      <svg
        width={size}
        height={Math.round((size * 12) / 10)}
        viewBox="0 0 10 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        className={className}
        aria-hidden="true"
      >
        {/* Dark roasted shell outline */}
        <rect x="4" y="0" width="2" height="2" fill="#3a2418" />
        <rect x="3" y="2" width="4" height="2" fill="#3a2418" />
        <rect x="2" y="4" width="6" height="5" fill="#3a2418" />
        <rect x="3" y="9" width="4" height="2" fill="#3a2418" />
        <rect x="4" y="11" width="2" height="1" fill="#3a2418" />
        {/* Inner shell color */}
        <rect x="3" y="3" width="4" height="6" fill="#6b4632" />
        {/* Crisp white/cream center stripes */}
        <rect x="4" y="2" width="1" height="8" fill="#f4e8c1" />
        <rect x="6" y="3" width="1" height="6" fill="#f4e8c1" />
      </svg>
    );
  }

  if (type === 'bird') {
    // Cheerful Blue Feather (10x12 grid)
    return (
      <svg
        width={size}
        height={Math.round((size * 12) / 10)}
        viewBox="0 0 10 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        className={className}
        aria-hidden="true"
      >
        {/* Deep blue shadow */}
        <rect x="5" y="1" width="3" height="2" fill="#3894c7" />
        <rect x="4" y="3" width="4" height="2" fill="#3894c7" />
        <rect x="3" y="5" width="4" height="2" fill="#3894c7" />
        <rect x="2" y="7" width="4" height="2" fill="#3894c7" />
        {/* Cyan plumage */}
        <rect x="6" y="0" width="2" height="2" fill="#6ad1ff" />
        <rect x="4" y="2" width="3" height="3" fill="#6ad1ff" />
        <rect x="2" y="5" width="4" height="3" fill="#6ad1ff" />
        <rect x="1" y="8" width="3" height="2" fill="#6ad1ff" />
        {/* Quill shaft spine (white/cream) */}
        <rect x="6" y="1" width="1" height="2" fill="#fff7e0" />
        <rect x="5" y="3" width="1" height="2" fill="#fff7e0" />
        <rect x="4" y="5" width="1" height="2" fill="#fff7e0" />
        <rect x="3" y="7" width="1" height="2" fill="#fff7e0" />
        <rect x="2" y="9" width="1" height="2" fill="#fff7e0" />
        <rect x="1" y="11" width="1" height="1" fill="#fff7e0" />
      </svg>
    );
  }

  // Pure Pixel Sparkle Star (7x7 grid)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 7 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="0" width="1" height="7" fill="#ffd86b" />
      <rect x="0" y="3" width="7" height="1" fill="#ffd86b" />
      <rect x="2" y="2" width="3" height="3" fill="#ffffff" />
      <rect x="3" y="1" width="1" height="5" fill="#ffffff" />
      <rect x="1" y="3" width="5" height="1" fill="#ffffff" />
    </svg>
  );
}
