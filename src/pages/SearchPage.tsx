import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FoodCard } from '../components/FoodCard';
import { RestaurantCard } from '../components/RestaurantCard';
import { Search, X, Star, Sparkles } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { foodItems, restaurants } = useApp();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'dishes' | 'restaurants'>('all');
  const [vegOnly, setVegOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  // Sync initial query from URL search params if present
  useEffect(() => {
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(hash.split('?')[1]);
    const q = urlParams.get('q');
    if (q) setQuery(q);
  }, []);

  const matchedFoods = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return foodItems.filter((f) => {
      const match =
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        (f.tags && f.tags.some((t) => t.toLowerCase().includes(q)));

      if (!match) return false;
      if (vegOnly && !f.isVeg) return false;
      if (f.price > maxPrice) return false;
      return true;
    });
  }, [foodItems, query, vegOnly, maxPrice]);

  const matchedRestaurants = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return restaurants.filter((r) => {
      const match =
        r.name.toLowerCase().includes(q) ||
        r.cuisine.some((c) => c.toLowerCase().includes(q)) ||
        r.area.toLowerCase().includes(q);

      if (!match) return false;
      if (vegOnly && !r.isVegOnly) return false;
      return true;
    });
  }, [restaurants, query, vegOnly]);

  const popularSearches = ['Biryani', 'Pizza', 'Dosa', 'Burgers', 'Pasta', 'Desserts', 'Healthy', 'Chai'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-20">
      {/* Search Bar Input */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center bg-white rounded-2xl shadow-sm border border-zinc-200/90 p-2 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
          <Search className="w-5 h-5 text-zinc-400 ml-3 shrink-0" />
          <input
            type="text"
            placeholder="Search for restaurants, biryani, pizza, desserts, burgers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Popular Tags */}
        {!query && (
          <div className="mt-4 text-center">
            <span className="text-xs text-zinc-400 mr-2">Popular searches:</span>
            <div className="inline-flex flex-wrap gap-1.5 justify-center mt-2">
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-orange-50 hover:text-orange-600 text-zinc-600 text-xs font-medium transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter and Tab Options */}
      {query && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'all' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              All Results ({matchedFoods.length + matchedRestaurants.length})
            </button>
            <button
              onClick={() => setActiveTab('dishes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'dishes' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Dishes ({matchedFoods.length})
            </button>
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'restaurants' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Restaurants ({matchedRestaurants.length})
            </button>
          </div>

          {/* Quick Filter Badges */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                vegOnly
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${vegOnly ? 'bg-white' : 'bg-emerald-600'}`} />
              <span>Veg Only</span>
            </button>

            <button
              onClick={() => setMaxPrice(maxPrice === 250 ? 1000 : 250)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                maxPrice === 250
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
              }`}
            >
              Under ₹250
            </button>
          </div>
        </div>
      )}

      {/* Results Section */}
      {query ? (
        <div className="space-y-10">
          {/* Restaurants section */}
          {(activeTab === 'all' || activeTab === 'restaurants') && matchedRestaurants.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900">
                Restaurants matching &quot;{query}&quot;
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            </div>
          )}

          {/* Dishes section */}
          {(activeTab === 'all' || activeTab === 'dishes') && matchedFoods.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900">
                Dishes matching &quot;{query}&quot;
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchedFoods.map((item) => (
                  <FoodCard key={item.id} item={item} showRestaurantName />
                ))}
              </div>
            </div>
          )}

          {matchedFoods.length === 0 && matchedRestaurants.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-zinc-900">No results found for &quot;{query}&quot;</h3>
              <p className="text-xs text-zinc-500">
                Try checking the spelling or searching for a broader term like &quot;Pizza&quot; or &quot;Biryani&quot;.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-zinc-800 text-base">Search for anything delicious</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Find items by dish name, restaurant brand, or favorite culinary ingredients.
          </p>
        </div>
      )}
    </div>
  );
};
