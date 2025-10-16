import { useState, useMemo, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Filters from './components/Filters';
import EventCard from './components/EventCard';
import AddEventModal from './components/AddEventModal';
import { fetchEvents, addEvent } from './lib/eventsApi';

function App() {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from Supabase on component mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await fetchEvents();

    if (error) {
      setError('Failed to load events. Please check your connection.');
      console.error('Error loading events:', error);
    } else {
      setEvents(data || []);
    }

    setIsLoading(false);
  };

  const handleAddEvent = async (newEvent) => {
    console.log('Attempting to add event:', newEvent);
    const { data, error } = await addEvent(newEvent);

    if (error) {
      const errorMessage = error.message || JSON.stringify(error);
      alert(`Failed to add event: ${errorMessage}\n\nCheck console for details.`);
      console.error('Error adding event:', error);
      console.error('Event data that failed:', newEvent);
      return;
    }

    if (!data) {
      alert('Failed to add event. No data returned from server.');
      console.error('No data returned for event:', newEvent);
      return;
    }

    console.log('Event added successfully:', data);

    // Add the new event to the beginning of the list
    setEvents(prevEvents => [data, ...prevEvents]);

    // Clear filters to show the new event
    setSelectedCategory('all');
    setSelectedTime('all');
    setSearchQuery('');
  };

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Category filter - support many-to-many relationship
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => {
        // Check if event has the category in its categories array
        if (event.categories && Array.isArray(event.categories)) {
          return event.categories.includes(selectedCategory);
        }
        // Fallback to single category field
        return event.category === selectedCategory;
      });
    }

    // Time filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get next Saturday and Sunday
    const daysUntilSaturday = (6 - now.getDay() + 7) % 7 || 7;
    const saturday = new Date(today);
    saturday.setDate(saturday.getDate() + daysUntilSaturday);
    const sunday = new Date(saturday);
    sunday.setDate(sunday.getDate() + 1);
    const mondayAfterWeekend = new Date(sunday);
    mondayAfterWeekend.setDate(mondayAfterWeekend.getDate() + 1);

    if (selectedTime === 'today') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate < tomorrow;
      });
    } else if (selectedTime === 'weekend') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= saturday && eventDate < mondayAfterWeekend;
      });
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [events, selectedCategory, selectedTime, searchQuery]);

  return (
    <div className="app">
      <Header onAddEventClick={() => setIsModalOpen(true)} />

      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddEvent={handleAddEvent}
      />

      <main className="main-content">
        <Filters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="events-section">
          <div className="events-header">
            <h2 className="events-title">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Found
            </h2>
            {(selectedCategory !== 'all' || selectedTime !== 'all' || searchQuery) && (
              <button
                className="clear-filters-btn"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedTime('all');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="no-events">
              <div className="no-events-icon">⏳</div>
              <h3 className="no-events-title">Loading Events...</h3>
              <p className="no-events-text">
                Please wait while we fetch the latest events.
              </p>
            </div>
          ) : error ? (
            <div className="no-events">
              <div className="no-events-icon">⚠️</div>
              <h3 className="no-events-title">Error Loading Events</h3>
              <p className="no-events-text">{error}</p>
              <button className="clear-filters-btn" onClick={loadEvents}>
                Retry
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="no-events">
              <div className="no-events-icon">🔍</div>
              <h3 className="no-events-title">No Events Found</h3>
              <p className="no-events-text">
                Try adjusting your filters or search query to discover more events.
              </p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p className="footer-text">
          Event Nexus • Crowdsourced Local Event Discovery • Built with React & Supabase
        </p>
      </footer>
    </div>
  );
}

export default App;
