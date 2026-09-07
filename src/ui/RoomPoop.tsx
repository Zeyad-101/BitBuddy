import { memo } from 'react';
import styles from './RoomPoop.module.css';

interface RoomPoopProps {
  x: number; // percentage from left (e.g. 60)
  y: number; // percentage from top (e.g. 72)
  onClick?: () => void;
  isCleaning?: boolean;
}

export const RoomPoop = memo(function RoomPoop({ x, y, onClick, isCleaning }: RoomPoopProps) {
  return (
    <div
      className={`${styles['poop-wrapper']} ${isCleaning ? styles['poop-cleaning'] : ''}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Room mess. Click to clean up!"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* 2 buzzing pixel flies */}
      <div className={`${styles.fly} ${styles['fly-1']}`} aria-hidden="true" />
      <div className={`${styles.fly} ${styles['fly-2']}`} aria-hidden="true" />

      {/* Pixel Poop SVG */}
      <svg
        viewBox="0 0 12 10"
        className={styles['poop-svg']}
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        {/* Swirl top */}
        <rect x="5" y="0" width="2" height="2" fill="#8B4513" />
        <rect x="7" y="1" width="1" height="1" fill="#A0522D" />

        {/* Middle swirl */}
        <rect x="4" y="2" width="4" height="2" fill="#8B4513" />
        <rect x="3" y="4" width="6" height="2" fill="#8B4513" />
        <rect x="4" y="3" width="2" height="1" fill="#A0522D" />
        <rect x="4" y="4" width="2" height="1" fill="#CD853F" />

        {/* Cute shiny reflection */}
        <rect x="3" y="5" width="1" height="1" fill="#FFE4B5" />

        {/* Bottom base */}
        <rect x="2" y="6" width="8" height="3" fill="#8B4513" />
        <rect x="3" y="7" width="3" height="1" fill="#CD853F" />
        <rect x="1" y="8" width="10" height="2" fill="#5C2E0B" />
        <rect x="2" y="9" width="8" height="1" fill="#3D1E07" />
      </svg>
      <span className={styles['clean-hint']} aria-hidden="true">
        Click to clean!
      </span>
    </div>
  );
});
