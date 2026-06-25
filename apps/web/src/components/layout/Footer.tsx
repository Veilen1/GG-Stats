export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          GG Stats isn&apos;t endorsed by Riot Games and doesn&apos;t
          reflect the views or opinions of Riot Games or anyone
          officially involved in producing or managing Riot Games
          properties.
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          Riot Games, and all associated properties are trademarks or
          registered trademarks of Riot Games, Inc.
        </p>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
          Built with ❤️ using Next.js, NestJS & Riot Games API
        </p>
      </div>
    </footer>
  );
}
