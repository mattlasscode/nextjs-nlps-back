import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

interface SearchBarProps {
  apiKey: string;
  onResultClick?: (product: any) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  apiKey,
  onResultClick,
  placeholder = 'Search products...',
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: debouncedQuery,
            apiKey,
          }),
        });

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setResults(data.products);
      } catch (err) {
        setError('Failed to search products');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    searchProducts();
  }, [debouncedQuery, apiKey]);

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="absolute top-full left-0 mt-1 text-red-500 text-sm">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((product) => (
            <div
              key={product.id}
              className="p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => onResultClick?.(product)}
            >
              <div className="flex items-center space-x-3">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-medium">{product.title}</h3>
                  {product.price && (
                    <p className="text-sm text-gray-600">{product.price}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 