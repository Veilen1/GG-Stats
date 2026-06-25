import Link from 'next/link';

interface LiveGameBannerProps {
  region: string;
  gameName: string;
  tagLine: string;
}

export function LiveGameBanner({
  region,
  gameName,
  tagLine,
}: LiveGameBannerProps) {
  return (
    <Link
      href={`/live/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`}
      style={{ textDecoration: 'none' }}
    >
      <div className="live-banner">
        <div className="live-dot" />
        <span className="live-text">
          En partida ahora — Click para ver datos en vivo
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '1.25rem' }}>→</span>
      </div>
    </Link>
  );
}
