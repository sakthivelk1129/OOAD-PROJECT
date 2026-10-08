import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { FoodCard } from '../components/FoodCard';
import {
  Star,
  Clock,
  Bike,
  MapPin,
  Heart,
  Search,
  ArrowLeft,
  ShoppingBag,
  Percent,
} from 'lucide-react';

interface RestaurantDetailPageProps {
  restaurantId: string;
}

export const RestaurantDetailPage: React.FC<RestaurantDetailPageProps> = ({ restaurantId }) => {
  const {
    restaurants,
    foodItems,
    navigate,
    cartCalculations,
    cart,
    favoriteRestaurantIds,
    toggleFavoriteRestaurant,
  } = useApp();

  const [menuSearch, setMenuSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [vegOnly, setVegOnly] = useState(false);

  const restaurant = restaurants.find((r) => r.id === restaurantId);

  // Extract menu for this restaurant
  const items = useMemo(() => {
    return foodItems.filter((f) => f.restaurantId === restaurantId);
  }, [foodItems, restaurantId]);

  // Unique categories for this restaurant
  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ['all', ...Array.from(set)];
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (vegOnly && !item.isVeg) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (menuSearch.trim()) {
        const query = menuSearch.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(query)))
        );
      }
      return true;
    });
  }, [items, vegOnly, selectedCategory, menuSearch]);

  // Group filtered items by category
  const groupedItems = useMemo(() => {
    const groups: { [cat: string]: typeof filteredItems } = {};
    filteredItems.forEach((it) => {
      if (!groups[it.category]) groups[it.category] = [];
      groups[it.category].push(it);
    });
    return groups;
  }, [filteredItems]);

  if (!restaurant) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">Restaurant Not Found</h2>
        <p className="text-xs text-zinc-500">The kitchen you are looking for is currently unavailable.</p>
        <button
          onClick={() => navigate('/restaurants')}
          className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs"
        >
          Back to Restaurants
        </button>
      </div>
    );
  }

  const isFavorite = favoriteRestaurantIds.includes(restaurant.id);
  const isCartFromThisRest = cart.length > 0 && cart[0].restaurantId === restaurant.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-28">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/restaurants')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Restaurants</span>
        </button>
      </div>

      {/* Restaurant Header Banner Card */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-200/80 bg-white shadow-sm">
        {/* Banner Cover Photo */}
        <div className="relative h-48 sm:h-64 w-full bg-zinc-900">
          <img
            src={restaurant.heroImage}
            alt={restaurant.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-85"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top Floating Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => toggleFavoriteRestaurant(restaurant.id)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-zinc-700 hover:text-rose-500 shadow-md transition-colors"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </button>
          </div>

          {/* Banner Title Overlay on Mobile/Desktop */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {restaurant.isVegOnly && (
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  PURE VEG
                </span>
              )}
              {restaurant.activeOffer && (
                <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <Percent className="w-3 h-3" />
                  <span>{restaurant.activeOffer}</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {restaurant.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-200 line-clamp-1 mt-0.5">
              {restaurant.tagLine}
            </p>
          </div>
        </div>

        {/* Detailed Metadata Strip */}
        <div className="p-6 bg-white flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-zinc-600">
            {/* Rating */}
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-xl font-bold">
              <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
              <span className="text-sm">{restaurant.rating}</span>
              <span className="text-emerald-600/70 text-[11px]">({restaurant.ratingCount}+ ratings)</span>
            </div>

            <div className="flex items-center gap-1 text-zinc-700 font-medium">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span>{restaurant.deliveryTimeMinutes} mins</span>
            </div>

            <div className="flex items-center gap-1 text-zinc-700 font-medium">
              <Bike className="w-4 h-4 text-zinc-400" />
              <span>{restaurant.deliveryFee === 0 ? 'Free Delivery' : `₹${restaurant.deliveryFee} Fee`}</span>
            </div>

            <div className="flex items-center gap-1 text-zinc-700 font-medium">
              <MapPin className="w-4 h-4 text-zinc-400" />
              <span>{restaurant.address}, {restaurant.area}</span>
            </div>
          </div>

          <div className="text-zinc-500 font-medium">
            <span>Cuisines: </span>
            <span className="text-zinc-900 font-bold">{restaurant.cuisine.join(' · ')}</span>
          </div>
        </div>
      </div>

      {/* Menu Filter & Search Bar */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200/80 p-3 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Menu Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search in this menu (e.g. biryani, pizza, dosa)..."
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Veg Only Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
              vegOnly
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${vegOnly ? 'bg-white' : 'bg-emerald-600'}`} />
            <span>Veg Only</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-zinc-100 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {cat === 'all' ? 'All Dishes' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Dishes List */}
      <div className="space-y-8">
        {Object.keys(groupedItems).length > 0 ? (
          Object.entries(groupedItems).map(([categoryName, catItems]) => (
            <div key={categoryName} className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2">
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                  {categoryName}
                </h3>
                <span className="text-xs text-zinc-400 font-medium tabular-nums">
                  {catItems.length} {catItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catItems.map((item) => (
                  <FoodCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 max-w-md mx-auto space-y-3">
            <h3 className="font-bold text-zinc-900 text-base">No dishes found</h3>
            <p className="text-xs text-zinc-500">
              No items match &quot;{menuSearch}&quot; in {selectedCategory === 'all' ? 'this restaurant' : selectedCategory}.
            </p>
            <button
              onClick={() => {
                setMenuSearch('');
                setSelectedCategory('all');
                setVegOnly(false);
              }}
              className="text-xs font-bold text-orange-600 hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Sticky Bottom Quick Cart Bar if current cart items belong to this restaurant */}
      {isCartFromThisRest && cartCalculations.itemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-40 animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={() => navigate('/cart')}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center font-bold text-xs">
                {cartCalculations.itemCount}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold">Dishes added to bag</p>
                <p className="text-[11px] text-zinc-400">Total: ₹{cartCalculations.total} (incl. taxes)</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-white text-zinc-900 px-3.5 py-1.5 rounded-xl">
                Proceed to Cart →
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
