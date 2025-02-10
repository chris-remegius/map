import React from 'react';
import { Map } from './components/Map';
import { Search } from './components/Search';
import { ThemeToggle } from './components/ThemeToggle';
import { Navigation } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Navigation className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Karunya Nagar Map
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Search />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="pt-16">
        <Map />
      </main>
    </div>
  );
}

export default App;