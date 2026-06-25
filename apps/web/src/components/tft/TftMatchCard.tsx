"use client";

import { timeAgo, formatDuration, getTftUnitIconUrl, getTftItemIconUrl, getTftTraitIconUrls } from '@/lib/ddragon';
import type { TFTMatchSummary, TFTUnit, TFTTrait } from '@gg-stats/shared';

interface TftMatchCardProps {
  match: TFTMatchSummary;
}

export function TftMatchCard({ match }: TftMatchCardProps) {
  const isWin = match.placement <= 4;
  const matchColor = isWin ? 'var(--match-win)' : 'var(--match-loss)';
  const matchBg = isWin ? 'var(--match-win-bg)' : 'var(--match-loss-bg)';

  // Format placement (e.g., 1st, 2nd, 3rd)
  const getPlacementSuffix = (n: number) => {
    if (n === 1) return 'st';
    if (n === 2) return 'nd';
    if (n === 3) return 'rd';
    return 'th';
  };

  // Sort traits by tier and then by style (higher style = better)
  const activeTraits = [...match.traits]
    .filter(t => t.style > 0 || t.currentTier > 0)
    .sort((a, b) => b.style - a.style || b.numUnits - a.numUnits)
    .slice(0, 10); // Show top 10 traits

  return (
    <div
      className="card match-card"
      style={{
        borderLeft: `6px solid ${matchColor}`,
        background: matchBg,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ fontWeight: 'bold', color: matchColor }}>
            {match.placement}
            <span style={{ fontSize: '0.8em', opacity: 0.8 }}>{getPlacementSuffix(match.placement)}</span> Place
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {match.gameType === '1090' ? 'Normal' : match.gameType === '1100' ? 'Ranked' : 'TFT'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
          <div>{timeAgo(match.gameDatetime)}</div>
          <div>{formatDuration(match.gameLength)}</div>
          <div>Lvl {match.level}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Traits */}
        <div style={{ display: 'flex', maxHeight: '50px', width: '100%', gap: '0.5rem', flexWrap: 'wrap', flex: 1, minWidth: '200px' }}>
          {activeTraits.map((trait, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                border: `1px solid ${trait.style === 3 ? '#FFD700' :
                  trait.style === 2 ? '#C0C0C0' :
                    trait.style === 1 ? '#CD7F32' : 'var(--border-glass)'
                  }`
              }}
              title={trait.name}
            >
              <img
                src={trait.iconUrl || getTftTraitIconUrls(trait.name)[0]}
                data-urls={JSON.stringify(trait.iconUrl ? [trait.iconUrl] : getTftTraitIconUrls(trait.name))}
                data-index="0"
                alt={trait.name}
                style={{ width: '16px', height: '16px', filter: 'brightness(0) invert(1)' }}
                onError={(e) => {
                  const target = e.currentTarget;
                  const urls = JSON.parse(target.dataset.urls || '[]');
                  const currentIndex = parseInt(target.dataset.index || '0', 10);

                  if (currentIndex + 1 < urls.length) {
                    target.dataset.index = (currentIndex + 1).toString();
                    target.src = urls[currentIndex + 1];
                  } else {
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'inline';
                    }
                  }
                }}
              />
              <span style={{ display: 'none', fontSize: '0.75rem', marginRight: '2px' }}>
                {trait.name.replace(/TFT\d+_/, '')}
              </span>
              <span style={{ opacity: 0.7 }}>{trait.numUnits}</span>
            </div>
          ))}
        </div>

        {/* Units */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', flex: 2, minWidth: '300px' }}>
          {match.units.map((unit, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <div style={{ fontSize: '0.8rem', color: '#FFD700', marginBottom: '-2px' }}>
                {'★'.repeat(unit.tier)}
              </div>
              <div style={{
                width: '64px',
                height: '64px',
                background: '#2A2A35',
                borderRadius: '6px',
                border: `2px solid ${unit.rarity >= 4 ? '#ff00ff' : unit.rarity === 3 ? '#00ffff' : unit.rarity === 2 ? '#1E90FF' : unit.rarity === 1 ? '#32CD32' : 'var(--border-glass)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img
                  src={getTftUnitIconUrl(unit.characterId)}
                  data-fallback={unit.iconUrl}
                  alt={unit.characterId}
                  style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.dataset.fallback && target.src !== target.dataset.fallback) {
                      target.src = target.dataset.fallback;
                    } else {
                      target.style.display = 'none';
                      if (target.nextElementSibling) {
                        (target.nextElementSibling as HTMLElement).style.display = 'block';
                      }
                    }
                  }}
                />
                <span style={{ display: 'none', fontSize: '0.7rem', textAlign: 'center', wordBreak: 'break-all' }}>
                  {unit.characterId.replace(/TFT\d+_/, '')}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '2px', marginTop: '4px', justifyContent: 'center' }}>
                {unit.itemNames.map((item, j) => (
                  <div key={j} style={{
                    width: '24px',
                    height: '24px',
                    background: 'var(--bg-glass)',
                    overflow: 'hidden',
                    borderRadius: '3px',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }} title={item}>
                    <img
                      src={getTftItemIconUrl(item)}
                      alt={item}
                      style={{ width: '100%', height: '24px', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
