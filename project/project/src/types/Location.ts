export interface Location {
  id: string;
  name: string;
  category: 'academic' | 'hostel' | 'admin' | 'sports' | 'food' | 'other';
  coordinates: [number, number];
  description?: string;
  image?: string;
}