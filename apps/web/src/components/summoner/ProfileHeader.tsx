import Image from 'next/image';
import Link from 'next/link';
import { getProfileIconUrl } from '@/lib/ddragon';
import { REGION_NAMES } from '@gg-stats/shared';
import type { SummonerProfile } from '@gg-stats/shared';

interface ProfileHeaderProps {
  profile: SummonerProfile;
  activeTab?: 'lol' | 'tft';
}

export function ProfileHeader({ profile, activeTab = 'lol' }: ProfileHeaderProps) {
  const lolUrl = `/summoner/${profile.region}/${encodeURIComponent(profile.gameName)}/${encodeURIComponent(profile.tagLine)}`;
  const tftUrl = `/tft/summoner/${profile.region}/${encodeURIComponent(profile.gameName)}/${encodeURIComponent(profile.tagLine)}`;

  return (
    <div className="profile-header-container animate-fade-in-up">
      <div className="profile-header">
        <div className="profile-icon-wrapper">
          <Image
            className="profile-icon"
            src={getProfileIconUrl(profile.profileIconId)}
            alt={`${profile.gameName} profile icon`}
            width={100}
            height={100}
            priority
          />
          <span className="profile-level">{profile.summonerLevel}</span>
        </div>

        <div className="profile-info">
          <h1 className="profile-name">
            {profile.gameName}
            <span className="tag">#{profile.tagLine}</span>
          </h1>
          <p className="profile-region">
            📍 {REGION_NAMES[profile.region] || profile.region.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="profile-nav" style={{ 
        display: 'flex', 
        gap: '2rem', 
        marginTop: '1.5rem', 
        borderBottom: '1px solid var(--border-glass)' 
      }}>
        <Link 
          href={lolUrl} 
          style={{ 
            color: activeTab === 'lol' ? 'var(--text-primary)' : 'var(--text-tertiary)', 
            borderBottom: activeTab === 'lol' ? '2px solid var(--primary)' : '2px solid transparent', 
            paddingBottom: '0.75rem', 
            fontWeight: activeTab === 'lol' ? 'bold' : 'normal', 
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          League of Legends
        </Link>
        <Link 
          href={tftUrl} 
          style={{ 
            color: activeTab === 'tft' ? 'var(--text-primary)' : 'var(--text-tertiary)', 
            borderBottom: activeTab === 'tft' ? '2px solid var(--primary)' : '2px solid transparent', 
            paddingBottom: '0.75rem', 
            fontWeight: activeTab === 'tft' ? 'bold' : 'normal', 
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          Teamfight Tactics
        </Link>
      </div>
    </div>
  );
}
