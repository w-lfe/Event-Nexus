import './Header.css';

function Header({ onAddEventClick }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-icon">⚡</div>
          <div className="logo-text">
            <h1 className="logo-title">Event Nexus 2077</h1>
            <p className="logo-subtitle">Discover What's Next</p>
          </div>
        </div>

        <nav className="header-nav">
          <button className="nav-btn">Explore</button>
          <button className="nav-btn">My Events</button>
          <button className="nav-btn-primary" onClick={onAddEventClick}>
            <span className="btn-icon">+</span>
            Add Event
          </button>
        </nav>
      </div>

      <div className="header-gradient"></div>
    </header>
  );
}

export default Header;
