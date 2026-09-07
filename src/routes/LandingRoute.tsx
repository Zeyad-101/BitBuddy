import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../features/pet/state/usePet';
import { playSfx } from '../audio/sfx';
import styles from './LandingRoute.module.css';

export function LandingRoute() {
  const navigate = useNavigate();
  const { pet, isHydrated } = usePet();

  // Returning players bypass the title and onboarding sequence directly to their Buddy.
  useEffect(() => {
    if (isHydrated && pet) {
      navigate('/room', { replace: true });
    }
  }, [isHydrated, pet, navigate]);

  const handleStart = () => {
    playSfx('click');
    navigate('/select');
  };

  return (
    <main className={styles.landing}>
      <div className={styles['stars-bg']} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles['header-group']}>
          <span className={styles.badge}>Retro Virtual Pet</span>
          <div className={styles['logo-wrapper']}>
            <img
              src="/logo.png"
              alt="BitBuddy — your little digital friend"
              className={styles['title-logo']}
              width={320}
              height={320}
            />
            <h1 className={styles['sr-only']}>BitBuddy</h1>
          </div>
        </div>

        <div className={styles['cta-group']}>
          <button
            type="button"
            className={styles['cta-button']}
            onClick={handleStart}
            aria-label="Start game and choose your Buddy"
            autoFocus
          >
            <span>Start</span>
            <span className={styles['cta-arrow']} aria-hidden="true">▶</span>
          </button>
        </div>
      </div>

      <footer className={styles.footer}>
        <span>Local Only · No Accounts · In-Browser</span>
      </footer>
    </main>
  );
}
