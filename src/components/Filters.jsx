import './Filters.css';
import { categories, timeFilters } from '../data/mockEvents';

function Filters({ selectedCategory, setSelectedCategory, selectedTime, setSelectedTime, searchQuery, setSearchQuery }) {
  return (
    <div className="filters-container">
      <div className="search-section">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search events by name or location..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <h3 className="filter-label">Category</h3>
          <div className="filter-buttons">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="filter-icon">{category.icon}</span>
                <span className="filter-text">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3 className="filter-label">Time</h3>
          <div className="filter-buttons time-filters">
            {timeFilters.map((filter) => (
              <button
                key={filter.id}
                className={`filter-btn time-btn ${selectedTime === filter.id ? 'active' : ''}`}
                onClick={() => setSelectedTime(filter.id)}
              >
                <span className="filter-text">{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filters;
