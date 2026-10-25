export default function Navbar({ page, setPage, hasResults }) {
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <div className="logo">
          <div className="logo-icon">🎯</div>
          <span>
            Gap<span style={{ color: 'var(--primary-light)' }}>2</span>Goal
            <span style={{ color: 'var(--accent)', marginLeft: 4 }}>AI</span>
          </span>
        </div>
        <div className="nav-links">
          <button
            className={page === 'landing' ? 'active' : ''}
            onClick={() => setPage('landing')}
          >
            Home
          </button>
          <button
            className={page === 'app' ? 'active' : ''}
            onClick={() => setPage('app')}
          >
            Analyze
          </button>
          {hasResults && (
            <button
              className={page === 'dashboard' ? 'active' : ''}
              onClick={() => setPage('dashboard')}
            >
              Dashboard
            </button>
          )}
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setPage('app')}
        >
          Get Started →
        </button>
      </div>
    </nav>
  );
}
