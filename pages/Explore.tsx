import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { db } from '../services/db';
import { Creator, User } from '../types';
import { Search, Loader2, User as UserIcon, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Explore: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(Creator | User)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const data = await db.searchUsers(query);
      setResults(data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 min-h-screen">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Explore</h1>
          <p className="text-gray-400 text-sm">Find your favorite creators and friends.</p>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            placeholder="Search by name or @handle..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Loader2 className="h-5 w-5 text-brand-500 animate-spin" />
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-4">
          {results.length > 0 ? (
            results.map((user) => (
              <Link 
                key={user.id} 
                to={user.id.startsWith('c') ? `/creator/${user.id}` : '#'}
                className="flex items-center justify-between p-4 bg-dark-800/50 border border-dark-700 rounded-xl hover:bg-dark-800 hover:border-brand-500/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-12 h-12 rounded-full object-cover border border-dark-600 group-hover:border-brand-500 transition-colors"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-white">{user.name}</h3>
                      {'isVerified' in user && user.isVerified && (
                        <BadgeCheck className="w-4 h-4 text-blue-400 fill-blue-400/10" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{user.handle}</p>
                  </div>
                </div>
                
                {'price' in user ? (
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-brand-500/10 text-brand-500 text-xs font-bold rounded-full border border-brand-500/20">
                      Creator
                    </span>
                  </div>
                ) : (
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-dark-700 text-gray-400 text-xs font-medium rounded-full">
                      User
                    </span>
                  </div>
                )}
              </Link>
            ))
          ) : (
            hasSearched && !isLoading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No users found</h3>
                <p className="text-gray-500 text-sm">Try searching for a different name or handle.</p>
              </div>
            )
          )}
        </div>
      </div>
    </Layout>
  );
};