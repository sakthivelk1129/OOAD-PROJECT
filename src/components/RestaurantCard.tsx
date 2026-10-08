import React from 'react';
import { Restaurant } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Clock, Heart, Bike } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { navigate, favoriteRestaurantIds, toggleFavoriteRestaurant } = useApp();
  const isFavorite = favoriteRestaurantIds.includes(restaurant.id);

  return (
    <div
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-zinc-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col"
    >
      {/* Restaurant Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
        <img
          src={restaurant.heroImage}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback gracefully to styled placeholder if ever blocked
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteRestaurant(restaurant.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-zinc-600 hover:text-rose-500 hover:bg-white shadow-sm transition-colors"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
          />
        </button>

        {/* Discount/Offer banner badge on image */}
        {restaurant.activeOffer && (
          <div className="absolute bottom-2.5 left-2.5 bg-zinc-900/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
            {restaurant.activeOffer}
          </div>
        )}

        {restaurant.isVegOnly && (
          <div className="absolute top-3 left-3 bg-emerald-700/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            PURE VEG
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base text-zinc-900 tracking-tight line-clamp-1 group-hover:text-orange-600 transition-colors">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-xs font-bold shrink-0">
              <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              <span>{restaurant.rating}</span>
            </div>
          </div>

          {/* Cuisine text metadata with · separators */}
          <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500 line-clamp-1">
            <span>{restaurant.cuisine.join(', ')}</span>
            <span aria-hidden="true">·</span>
            <span>{restaurant.priceLevel}</span>
          </div>

          <p className="mt-1.5 text-xs text-zinc-400 line-clamp-1">
            {restaurant.tagLine}
          </p>
        </div>

        {/* Delivery metadata row */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-medium text-zinc-700">{restaurant.deliveryTimeMinutes} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <Bike className="w-3.5 h-3.5 text-zinc-400" />
            <span>{restaurant.deliveryFee === 0 ? 'Free Delivery' : `₹${restaurant.deliveryFee} delivery`}</span>
          </div>
          <span className="text-zinc-400 truncate max-w-[90px]">{restaurant.area}</span>
        </div>
      </div>
    </div>
  );
};
