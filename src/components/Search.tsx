import { Search as SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { locations } from '../data/locations';

export function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof locations>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
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

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search locations..."
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          value={query}
          onChange={handleSearch}
        />
      </div>
      {results.length > 0 && (
        <div className="absolute mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {results.map((result) => (
            <button
              key={result.id}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                // Handle location selection
                setQuery('');
                setResults([]);
              }}
            >
              <div className="font-medium">{result.name}</div>
              {result.description && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {result.description}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}