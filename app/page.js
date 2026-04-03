'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

// ── Constants ─────────────────────────────────────────────
const GOAL = 33;

// localStorage keys
const KEYS = {
  count:      'istigrow_dhikr_count',
  savedDate:  'istigrow_dhikr_date',   // "YYYY-MM-DD" of last saved count
  streak:     'istigrow_streak',
  streakDate: 'istigrow_streak_date',  // "YYYY-MM-DD" of last streak increment
};

// Today as "YYYY-MM-DD"
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Was `dateStr` yesterday?
function wasYesterday(dateStr) {
  if (!dateStr) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const ys = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  return dateStr === ys;
}

// Streak → emoji
function streakEmoji(streak) {
  if (streak === 0) return { icon: '🌱', label: 'Seed — start your journey' };
  if (streak <= 3)  return { icon: '🌿', label: `${streak}-day sprout` };
  if (streak <= 7)  return { icon: '🌳', label: `${streak}-day tree` };
  return              { icon: '🌲', label: `${streak}-day firm tree` };
}

// ── Component ─────────────────────────────────────────────
export default function Home() {
  const [count, setCount]           = useState(0);
  const [streak, setStreak]         = useState(0);
  const [animating, setAnimating]   = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [mounted, setMounted]       = useState(false);

  // ── Load from localStorage on mount ──────────────────────
  useEffect(() => {
    const today = todayStr();

    // --- Count: only restore if it was saved today ---
    const savedDate  = localStorage.getItem(KEYS.savedDate);
    const savedCount = parseInt(localStorage.getItem(KEYS.count) || '0', 10);
    const restoredCount = (savedDate === today && !isNaN(savedCount)) ? savedCount : 0;
    if (savedDate !== today) {
      // New day — clear stale count
      localStorage.setItem(KEYS.count, '0');
      localStorage.setItem(KEYS.savedDate, today);
    }
    setCount(restoredCount);

    // --- Streak: validate continuity ---
    const streakDate = localStorage.getItem(KEYS.streakDate);
    const rawStreak  = parseInt(localStorage.getItem(KEYS.streak) || '0', 10);
    let restoredStreak = isNaN(rawStreak) ? 0 : rawStreak;

    if (streakDate === today) {
      // Already incremented today — keep as is
    } else if (wasYesterday(streakDate)) {
      // Yesterday was the last active day — streak is still alive, don't increment yet
    } else if (streakDate !== null) {
      // Gap of 2+ days — streak broken
      restoredStreak = 0;
      localStorage.setItem(KEYS.streak, '0');
    }

    setStreak(restoredStreak);
    setMounted(true);
  }, []);

  // ── Tap handler ───────────────────────────────────────────
  const handleDhikr = () => {
    if (animating) return;

    const today       = todayStr();
    const next        = count + 1;
    const nowComplete = next >= GOAL;

    setCount(next);
    localStorage.setItem(KEYS.count, next.toString());
    localStorage.setItem(KEYS.savedDate, today);

    // Increment streak only once — the moment the goal is first reached today
    if (nowComplete && count < GOAL) {
      const streakDate = localStorage.getItem(KEYS.streakDate);
      if (streakDate !== today) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem(KEYS.streak, newStreak.toString());
        localStorage.setItem(KEYS.streakDate, today);
      }
    }

    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
  };

  // ── Reset handler (resets today's count only, streak intact) ──
  const handleReset = () => {
    setCount(0);
    localStorage.setItem(KEYS.count, '0');
    localStorage.setItem(KEYS.savedDate, todayStr());
  };

  // ── Derived values ────────────────────────────────────────
  const progress  = Math.min((count / GOAL) * 100, 100);
  const completed = count >= GOAL;
  const { icon: streakIcon, label: streakLabel } = streakEmoji(streak);

  if (!mounted) return null;

  return (
    <main className={styles.main}>

      {/* ── LANDING / HERO ── */}
      {showLanding && (
        <section className={styles.landing}>
          <div className={styles.patternOverlay} aria-hidden="true" />

          <div className={styles.landingContent}>
            {/* Logo */}
            <div className={styles.logoWrap}>
              <div className={styles.logoIcon}>
                <img src="/icons/IstiGrowLogo.png" alt="IstiGrow logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <h1 className={styles.logoText}>Istigrow</h1>
            </div>

            <p className={styles.arabicTagline} dir="rtl">ٱسْتِقَامَة</p>
            <p className={styles.tagline}>
              Build your <em>Istiqomah</em> — one habit, one day at a time.
            </p>

            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>📿</span>
                <span>Daily Dhikr tracker</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>🌙</span>
                <span>Consistent spiritual growth</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>🌿</span>
                <span>Minimalist, distraction-free</span>
              </div>
            </div>

            <button
              id="start-journey-btn"
              className={styles.ctaBtn}
              onClick={() => setShowLanding(false)}
            >
              Begin your Istiqomah →
            </button>

            <p className={styles.installHint}>
              📱 Add to Home Screen for the full app experience
            </p>
          </div>
        </section>
      )}

      {/* ── DASHBOARD ── */}
      {!showLanding && (
        <section className={styles.dashboard}>

          {/* Header */}
          <header className={styles.header}>
            <button
              id="back-to-landing-btn"
              className={styles.backBtn}
              onClick={() => setShowLanding(true)}
              aria-label="Back to home"
            >
              ←
            </button>
            <div className={styles.headerTitle}>
              <span className={styles.headerLogo}>Istigrow</span>
              <span className={styles.headerSub}>Daily Istiqomah</span>
            </div>
            <div className={styles.headerDate}>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </header>

          {/* ── Streak banner ── */}
          <div
            className={`${styles.streakBanner} ${streak > 0 ? styles.streakBannerActive : ''}`}
            id="streak-banner"
            title={streakLabel}
          >
            <span className={styles.streakIcon} aria-label={streakLabel}>
              {streakIcon}
            </span>
            <div className={styles.streakInfo}>
              <span className={styles.streakCount}>
                {streak} day{streak !== 1 ? 's' : ''} streak
              </span>
              <span className={styles.streakLabel}>{streakLabel}</span>
            </div>
            {streak > 0 && (
              <div className={styles.streakBadge}>{streak}</div>
            )}
          </div>

          {/* Dhikr Card */}
          <div className={styles.dhikrCard}>

            {/* Card header */}
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>📿</div>
              <div>
                <h2 className={styles.cardTitle}>Morning Dhikr</h2>
                <p className={styles.cardSub}>Subhanallah · Alhamdulillah · Allahu Akbar</p>
              </div>
              {completed && (
                <div className={styles.completedBadge} title="Goal reached!">✓</div>
              )}
            </div>

            {/* Arabic text */}
            <p className={`${styles.arabicText} arabic`} dir="rtl">
              سُبْحَانَ ٱللَّٰهِ
            </p>

            {/* Progress ring + counter */}
            <div className={styles.counterWrap}>
              <div className={`${styles.counterCircle} ${completed ? styles.counterCircleDone : ''}`}>
                <svg className={styles.progressRing} viewBox="0 0 120 120" aria-hidden="true">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="6"/>
                  <circle
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke={completed ? '#34d399' : '#10b981'}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                  />
                </svg>
                <div className={styles.counterInner}>
                  <span
                    id="dhikr-count-display"
                    className={`${styles.countNumber} ${animating ? styles.countBump : ''}`}
                  >
                    {count}
                  </span>
                  <span className={styles.countGoal}>/ {GOAL}</span>
                </div>
              </div>
            </div>

            {/* Main tap button */}
            <button
              id="dhikr-tap-btn"
              className={`${styles.dhikrBtn} ${animating ? styles.dhikrBtnActive : ''} ${completed ? styles.dhikrBtnDone : ''}`}
              onClick={handleDhikr}
              aria-label={`Record dhikr, current count ${count}`}
            >
              {completed ? '🌟 Alhamdulillah!' : '﷽  Tap to Count'}
            </button>

            {/* Progress bar */}
            <div className={styles.progressBarWrap}>
              <div
                className={styles.progressBar}
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={count}
                aria-valuemin={0}
                aria-valuemax={GOAL}
              />
            </div>
            <p className={styles.progressLabel}>
              {completed
                ? `MashaAllah! Goal of ${GOAL} reached 🌿`
                : `${GOAL - count} remaining to reach today's goal`}
            </p>

            {/* Reset */}
            {count > 0 && (
              <button
                id="dhikr-reset-btn"
                className={styles.resetBtn}
                onClick={handleReset}
              >
                Reset today's count
              </button>
            )}
          </div>

          {/* Coming soon cards */}
          <div className={styles.comingCards}>
            <p className={styles.comingSoonLabel}>More habits coming soon</p>
            {['Quran Reading', 'Fajr Prayer', 'Evening Adhkar'].map((name) => (
              <div key={name} className={styles.comingCard}>
                <span className={styles.comingCardText}>{name}</span>
                <span className={styles.comingSoonTag}>Soon</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <footer className={styles.footer}>
            <p>بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
          </footer>

        </section>
      )}
    </main>
  );
}
