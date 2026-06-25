'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { REGION_NAMES } from '@gg-stats/shared';

const REGIONS = [
  { value: 'la2', label: 'LAS' },
  { value: 'la1', label: 'LAN' },
  { value: 'na1', label: 'NA' },
  { value: 'euw1', label: 'EUW' },
  { value: 'eun1', label: 'EUNE' },
  { value: 'kr', label: 'KR' },
  { value: 'br1', label: 'BR' },
  { value: 'jp1', label: 'JP' },
  { value: 'oc1', label: 'OCE' },
  { value: 'tr1', label: 'TR' },
  { value: 'ru', label: 'RU' },
];

interface SearchBarProps {
  baseRoute?: string;
}

export function SearchBar({ baseRoute = '/summoner' }: SearchBarProps) {
  const router = useRouter();
  const params = useParams();
  
  const initialRegion = (params?.region as string) || 'la2';
  const initialQuery = params?.name && params?.tag 
    ? `${decodeURIComponent(params.name as string)}#${decodeURIComponent(params.tag as string)}`
    : '';

  const [region, setRegion] = useState(initialRegion);
  const [query, setQuery] = useState(initialQuery);
  const [error, setError] = useState('');

  // Update if params change (e.g. user clicked a link)
  useEffect(() => {
    if (params?.region) setRegion(params.region as string);
    if (params?.name && params?.tag) {
      setQuery(`${decodeURIComponent(params.name as string)}#${decodeURIComponent(params.tag as string)}`);
    }
  }, [params]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = query.trim();
    if (!trimmed) return;

    // Parse "Name#Tag" format
    let gameName: string;
    let tagLine: string;

    if (trimmed.includes('#')) {
      const parts = trimmed.split('#');
      gameName = parts[0].trim();
      tagLine = parts[1].trim();
    } else {
      // Default tag line for the region
      gameName = trimmed;
      tagLine = region.toUpperCase();
    }

    if (!gameName) {
      setError('Ingresá un nombre de invocador');
      return;
    }

    router.push(
      `${baseRoute}/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
    );
  };

  return (
    <div className="search-container">
      <form className="search-bar" onSubmit={handleSearch}>
        <select
          className="search-region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          aria-label="Select region"
        >
          {REGIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        <div className="search-divider" />

        <input
          className="search-input"
          type="text"
          placeholder="Buscar invocador... (Nombre#Tag)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError('');
          }}
          aria-label="Summoner name"
        />

        <button className="search-button" type="submit">
          Buscar
        </button>
      </form>

      {error && (
        <p className="error-message" style={{ marginTop: '0.75rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}
