export const locations = [
  {
    id: '1',
    name: 'Main Building',
    category: 'admin',
    coordinates: [10.9368, 76.7432],
    description: 'Administrative block and main offices',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '2',
    name: 'Central Library',
    category: 'academic',
    coordinates: [10.9365, 76.7435],
    description: 'University central library and digital resource center',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80'
  },
  // Add more locations as needed
] as const;