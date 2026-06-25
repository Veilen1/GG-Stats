import type { Metadata } from 'next';
import { SearchBar } from '@/components/search/SearchBar';

export const metadata: Metadata = {
  title: 'Campeones — Builds & Stats',
  description: 'Browse champion builds, win rates, and recommended runes for League of Legends.',
};

export default function ChampionsPage() {
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <h1 className="hero-title animate-fade-in-up" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        <span className="gradient-text">Campeones</span>
      </h1>

      <p
        className="animate-fade-in-up"
        style={{
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
          animationDelay: '100ms',
        }}
      >
        Explorá builds populares, win rates y runas recomendadas para cada campeón.
      </p>

      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <SearchBar />
      </div>

      <div
        className="empty-state animate-fade-in-up"
        style={{ animationDelay: '300ms', marginTop: '3rem' }}
      >
        <div className="empty-state-icon">🏗️</div>
        <h3>Próximamente</h3>
        <p style={{ color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
          La sección de campeones estará disponible pronto con builds, win rates y estadísticas detalladas.
        </p>
      </div>
    </div>
  );
}
