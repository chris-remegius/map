import { Search as SearchIcon, Navigation } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { locations } from '../data/locations';

export function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof locations>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    
    if (value.length > 0) {
      const filtered = locations.filter(location =>
        location.name.toLowerCase().includes(value.toLowerCase()) ||
        location.description?.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  const handleLocationSelect = (location: typeof locations[0]) => {
    setQuery(location.name);
    setIsOpen(false);
    // Get the map instance and fly to the location
    const map = (window as any).leafletMap;
    if (map) {
      map.flyTo(location.coordinates, 18);
      // Open the popup for this location
      setTimeout(() => {
        const markers = document.querySelectorAll('.leaflet-marker-icon');
        markers.forEach((marker) => {
          if (marker.getAttribute('title') === location.name) {
            marker.dispatchEvent(new Event('click'));
          }
        });
      }, 1000);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search locations..."
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          value={query}
          onChange={handleSearch}
          onFocus={() => setIsOpen(true)}
        />
      </div>
      {isOpen && results.length > 0 && (
        <div className="absolute mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {results.map((result) => (
            <button
              key={result.id}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleLocationSelect(result)}
            >
              <div className="flex-shrink-0">
                <Navigation className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-grow">
                <div className="font-medium text-gray-900 dark:text-white">
                  {result.name}
                </div>
                {result.description && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {result.description}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}