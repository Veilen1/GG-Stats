'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  const isTft = pathname?.startsWith('/tft');

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        🎮 <span>GG Stats</span>
      </Link>

      <ul className="navbar-nav">
        <li>
          <Link
            href="/"
            className={`navbar-link ${pathname === '/' ? 'active' : ''}`}
          >
            Inicio
          </Link>
        </li>
        <li>
          <Link
            href="/champions"
            className={`navbar-link ${pathname?.startsWith('/champions') ? 'active' : ''}`}
          >
            Campeones
          </Link>
        </li>
        <li>
          <div className="game-selector">
            <Link
              href="/"
              className={`game-tab ${!isTft ? 'active' : ''}`}
            >
              LoL
            </Link>
            <Link
              href="/tft"
              className={`game-tab ${isTft ? 'active' : ''}`}
            >
              TFT
            </Link>
          </div>
        </li>
      </ul>
    </nav>
  );
}
