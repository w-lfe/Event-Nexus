import './EventCard.css';

function EventCard({ event }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getCategoryColor = (category) => {
    const colors = {
      party: '#ff00ff',      // Magenta/Purple
      music: '#00d4ff',      // Cyan
      festival: '#ff6b00',   // Orange
      food: '#4caf50',       // Green
      artsy: '#e91e63',      // Pink
      comedy: '#ffeb3b',     // Yellow
      expo: '#9c27b0',       // Purple
      sports: '#f44336'      // Red
    };
    return colors[category] || '#00d4ff';
  };

  return (
    <div className="event-card" style={{ '--category-color': getCategoryColor(event.category) }}>
      <div className="event-card-header">
        <span className="event-icon">{event.image}</span>
        <span className="event-category" style={{ color: getCategoryColor(event.category) }}>
          {event.category.toUpperCase()}
        </span>
      </div>

      <h3 className="event-title">{event.title}</h3>

      <div className="event-details">
        <div className="event-detail">
          <span className="detail-icon">📅</span>
          <span className="detail-text">{formatDate(event.date)}</span>
        </div>
        <div className="event-detail">
          <span className="detail-icon">📍</span>
          <span className="detail-text">{event.location}</span>
        </div>
      </div>

      <p className="event-description">{event.description}</p>

      <div className="event-card-footer">
        <button className="event-btn">Learn More</button>
      </div>
    </div>
  );
}

export default EventCard;
