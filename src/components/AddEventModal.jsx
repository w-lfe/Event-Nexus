import { useState, useEffect } from 'react';
import './AddEventModal.css';
import { categories } from '../data/mockEvents';
import { fetchCities } from '../lib/eventsApi';

function AddEventModal({ isOpen, onClose, onAddEvent }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'music',
    date: '',
    time: '',
    location: '',
    description: '',
    image: '🎵'
  });

  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Fetch cities when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCities();
    }
  }, [isOpen]);

  const loadCities = async () => {
    setLoadingCities(true);
    const { data, error } = await fetchCities();
    if (error) {
      console.error('Error loading cities:', error);
    } else {
      setCities(data || []);
    }
    setLoadingCities(false);
  };

  const categoryIcons = {
    party: '🎉',
    music: '🎵',
    festival: '🎪',
    food: '🍜',
    artsy: '🎨',
    comedy: '😂',
    expo: '🏛️',
    sports: '⚽'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Update image when category changes
      ...(name === 'category' ? { image: categoryIcons[value] } : {})
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if date is in the past
      if (selectedDate < today) {
        newErrors.date = 'Event date cannot be in the past';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.length > 100) {
      newErrors.location = 'Location must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Combine date and time into ISO string
    const dateTimeString = `${formData.date}T${formData.time}:00`;

    const newEvent = {
      id: Date.now(), // Temporary ID (will be replaced by Supabase later)
      title: formData.title.trim(),
      category: formData.category,
      date: dateTimeString,
      location: formData.location.trim(),
      description: formData.description.trim(),
      image: categoryIcons[formData.category]
    };

    onAddEvent(newEvent);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      category: 'music',
      date: '',
      time: '',
      location: '',
      description: '',
      image: '🎵'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="modal-icon">✨</span>
            Add New Event
          </h2>
          <button className="modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="e.g., Neon Nights Music Festival"
              value={formData.title}
              onChange={handleChange}
              maxLength={100}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category *
            </label>
            <select
              id="category"
              name="category"
              className={`form-select ${errors.category ? 'error' : ''}`}
              value={formData.category}
              onChange={handleChange}
            >
              {categories
                .filter(cat => cat.id !== 'all')
                .map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className={`form-input ${errors.date ? 'error' : ''}`}
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="time" className="form-label">
                Time *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                className={`form-input ${errors.time ? 'error' : ''}`}
                value={formData.time}
                onChange={handleChange}
              />
              {errors.time && <span className="error-message">{errors.time}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">
              City *
            </label>
            {loadingCities ? (
              <div className="form-input">Loading cities...</div>
            ) : (
              <>
                <select
                  id="location"
                  name="location"
                  className={`form-select ${errors.location ? 'error' : ''}`}
                  value={formData.location}
                  onChange={handleChange}
                >
                  <option value="">Select a city</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.city_name}>
                      {city.city_name}
                    </option>
                  ))}
                  <option value="__new__">➕ Add New City</option>
                </select>
                {formData.location === '__new__' && (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter new city name"
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    style={{ marginTop: '0.5rem' }}
                    maxLength={100}
                  />
                )}
              </>
            )}
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Tell us about your event... (10-500 characters)"
              value={formData.description}
              onChange={handleChange}
              maxLength={500}
              rows={4}
            />
            <div className="char-count">
              {formData.description.length}/500 characters
            </div>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <span className="btn-icon">+</span>
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEventModal;
