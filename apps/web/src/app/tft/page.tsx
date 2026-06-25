import { SearchBar } from '@/components/search/SearchBar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TFT — Teamfight Tactics Statistics',
  description: 'Track your TFT stats, match history, meta comps, and more.',
};

export default function TftHomePage() {
  return (
    <section className="hero">
      <h1 className="hero-title animate-fade-in-up">
        TFT
        <br />
        <span className="gradient-text">Statistics & Meta</span>
      </h1>

      <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        Track your Teamfight Tactics performance, discover meta comps,
        and climb the ranked ladder.
      </p>

      <div className="animate-fade-in-up" style={{ animationDelay: '200ms', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <SearchBar baseRoute="/tft/summoner" />
      </div>

      <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        className="animate-fade-in-up"
      >
        <FeatureChip icon="🏆" label="Ranked stats" />
        <FeatureChip icon="📊" label="Match history" />
        <FeatureChip icon="🧩" label="Meta comps" />
        <FeatureChip icon="⚔️" label="Item combiner" />
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
