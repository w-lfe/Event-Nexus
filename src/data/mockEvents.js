// Mock event data for development
export const mockEvents = [
  {
    id: 1,
    title: "Neon Nights Music Festival",
    category: "music",
    date: "2025-10-15T20:00:00",
    location: "Downtown Arena",
    description: "Experience the future of electronic music with holographic performances and immersive sound.",
    image: "🎵"
  },
  {
    id: 2,
    title: "Cyberpunk Food Market",
    category: "food",
    date: "2025-10-15T18:00:00",
    location: "Tech District Plaza",
    description: "Street food reimagined with molecular gastronomy and fusion cuisine.",
    image: "🍜"
  },
  {
    id: 3,
    title: "AI Comedy Show",
    category: "comedy",
    date: "2025-10-16T21:00:00",
    location: "The Laugh Lab",
    description: "Stand-up comedy meets artificial intelligence. Prepare for unexpected humor.",
    image: "😂"
  },
  {
    id: 4,
    title: "Digital Art Exhibition",
    category: "arts",
    date: "2025-10-17T14:00:00",
    location: "Neo Gallery",
    description: "Interactive NFT art installations and virtual reality experiences.",
    image: "🎨"
  },
  {
    id: 5,
    title: "Synthwave Saturday",
    category: "music",
    date: "2025-10-19T22:00:00",
    location: "Retro Club",
    description: "80s inspired electronic music with neon visuals and laser shows.",
    image: "🎹"
  },
  {
    id: 6,
    title: "Rooftop Jazz Night",
    category: "music",
    date: "2025-10-15T19:30:00",
    location: "Sky Lounge",
    description: "Smooth jazz under the stars with craft cocktails and city views.",
    image: "🎷"
  },
  {
    id: 7,
    title: "Vegan Fusion Pop-Up",
    category: "food",
    date: "2025-10-16T17:00:00",
    location: "Green Space Market",
    description: "Plant-based cuisine from around the world. Sustainable and delicious.",
    image: "🥗"
  },
  {
    id: 8,
    title: "Improv Comedy Workshop",
    category: "comedy",
    date: "2025-10-18T19:00:00",
    location: "The Comedy Loft",
    description: "Learn improv techniques and perform with the pros. Beginners welcome!",
    image: "🎭"
  },
  {
    id: 9,
    title: "Street Art Tour",
    category: "arts",
    date: "2025-10-17T10:00:00",
    location: "Arts District",
    description: "Guided walking tour of the city's most vibrant murals and graffiti.",
    image: "🖌️"
  },
  {
    id: 10,
    title: "Open Mic Night",
    category: "music",
    date: "2025-10-16T20:00:00",
    location: "The Underground",
    description: "Showcase your talent! All genres welcome. Sign up at the door.",
    image: "🎤"
  },
  {
    id: 11,
    title: "Craft Beer & BBQ Fest",
    category: "food",
    date: "2025-10-19T16:00:00",
    location: "Riverside Park",
    description: "50+ craft beers and award-winning BBQ from local pitmasters.",
    image: "🍺"
  },
  {
    id: 12,
    title: "Photography Exhibition",
    category: "arts",
    date: "2025-10-18T18:00:00",
    location: "Frame Gallery",
    description: "Urban landscapes and portrait photography by emerging artists.",
    image: "📸"
  }
];

export const categories = [
  { id: "all", label: "All Events", icon: "✨" },
  { id: "party", label: "Party", icon: "🎉", order: 1 },
  { id: "music", label: "Music", icon: "🎵", order: 2 },
  { id: "festival", label: "Festival", icon: "🎪", order: 3 },
  { id: "food", label: "Food", icon: "🍜", order: 4 },
  { id: "artsy", label: "Artsy", icon: "🎨", order: 5 },
  { id: "comedy", label: "Comedy", icon: "😂", order: 6 },
  { id: "expo", label: "Expo", icon: "🏛️", order: 7 },
  { id: "sports", label: "Sports", icon: "⚽", order: 8 }
];

export const timeFilters = [
  { id: "all", label: "All Time" },
  { id: "today", label: "Today" },
  { id: "weekend", label: "Weekend" }
];
