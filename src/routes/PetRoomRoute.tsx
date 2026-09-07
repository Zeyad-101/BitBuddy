import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../features/pet/state/usePet';
import { usePetBehavior } from '../features/pet/state/usePetBehavior';
import { useTimeOfDay } from '../features/pet/state/useTimeOfDay';
import type { ActionOverlay, PetAction, PetType, WanderAnchorId } from '../features/pet/types';
import { ACTION_OVERLAY_MS } from '../features/pet/constants';
import { ActionButton } from '../ui/ActionButton';
import { Hud } from '../ui/Hud';
import { ParticleBurst } from '../ui/ParticleBurst';
import { PixelPet } from '../ui/PixelPet';
import { RetroButton } from '../ui/RetroButton';
import { RoomScene } from '../ui/RoomScene';
import { MeetBuddySequence } from '../ui/MeetBuddySequence';
import { GuidanceBanner } from '../ui/GuidanceBanner';
import { SettingsModal } from '../ui/SettingsModal';
import { FloatingStatBadge, type FloatingStatItem } from '../ui/FloatingStatBadge';
import { RoomPoop } from '../ui/RoomPoop';
import { PetDiaryModal } from '../ui/PetDiaryModal';
import { PET_CELL_SIZE_DESKTOP, PET_CELL_SIZE_MOBILE } from '../features/pet/constants';
import { getActionReaction } from '../features/pet/simulation';
import { playSfx } from '../audio/sfx';
import styles from './PetRoomRoute.module.css';

interface PendingAction {
  overlay: ActionOverlay;
  target: WanderAnchorId;
  label: string;
  trigger: PetAction;
}

const ACTION_TARGETS: Record<PetAction, WanderAnchorId> = {
  feed: 'bowl',
  play: 'toy',
  clean: 'center',
  sleep: 'bed',
};

const SNACKS = [
  { name: 'Salmon Sashimi', icon: '🍣', review: 'CRUNCH CRUNCH! 10/10 would eat off floor again' },
  { name: 'Cheesy Pizza Slice', icon: '🍕', review: 'CHEESY PERFECTION. My soul has ascended!' },
  { name: 'Frosted Donut', icon: '🍩', review: 'SUGAR RUSH ARMED! ZOOMIES IN 3... 2... 1...' },
  { name: 'Crisp Watermelon', icon: '🍉', review: 'Brain freeze! So juicy! Slurp slurp!' },
  { name: 'Suspicious Broccoli', icon: '🥦', review: 'Green tree?! Wait... secretly delicious!' },
];

export function PetRoomRoute() {
  const { pet, mood, isHydrated, feed, play, clean, sleep, clear } = usePet();
  const phase = useTimeOfDay();
  const navigate = useNavigate();

  const [pending, setPending] = useState<PendingAction | null>(null);
  const [burstKey, setBurstKey] = useState(0);
  const [floatingBadge, setFloatingBadge] = useState<FloatingStatItem | null>(null);
  const [lastAction, setLastAction] = useState<PetAction | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showDiary, setShowDiary] = useState(false);
  const actionTimerRef = useRef<number | null>(null);

  // Interactive secret states
  const [pictureVariant, setPictureVariant] = useState(0);
  const [windowVisitor, setWindowVisitor] = useState<'ufo' | 'pigeon' | 'star' | null>(null);
  const [isClockRinging, setIsClockRinging] = useState(false);
  const [isPetDancing, setIsPetDancing] = useState(false);
  const [isPlantWiggling, setIsPlantWiggling] = useState(false);
  const [isBedFluffing, setIsBedFluffing] = useState(false);
  const [isBowlRinging, setIsBowlRinging] = useState(false);

  // Poop & clean mechanic
  const [poop, setPoop] = useState<{ x: number; y: number } | null>(() => {
    return Math.random() < 0.25 ? { x: 58, y: 76 } : null;
  });
  const [isCleaningPoop, setIsCleaningPoop] = useState(false);

  // Snack cycling
  const [snackIndex, setSnackIndex] = useState(0);

  // Toy juggle combo
  const [playCombo, setPlayCombo] = useState(0);
  const comboTimerRef = useRef<number | null>(null);

  // Meet Buddy intro sequence state
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bitbuddy:intro_pending') === 'true';
    } catch {
      return false;
    }
  });

  // First interaction guidance state
  const [guidanceStep, setGuidanceStep] = useState<'none' | 'feed' | 'fed'>('none');

  useEffect(() => {
    if (!pet) return;
    try {
      const guidanceDone = localStorage.getItem(`bitbuddy:guidance_done:${pet.id}`) === 'true';
      if (!guidanceDone && !showIntro) {
        setGuidanceStep('feed');
      }
    } catch {
      // Ignore localStorage issues
    }
  }, [pet, showIntro]);

  // Viewport scaling for pixel pet
  const [cellSize, setCellSize] = useState<number>(PET_CELL_SIZE_MOBILE);
  useEffect(() => {
    const update = () => {
      setCellSize(window.innerWidth >= 720 ? PET_CELL_SIZE_DESKTOP : PET_CELL_SIZE_MOBILE);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const behavior = usePetBehavior({
    mood: mood ?? 'happy',
    petType: pet?.type ?? 'cat',
    energy: pet?.energy ?? 80,
    actionTarget: pending
      ? { anchor: pending.target, overlayMs: ACTION_OVERLAY_MS }
      : null,
    phase,
  });

  // Cleanup pending action and combo timers on unmount
  useEffect(() => {
    return () => {
      if (actionTimerRef.current !== null) {
        window.clearTimeout(actionTimerRef.current);
      }
      if (comboTimerRef.current !== null) {
        window.clearTimeout(comboTimerRef.current);
      }
    };
  }, []);

  // Periodic random idle thoughts
  useEffect(() => {
    if (!pet || mood === 'sleeping' || pending !== null) return;
    const interval = window.setInterval(() => {
      if (Math.random() < 0.6 && !behavior.reactionText) {
        const thoughts: Record<PetType, string[]> = {
          cat: [
            '*contemplates the universe... decides to nap*',
            'what if the red dot is an illusion?',
            'i could push that off the table right now.',
            'purr... life is good when snacks exist.',
          ],
          dog: [
            'ball is life. ball is everything.',
            'did someone say W-A-L-K?!',
            '*sniffs air* ...i detect bacon.',
            'you are my favorite human ever!',
          ],
          hamster: [
            'the wheel leads nowhere, yet i must run.',
            'always maintain a 3-seed reserve.',
            '*stuffs another invisible peanut in cheek*',
            'tiny paws, giant dreams.',
          ],
          bird: [
            'today i shall compose a symphony of beeps.',
            'the floor is lava, the perch is supreme.',
            '*fluffs neck feathers dramatically*',
            'chirp chirp! pay attention to me!',
          ],
        };
        const pool = thoughts[pet.type];
        behavior.showReaction(pool[Math.floor(Math.random() * pool.length)]!, 2400);
      }
    }, 17000);
    return () => window.clearInterval(interval);
  }, [pet, mood, pending, behavior]);

  // Click-to-pet / Tickle interaction
  const handlePet = useCallback(() => {
    if (!pet || mood === 'sleeping') return;
    playSfx('purr');
    setBurstKey((k) => k + 1);

    const quotes: Record<PetType, string[]> = {
      cat: [
        'purrr... more chin scratches, peasant!',
        'i graciously tolerate your affection.',
        'purrrrrrrrr...',
        '*kneads paws rhythmically on floor*',
      ],
      dog: [
        'OMG HAND! I LOVE HAND SO MUCH!',
        'YES! right behind the ear! right there!',
        '*tail wagging at mach 3*',
        'YOU ARE THE BEST HUMAN EVER!',
      ],
      hamster: [
        '*squeak!* hehe that tickles!',
        'do NOT touch the secret cheek pouch!',
        '*twitching whiskers of pure joy*',
        'tiny belly rubs are the best rubs!',
      ],
      bird: [
        '*chirp chirp!* preen my royal feathers!',
        'scritches approved by flight command!',
        '*happy head tilt and beak nuzzle*',
        'screee! more tickles please!',
      ],
    };

    const pool = quotes[pet.type];
    const quote = pool[Math.floor(Math.random() * pool.length)]!;
    behavior.showReaction(quote, 2200);

    setFloatingBadge({
      id: Date.now() + Math.random(),
      text: '+5 HAPPY 💕',
      color: 'var(--color-stat-happiness)',
    });
  }, [pet, mood, behavior]);

  // Interactive Room Secrets
  const handleWindowClick = useCallback(() => {
    if (windowVisitor) return;
    const visitors: Array<'ufo' | 'pigeon' | 'star'> = ['ufo', 'pigeon', 'star'];
    const nextVisitor = visitors[Math.floor(Math.random() * visitors.length)]!;
    setWindowVisitor(nextVisitor);
    playSfx('ding');

    const visitorQuotes: Record<'ufo' | 'pigeon' | 'star', string> = {
      ufo: '*gasp* the mothership has returned for me!',
      pigeon: 'the window bird is judging my life choices.',
      star: 'i wished for 1,000,000 floor snacks!',
    };
    behavior.showReaction(visitorQuotes[nextVisitor], 2800);

    window.setTimeout(() => {
      setWindowVisitor(null);
    }, 3000);
  }, [windowVisitor, behavior]);

  const handleClockClick = useCallback(() => {
    if (isClockRinging) return;
    setIsClockRinging(true);
    setIsPetDancing(true);
    playSfx('dance');

    const danceLines = [
      '*untz untz untz* feel the rhythm!',
      'DISCO BUDDY ACTIVATED! 🪩',
      'LOOK AT MY DANCE MOVES!',
    ];
    behavior.showReaction(danceLines[Math.floor(Math.random() * danceLines.length)]!, 2500);

    window.setTimeout(() => {
      setIsClockRinging(false);
      setIsPetDancing(false);
    }, 2500);
  }, [isClockRinging, behavior]);

  const handlePlantClick = useCallback(() => {
    if (isPlantWiggling) return;
    setIsPlantWiggling(true);
    playSfx('click');

    const plantLines = [
      '*sniff sniff* ...tastes like fiber and regret.',
      'chlorophyll? more like bore-o-phyll.',
      'i have protected this sacred leaf with my life.',
    ];
    behavior.showReaction(plantLines[Math.floor(Math.random() * plantLines.length)]!, 2000);

    window.setTimeout(() => {
      setIsPlantWiggling(false);
    }, 1400);
  }, [isPlantWiggling, behavior]);

  const handleBedClick = useCallback(() => {
    if (isBedFluffing) return;
    setIsBedFluffing(true);
    playSfx('poof');

    const bedLines = [
      'the royal mattress has been fluffed!',
      'feather cloud softness: certified 100%.',
      'dibs on the warm spot forever.',
    ];
    behavior.showReaction(bedLines[Math.floor(Math.random() * bedLines.length)]!, 2000);

    window.setTimeout(() => {
      setIsBedFluffing(false);
    }, 1200);
  }, [isBedFluffing, behavior]);

  const handleBowlClick = useCallback(() => {
    if (isBowlRinging) return;
    setIsBowlRinging(true);
    playSfx('ding');

    const bowlLines = [
      'DINNER BELL?! WHERE IS THE FOOD?!',
      'MY BOWL! IT RINGS FOR THE FEAST!',
      'i hear the sacred metal clang of nutrition!',
    ];
    behavior.showReaction(bowlLines[Math.floor(Math.random() * bowlLines.length)]!, 2200);

    window.setTimeout(() => {
      setIsBowlRinging(false);
    }, 1200);
  }, [isBowlRinging, behavior]);

  const handlePictureClick = useCallback(() => {
    setPictureVariant((v) => {
      const next = (v + 1) % 3;
      playSfx('click');
      const picLines = [
        'ah, the great outdoors... where dirt lives.',
        'a timeless portrait of perfection: me.',
        'too cool for regular kibble. (⌐■_■)',
      ];
      behavior.showReaction(picLines[next]!, 2200);
      return next;
    });
  }, [behavior]);

  const handleToyClick = useCallback(() => {
    if (!pet || mood === 'sleeping') return;
    playSfx('bounce');
    setBurstKey((k) => k + 1);

    if (comboTimerRef.current !== null) {
      window.clearTimeout(comboTimerRef.current);
    }

    setPlayCombo((prev) => {
      const next = prev + 1;
      const comboText =
        next === 1 ? 'NICE TOSS! 🎾' :
        next === 2 ? 'CATCH! COMBO x2! ⭐' :
        next === 3 ? 'FETCH MASTER! COMBO x3! 🔥' :
        `UNSTOPPABLE! COMBO x${next}! 🚀`;

      behavior.showReaction(comboText, 1800);
      setFloatingBadge({
        id: Date.now() + Math.random(),
        text: `+${20 + next * 5} HAPPY`,
        color: 'var(--color-stat-happiness)',
      });
      return next;
    });

    comboTimerRef.current = window.setTimeout(() => {
      setPlayCombo(0);
      comboTimerRef.current = null;
    }, 3000);
  }, [pet, mood, behavior]);

  const handleCleanPoop = useCallback(() => {
    if (!poop || isCleaningPoop) return;
    setIsCleaningPoop(true);
    playSfx('sweep');
    clean();
    setBurstKey((k) => k + 1);
    setFloatingBadge({
      id: Date.now() + Math.random(),
      text: '+60 CLEAN ✨',
      color: 'var(--color-stat-cleanliness)',
    });

    const cleanLines = [
      'so fresh and so clean clean!',
      'phew! thank you, i was embarrassed.',
      'sparkling floors once more!',
    ];
    behavior.showReaction(cleanLines[Math.floor(Math.random() * cleanLines.length)]!, 2200);

    window.setTimeout(() => {
      setPoop(null);
      setIsCleaningPoop(false);
    }, 400);
  }, [poop, isCleaningPoop, clean, behavior]);

  const dispatch = useCallback(
    (trigger: PetAction) => {
      if (!pet) return;

      // 1. Play immediate audio
      playSfx(trigger);

      // 2. Clear any active timer so rapid spam clicks queue/interrupt cleanly
      if (actionTimerRef.current !== null) {
        window.clearTimeout(actionTimerRef.current);
        actionTimerRef.current = null;
      }

      // 3. Immediately apply simulation effect — instant stat update without lag!
      switch (trigger) {
        case 'feed': {
          feed();
          if (guidanceStep === 'feed') {
            setGuidanceStep('fed');
            try {
              localStorage.setItem(`bitbuddy:guidance_done:${pet.id}`, 'true');
            } catch {
              /* ignore */
            }
            window.setTimeout(() => setGuidanceStep('none'), 3500);
          }
          // Poop spawn chance after eating
          if (!poop && Math.random() < 0.6) {
            window.setTimeout(() => {
              setPoop({ x: 55 + Math.floor(Math.random() * 16), y: 72 + Math.floor(Math.random() * 6) });
              playSfx('poop');
              const innocentLines = [
                '*whistles innocently*',
                'it was already here, i swear!',
                'uh oh... nature called.',
              ];
              behavior.showReaction(innocentLines[Math.floor(Math.random() * innocentLines.length)]!, 2200);
            }, 2400);
          }
          break;
        }
        case 'play':
          play();
          break;
        case 'clean': {
          clean();
          if (poop) {
            setIsCleaningPoop(true);
            window.setTimeout(() => {
              setPoop(null);
              setIsCleaningPoop(false);
            }, 400);
          }
          break;
        }
        case 'sleep':
          sleep();
          break;
      }

      // 4. Immediately trigger floating stat badge & snack review
      const currentSnack = SNACKS[snackIndex % SNACKS.length]!;
      if (trigger === 'feed') {
        setSnackIndex((prev) => (prev + 1) % SNACKS.length);
      }

      const badgeMap: Record<PetAction, { text: string; color: string }> = {
        feed: { text: `+35 FOOD ${currentSnack.icon}`, color: 'var(--color-stat-hunger)' },
        play: { text: '+30 HAPPY', color: 'var(--color-stat-happiness)' },
        clean: { text: '+60 CLEAN', color: 'var(--color-stat-cleanliness)' },
        sleep: { text: '+50 ENERGY', color: 'var(--color-pixel-blue)' },
      };
      const badge = badgeMap[trigger];
      setFloatingBadge({
        id: Date.now() + Math.random(),
        text: badge.text,
        color: badge.color,
      });

      // 5. Trigger particle burst immediately
      setBurstKey((k) => k + 1);

      // 6. Show species reaction or snack review text immediately
      const reaction = trigger === 'feed' ? currentSnack.review : getActionReaction(trigger, pet.type);
      behavior.showReaction(reaction, 2200);

      // 7. Trigger action overlay & destination walk
      const target = ACTION_TARGETS[trigger];
      const overlay: ActionOverlay =
        trigger === 'feed' ? 'eating' :
        trigger === 'play' ? 'playing' :
        trigger === 'clean' ? 'cleaning' :
        trigger === 'sleep' ? 'sleeping-action' : 'none';

      setPending({ trigger, target, overlay, label: trigger });
      setLastAction(trigger);

      // Automatically reset visual overlay once interaction finishes
      actionTimerRef.current = window.setTimeout(() => {
        setPending(null);
        actionTimerRef.current = null;
      }, ACTION_OVERLAY_MS);
    },
    [pet, feed, play, clean, sleep, behavior, guidanceStep, poop, snackIndex],
  );

  const handleIntroComplete = () => {
    try {
      localStorage.removeItem('bitbuddy:intro_pending');
      if (pet) {
        localStorage.setItem(`bitbuddy:intro_seen:${pet.id}`, 'true');
        const guidanceDone = localStorage.getItem(`bitbuddy:guidance_done:${pet.id}`) === 'true';
        if (!guidanceDone) {
          setGuidanceStep('feed');
        }
      }
    } catch {
      /* ignore */
    }
    setShowIntro(false);
  };

  const handleReset = () => {
    clear();
    setShowSettings(false);
    navigate('/select');
  };

  // Loading state while checking localStorage hydration
  if (!isHydrated) {
    return (
      <div className={styles.empty}>
        <span className={styles.loading}>Loading BitBuddy...</span>
      </div>
    );
  }

  // Empty state if no pet found
  if (!pet || !mood) {
    return (
      <div className={styles.empty}>
        <h1>No Pet Yet</h1>
        <p>Get started by choosing your BitBuddy.</p>
        <RetroButton onClick={() => navigate('/select')}>Get Your Pet</RetroButton>
      </div>
    );
  }

  const overlay: ActionOverlay = pending?.overlay ?? 'none';

  return (
    <div className={styles.route}>
      {/* Meet Buddy First-Entry Intro */}
      {showIntro ? (
        <MeetBuddySequence pet={pet} onComplete={handleIntroComplete} />
      ) : null}

      {/* Settings Modal Dialog */}
      {showSettings ? (
        <SettingsModal
          pet={pet}
          onClose={() => setShowSettings(false)}
          onReset={handleReset}
        />
      ) : null}

      {/* Secret Diary Modal Dialog */}
      {showDiary ? (
        <PetDiaryModal
          pet={pet}
          onClose={() => setShowDiary(false)}
        />
      ) : null}

      {/* Game Header */}
      <header className={styles.header}>
        <div className={styles['brand-group']}>
          <img
            src="/logo.png"
            alt=""
            className={styles['header-logo']}
            width={26}
            height={26}
            aria-hidden="true"
          />
          <span className={styles.brand}>BitBuddy</span>
          <span className={styles.tagline}>your little digital friend</span>
        </div>
        <div className={styles['header-right']}>
          <button
            type="button"
            className={styles['diary-btn']}
            onClick={() => setShowDiary(true)}
            aria-label="Open pet diary"
          >
            <span aria-hidden="true">📖</span>
            <span>Diary</span>
          </button>
          <button
            type="button"
            className={styles['settings-btn']}
            onClick={() => setShowSettings(true)}
            aria-label="Open game settings and preferences"
          >
            <span aria-hidden="true">⚙</span>
            <span>Settings</span>
          </button>
        </div>
      </header>

      {/* Room and HUD */}
      <main className={styles.body}>
        <RoomScene
          petAnchor={behavior.anchor}
          petCellSize={cellSize}
          mood={mood}
          walkDurationMs={behavior.walkDurationMs}
          reactionText={behavior.reactionText}
          phase={phase}
          onClockClick={handleClockClick}
          onWindowClick={handleWindowClick}
          onPlantClick={handlePlantClick}
          onBedClick={handleBedClick}
          onBowlClick={handleBowlClick}
          onPictureClick={handlePictureClick}
          onToyClick={handleToyClick}
          pictureVariant={pictureVariant}
          windowVisitor={windowVisitor}
          isClockRinging={isClockRinging}
          isPlantWiggling={isPlantWiggling}
          isBedFluffing={isBedFluffing}
          isBowlRinging={isBowlRinging}
          poopNode={
            poop ? (
              <RoomPoop
                x={poop.x}
                y={poop.y}
                onClick={handleCleanPoop}
                isCleaning={isCleaningPoop}
              />
            ) : null
          }
        >
          <div style={{ position: 'relative' }}>
            <PixelPet
              type={pet.type}
              mood={mood}
              overlay={overlay}
              happiness={pet.happiness}
              cellSize={cellSize}
              onPet={handlePet}
              isDancing={isPetDancing}
            />
            <FloatingStatBadge badge={floatingBadge} />
            <ParticleBurst
              trigger={burstKey}
              variant={
                pending?.trigger === 'feed' ? 'crumbs' :
                pending?.trigger === 'play' ? 'hearts' :
                pending?.trigger === 'clean' ? 'bubbles' :
                pending?.trigger === 'sleep' ? 'zzz' :
                'sparkles'
              }
              color={
                pending?.trigger === 'feed' ? 'var(--color-stat-hunger)' :
                pending?.trigger === 'play' ? 'var(--color-stat-happiness)' :
                pending?.trigger === 'clean' ? 'var(--color-stat-cleanliness)' :
                pending?.trigger === 'sleep' ? 'var(--color-pixel-blue)' :
                'var(--color-pixel-yellow)'
              }
            />
          </div>
        </RoomScene>

        {/* Contextual Guidance Banner */}
        {guidanceStep === 'feed' ? (
          <GuidanceBanner message={`Try feeding ${pet.name}.`} />
        ) : guidanceStep === 'fed' ? (
          <GuidanceBanner message={`Nice! ${pet.name} liked that.`} isPositive />
        ) : null}

        <Hud pet={pet} mood={mood} lastAction={lastAction} phase={phase} />
      </main>

      {/* Interaction Action Bar */}
      <nav className={styles.actions} aria-label="Pet care actions">
        <div className={guidanceStep === 'feed' ? styles['pulse-target'] : undefined}>
          <ActionButton
            variant="feed"
            label="Feed"
            icon="F"
            onClick={() => dispatch('feed')}
            disabled={mood === 'sleeping'}
          />
        </div>
        <ActionButton
          variant="play"
          label={playCombo > 0 ? `Play (${playCombo}x)` : 'Play'}
          icon="P"
          onClick={() => dispatch('play')}
          disabled={mood === 'sleeping'}
        />
        <ActionButton
          variant="clean"
          label={poop ? 'Clean !' : 'Clean'}
          icon="C"
          onClick={() => dispatch('clean')}
          disabled={mood === 'sleeping'}
        />
        <ActionButton
          variant="sleep"
          label={mood === 'sleeping' ? 'Wake' : 'Sleep'}
          icon="Z"
          onClick={() => dispatch('sleep')}
        />
      </nav>
    </div>
  );
}

