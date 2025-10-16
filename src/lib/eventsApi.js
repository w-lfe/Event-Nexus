import { supabase } from './supabase';

/**
 * Fetch all events from Supabase with their vibes (categories) and city
 * @returns {Promise<{data: Array, error: Object}>}
 */
export async function fetchEvents() {
  try {
    const { data, error } = await supabase
      .from('Events')
      .select(`
        *,
        Event_Vibes(
          Vibes(
            id,
            category
          )
        ),
        Cities(
          city_name
        )
      `)
      .order('start', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return { data: null, error };
    }

    // Transform the data to match the app's expected format
    const transformedData = data?.map(event => {
      const vibes = event.Event_Vibes?.map(ev => ev.Vibes?.category) || [];
      const primaryVibe = vibes[0] || 'music'; // Default to music if no vibe
      const cityName = event.Cities?.city_name || event.location || 'Unknown Location';

      return {
        id: event.id,
        title: event.event_title,
        category: primaryVibe.toLowerCase(), // For backward compatibility
        categories: vibes.map(v => v.toLowerCase()), // All vibes
        date: event.start, // Use start time as the main date
        location: cityName,
        description: event.description || 'No description available',
        image: event.image || '🎵',
        created_at: event.created_at,
        updated_at: event.updated_at,
        // Keep original fields for reference
        city_id: event.city_id,
        start: event.start,
        stop: event.stop
      };
    });

    return { data: transformedData, error: null };
  } catch (err) {
    console.error('Unexpected error fetching events:', err);
    return { data: null, error: err };
  }
}

/**
 * Add a new event to Supabase with vibe (category) relationship
 * @param {Object} eventData - The event data to insert
 * @returns {Promise<{data: Object, error: Object}>}
 */
export async function addEvent(eventData) {
  try {
    // Get or create city
    let cityId;
    const { data: existingCity } = await supabase
      .from('Cities')
      .select('id')
      .ilike('city_name', eventData.location)
      .single();

    if (existingCity) {
      cityId = existingCity.id;
    } else {
      // Create new city
      const { data: newCity, error: cityError } = await supabase
        .from('Cities')
        .insert([{ city_name: eventData.location }])
        .select()
        .single();

      if (cityError) {
        console.error('Error creating city:', cityError);
        cityId = null;
      } else {
        cityId = newCity.id;
      }
    }

    // Parse the date string to create start and stop times
    const startTime = new Date(eventData.date);
    const stopTime = new Date(startTime);
    stopTime.setHours(stopTime.getHours() + 2); // Default 2-hour event duration

    // Insert the event
    const { data: event, error: eventError } = await supabase
      .from('Events')
      .insert([
        {
          event_title: eventData.title,
          city_id: cityId,
          start: startTime.toISOString(),
          stop: stopTime.toISOString(),
          location: eventData.location,
          description: eventData.description,
          image: eventData.image
        }
      ])
      .select()
      .single();

    if (eventError) {
      console.error('Error adding event:', eventError);
      return { data: null, error: eventError };
    }

    // Get the vibe ID from the Vibes table
    const { data: vibe, error: vibeError } = await supabase
      .from('Vibes')
      .select('id')
      .ilike('category', eventData.category)
      .single();

    if (vibeError) {
      console.error('Error finding vibe:', vibeError);
      // If vibe not found, still return the event
      return {
        data: {
          id: event.id,
          title: event.event_title,
          category: eventData.category,
          categories: [eventData.category],
          date: event.start,
          location: eventData.location,
          description: event.description,
          image: event.image
        },
        error: null
      };
    }

    // Create the relationship in Event_Vibes junction table
    const { error: junctionError } = await supabase
      .from('Event_Vibes')
      .insert([
        {
          event_id: event.id,
          category: vibe.id
        }
      ]);

    if (junctionError) {
      console.error('Error linking event to vibe:', junctionError);
    }

    // Return event in the expected format
    return {
      data: {
        id: event.id,
        title: event.event_title,
        category: eventData.category,
        categories: [eventData.category],
        date: event.start,
        location: eventData.location,
        description: event.description,
        image: event.image,
        created_at: event.created_at,
        updated_at: event.updated_at
      },
      error: null
    };
  } catch (err) {
    console.error('Unexpected error adding event:', err);
    return { data: null, error: err };
  }
}

/**
 * Fetch all cities from Supabase
 * @returns {Promise<{data: Array, error: Object}>}
 */
export async function fetchCities() {
  try {
    const { data, error } = await supabase
      .from('Cities')
      .select('id, city_name')
      .order('city_name', { ascending: true });

    if (error) {
      console.error('Error fetching cities:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error fetching cities:', err);
    return { data: null, error: err };
  }
}

/**
 * Delete an event from Supabase
 * @param {string} eventId - The UUID of the event to delete
 * @returns {Promise<{data: Object, error: Object}>}
 */
export async function deleteEvent(eventId) {
  try {
    const { data, error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      console.error('Error deleting event:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error deleting event:', err);
    return { data: null, error: err };
  }
}

/**
 * Update an existing event in Supabase
 * @param {string} eventId - The UUID of the event to update
 * @param {Object} updates - The fields to update
 * @returns {Promise<{data: Object, error: Object}>}
 */
export async function updateEvent(eventId, updates) {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error updating event:', err);
    return { data: null, error: err };
  }
}
