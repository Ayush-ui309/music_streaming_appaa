import React, { useEffect, useState } from 'react';
import { Diamond, CheckCircle, Lock, Zap, Headphones, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BENEFITS = [
  { icon: <Headphones size={20} color="var(--primary-color)" />, title: 'Ad-free listening', desc: 'Enjoy music without interruptions.' },
  { icon: <Download size={20} color="var(--primary-color)" />, title: 'Offline downloads', desc: 'Download songs and listen anywhere.' },
  { icon: <Zap size={20} color="var(--primary-color)" />, title: 'High quality audio', desc: 'Up to 320kbps crystal clear audio.' },
  { icon: <CheckCircle size={20} color="var(--primary-color)" />, title: 'Unlimited skips', desc: 'Skip any song as many times as you want.' },
];

const LOCKED_PLAYLISTS = [
  { id: 'p1', name: 'Midnight Sessions', desc: 'Deep late-night electronica', color: '#0d1f3c' },
  { id: 'p2', name: 'Neon Jungle', desc: 'Tropical bass and percussions', color: '#1a0d3c' },
  { id: 'p3', name: 'Pro Picks Weekly', desc: 'Curated by SonicWave editors', color: '#0d3c1a' },
];

const Premium = () => {
  const navigate = useNavigate();
  const [activated, setActivated] = useState(false);

  return (
    <div style={styles.container}>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroGlow} />
        <Diamond size={48} color="var(--primary-color)" />
        <h1 style={styles.heroTitle}>SonicWave Premium</h1>
        <p style={styles.heroSub}>Unlock the full music experience. No limits.</p>
        {activated ? (
          <div style={styles.activatedBadge}>
            <CheckCircle size={20} />
            <span>Premium Activated!</span>
          </div>
        ) : (
          <button
            className="btn-primary"
            style={{ marginTop: '24px', padding: '16px 48px', fontSize: '18px' }}
            onClick={() => setActivated(true)}
          >
            Activate Premium — Free Trial
          </button>
        )}
      </div>

      {/* Benefits */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Why Go Premium?</h2>
        <div style={styles.benefitsGrid}>
          {BENEFITS.map((b, i) => (
            <div key={i} style={styles.benefitCard}>
              <div style={styles.benefitIcon}>{b.icon}</div>
              <h3 style={styles.benefitTitle}>{b.title}</h3>
              <p style={styles.benefitDesc}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Locked playlists */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Premium Playlists</h2>
        <div style={styles.lockedGrid}>
          {LOCKED_PLAYLISTS.map(pl => (
            <div key={pl.id} style={{ ...styles.lockedCard, backgroundColor: pl.color }}>
              {!activated && <div style={styles.lockOverlay}><Lock size={28} color="rgba(255,255,255,0.7)" /></div>}
              <h3 style={styles.lockedTitle}>{pl.name}</h3>
              <p style={styles.lockedDesc}>{pl.desc}</p>
              {activated && (
                <button
                  style={styles.playLockedBtn}
                  onClick={() => navigate(`/search`)}
                >
                  Explore &rarr;
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={styles.pricingBox}>
        <h2 style={styles.sectionTitle}>Simple Pricing</h2>
        <div style={styles.pricingCard}>
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>PREMIUM PLAN</p>
            <p style={{ fontSize: '42px', fontWeight: '900' }}>
              $9.99<span style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '400' }}>/month</span>
            </p>
          </div>
          <button
            className="btn-primary"
            style={{ padding: '14px 32px' }}
            onClick={() => setActivated(true)}
          >
            {activated ? '✓ Active' : 'Get Premium'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '0 0 80px 0' },
  hero: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '64px 32px', textAlign: 'center', position: 'relative', marginBottom: '48px',
  },
  heroGlow: {
    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
    width: '300px', height: '300px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(77,244,120,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroTitle: { fontSize: '48px', fontWeight: '900', letterSpacing: '-2px', marginTop: '16px' },
  heroSub: { fontSize: '18px', color: 'var(--text-secondary)', marginTop: '8px' },
  activatedBadge: {
    display: 'flex', alignItems: 'center', gap: '8px',
    color: 'var(--primary-color)', fontWeight: '700', fontSize: '18px', marginTop: '24px',
  },
  section: { marginBottom: '48px' },
  sectionTitle: { fontSize: '22px', fontWeight: '700', marginBottom: '24px' },
  benefitsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' },
  benefitCard: {
    padding: '24px', borderRadius: '16px', backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
  },
  benefitIcon: { marginBottom: '12px' },
  benefitTitle: { fontSize: '16px', fontWeight: '700', marginBottom: '6px' },
  benefitDesc: { fontSize: '14px', color: 'var(--text-secondary)', margin: 0 },
  lockedGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' },
  lockedCard: {
    padding: '28px 20px', borderRadius: '16px', position: 'relative',
    overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)',
  },
  lockOverlay: {
    position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(2px)',
  },
  lockedTitle: { fontSize: '18px', fontWeight: '800', marginBottom: '8px' },
  lockedDesc: { fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: 0 },
  playLockedBtn: {
    marginTop: '16px', background: 'rgba(255,255,255,0.1)', border: 'none',
    color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
  },
  pricingBox: { marginBottom: '48px' },
  pricingCard: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '32px', borderRadius: '16px', backgroundColor: 'var(--bg-surface)',
    border: '1px solid rgba(77,244,120,0.2)',
    boxShadow: '0 0 40px rgba(77,244,120,0.05)',
  },
};

export default Premium;
