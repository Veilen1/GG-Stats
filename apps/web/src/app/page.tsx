'use client';

import { SearchBar } from '@/components/search/SearchBar';

export default function HomePage() {
  return (
    <section className="hero">
      <h1 className="hero-title animate-fade-in-up">
        Dominate the Rift with
        <br />
        <span className="gradient-text">Real-Time Stats</span>
      </h1>

      <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        Track your League of Legends and TFT performance.
        Live game data, match history, builds, and more.
      </p>

      <div className="animate-fade-in-up" style={{ animationDelay: '200ms', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <SearchBar />
      </div>

      <div className="hero-features animate-fade-in-up" style={{ animationDelay: '400ms', marginTop: '3rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <FeatureChip icon="⚡" label="Real-time data" />
          <FeatureChip icon="📊" label="Match history" />
          <FeatureChip icon="🏆" label="Ranked stats" />
          <FeatureChip icon="🎮" label="Live game" />
          <FeatureChip icon="🛡️" label="Builds & runes" />
        </div>
      </div>
    </section>
  );
}

function FeatureChip({ icon, label }: { icon: string; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
