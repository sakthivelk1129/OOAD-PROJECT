import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RestaurantCard } from '../components/RestaurantCard';
import { FoodCard } from '../components/FoodCard';
import { Heart, Utensils, UtensilsCrossed } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const {
    restaurants,
    foodItems,
    favoriteRestaurantIds,
    favoriteFoodIds,
    navigate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'restaurants' | 'dishes'>('restaurants');

  const favRestaurants = restaurants.filter((r) => favoriteRestaurantIds.includes(r.id));
  const favFoods = foodItems.filter((f) => favoriteFoodIds.includes(f.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-28">
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          <span>My Favorites</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Your bookmarked restaurants and most craved dishes
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('restaurants')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'restaurants'
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Favorite Restaurants ({favRestaurants.length})
        </button>
        <button
          onClick={() => setActiveTab('dishes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'dishes'
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Saved Dishes ({favFoods.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'restaurants' && (
        <>
          {favRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border border-zinc-200 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-900">No Favorite Restaurants Yet</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Tap the heart icon on any restaurant card to save your top dining spots!
                </p>
              </div>
              <button
                onClick={() => navigate('/restaurants')}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
              >
                Browse Restaurants
              </button>
            </div>
          )}
        </>
      )}

      {activeTab === 'dishes' && (
        <>
          {favFoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favFoods.map((item) => (
                <FoodCard key={item.id} item={item} showRestaurantName />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border border-zinc-200 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
                <UtensilsCrossed className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-900">No Saved Dishes Yet</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Click the heart icon on any mouth-watering dish in menus to save it here for fast re-ordering.
                </p>
              </div>
              <button
                onClick={() => navigate('/search')}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
              >
                Explore Menus
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
