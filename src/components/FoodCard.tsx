import React from 'react';
import { FoodItem } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Plus, Minus, Heart } from 'lucide-react';

interface FoodCardProps {
  item: FoodItem;
  showRestaurantName?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, showRestaurantName = false }) => {
  const {
    cart,
    addToCart,
    updateCartQuantity,
    restaurants,
    favoriteFoodIds,
    toggleFavoriteFood,
  } = useApp();

  const cartItem = cart.find((ci) => ci.foodItemId === item.id);
  const isFavorite = favoriteFoodIds.includes(item.id);
  const restaurant = showRestaurantName
    ? restaurants.find((r) => r.id === item.restaurantId)
    : null;

  return (
    <div className="relative bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between gap-4">
      {/* Left Info Column */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Veg / Non-Veg Standard Indicator */}
          <div className="flex items-center gap-2 mb-1.5">
            <div
              className={`w-4 h-4 border-2 rounded-[3px] flex items-center justify-center p-[2px] ${
                item.isVeg ? 'border-emerald-600' : 'border-rose-700'
              }`}
              title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  item.isVeg ? 'bg-emerald-600' : 'bg-rose-700'
                }`}
              />
            </div>

            {item.isBestSeller && (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Bestseller
              </span>
            )}

            {showRestaurantName && restaurant && (
              <span className="text-xs text-zinc-500 font-medium">
                from <span className="text-zinc-800">{restaurant.name}</span>
              </span>
            )}
          </div>

          {/* Name & Favorite Button */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-base text-zinc-900">{item.name}</h4>
            <button
              onClick={() => toggleFavoriteFood(item.id)}
              className="text-zinc-400 hover:text-rose-500 p-1 transition-colors"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </button>
          </div>

          {/* Price & Rating */}
          <div className="mt-1 flex items-center gap-2.5">
            <span className="text-sm font-extrabold text-zinc-900 tabular-nums">
              ₹{item.price}
            </span>
            {item.originalPrice && (
              <span className="text-xs text-zinc-400 line-through tabular-nums">
                ₹{item.originalPrice}
              </span>
            )}
            <div className="flex items-center gap-1 text-xs text-zinc-600">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{item.rating}</span>
              <span className="text-zinc-400">({item.ratingCount})</span>
            </div>
          </div>

          {/* Description */}
          <p className="mt-2 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-400">
            {item.tags.join(' · ')}
          </div>
        )}
      </div>

      {/* Right Column: Image + Add Button */}
      <div className="relative shrink-0 flex flex-col items-center sm:w-32">
        <div className="w-full h-28 sm:h-24 rounded-xl overflow-hidden bg-zinc-100 relative">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-white text-[11px] font-bold px-2 py-1 bg-zinc-800/90 rounded">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Action Button: Stepper or ADD */}
        <div className="mt-2 w-full flex justify-center">
          {!item.isAvailable ? (
            <span className="text-xs font-medium text-zinc-400 py-1.5">Currently Unavailable</span>
          ) : cartItem ? (
            <div className="flex items-center justify-between bg-zinc-900 text-white rounded-xl px-2 py-1 shadow-sm w-full max-w-[120px]">
              <button
                onClick={() => updateCartQuantity(item.id, -1)}
                className="p-1 hover:text-orange-400 transition-colors"
                title="Decrease"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold tabular-nums px-2">{cartItem.quantity}</span>
              <button
                onClick={() => updateCartQuantity(item.id, 1)}
                className="p-1 hover:text-orange-400 transition-colors"
                title="Increase"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(item, 1)}
              className="w-full max-w-[120px] bg-white border border-orange-500 text-orange-600 hover:bg-orange-50 font-bold text-xs py-1.5 px-4 rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <span>ADD</span>
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
