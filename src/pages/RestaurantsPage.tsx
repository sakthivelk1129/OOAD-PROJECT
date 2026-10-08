import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RestaurantCard } from '../components/RestaurantCard';
import { Search, SlidersHorizontal, Star, Clock, RotateCcw } from 'lucide-react';
import { FOOD_CATEGORIES } from '../data/mockData';

export const RestaurantsPage: React.FC = () => {
  const { restaurants } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [vegOnly, setVegOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number>(100);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'time' | 'price'>('recommended');

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      // Name & cuisine search
      const matchesSearch =
        !searchQuery.trim() ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        r.area.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Cuisine filter
      if (selectedCuisine !== 'all') {
        const matchesCuisine = r.cuisine.some(
          (c) => c.toLowerCase() === selectedCuisine.toLowerCase()
        );
        if (!matchesCuisine) return false;
      }

      // Veg only
      if (vegOnly && !r.isVegOnly) return false;

      // Min rating
      if (minRating > 0 && r.rating < minRating) return false;

      // Max delivery time
      if (maxDeliveryTime < 100 && r.deliveryTimeMinutes > maxDeliveryTime) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'time') return a.deliveryTimeMinutes - b.deliveryTimeMinutes;
      if (sortBy === 'price') {
        const priceOrder = { '₹': 1, '₹₹': 2, '₹₹₹': 3 };
        return priceOrder[a.priceLevel] - priceOrder[b.priceLevel];
      }
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [restaurants, searchQuery, selectedCuisine, vegOnly, minRating, maxDeliveryTime, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCuisine('all');
    setVegOnly(false);
    setMinRating(0);
    setMaxDeliveryTime(100);
    setSortBy('recommended');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-20">
      {/* Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">All Restaurants</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Browse through {restaurants.length} kitchens delivering delicious food right now
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search restaurants or cuisines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white rounded-xl border border-zinc-200 pl-10 pr-4 py-2 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 shadow-xs space-y-4">
        {/* Interactive Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pure Veg Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              vegOnly
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${vegOnly ? 'bg-white' : 'bg-emerald-600'}`} />
            <span>Pure Veg</span>
          </button>

          {/* Rating 4.0+ */}
          <button
            onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              minRating === 4.5
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>4.5+ Stars</span>
          </button>

          {/* Fast Delivery (< 30m) */}
          <button
            onClick={() => setMaxDeliveryTime(maxDeliveryTime === 30 ? 100 : 30)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              maxDeliveryTime === 30
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Under 30 mins</span>
          </button>

          {/* Reset Filters */}
          {(vegOnly || minRating > 0 || maxDeliveryTime < 100 || selectedCuisine !== 'all' || searchQuery) && (
            <button
              onClick={resetFilters}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Cuisine Filter Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-zinc-100 pt-3">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 mr-1">
            Cuisine:
          </span>
          {FOOD_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCuisine(cat.id === 'all' ? 'all' : cat.name)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                (cat.id === 'all' && selectedCuisine === 'all') || selectedCuisine === cat.name
                  ? 'bg-orange-50 text-orange-600 font-bold border border-orange-200'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-500">
          <span className="tabular-nums font-medium text-zinc-700">
            Showing {filteredRestaurants.length} restaurants
          </span>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-800 focus:outline-none"
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Rating: High to Low</option>
              <option value="time">Delivery Time: Fastest</option>
              <option value="price">Price: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Restaurant Cards Grid */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-zinc-900">No restaurants match your filters</h3>
            <p className="text-xs text-zinc-500 mt-1">Try relaxing filters or search with another keyword</p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-bold text-xs hover:bg-zinc-800 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
