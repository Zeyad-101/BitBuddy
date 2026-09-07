import { useEffect, useState } from 'react';
import { isMuted, toggleMuted } from '../audio/sfx';
import styles from './MuteToggle.module.css';

/** Small mute toggle button. Mute state is persisted in localStorage. */
export function MuteToggle() {
  const [muted, setMutedState] = useState<boolean>(() => isMuted());
  useEffect(() => {
    setMutedState(isMuted());
  }, []);
  return (
    <button
      type="button"
      className={styles.btn}
      onClick={() => {
        const next = toggleMuted();
        setMutedState(next);
      }}
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      title={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
