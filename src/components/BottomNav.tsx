import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentRoute, navigate, currentUser, cartCalculations, favoriteRestaurantIds } = useApp();

  if (currentUser.role !== 'customer') {
    return null;
  }

  return (
    <>
      {/* Floating Sticky Cart Preview Bar on Mobile if items exist and not on cart/checkout */}
      {cartCalculations.itemCount > 0 && currentRoute !== '/cart' && currentRoute !== '/checkout' && (
        <div className="md:hidden fixed bottom-16 left-3 right-3 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            onClick={() => navigate('/cart')}
            className="w-full bg-zinc-900 text-white rounded-xl p-3 shadow-lg flex items-center justify-between hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                {cartCalculations.itemCount} {cartCalculations.itemCount === 1 ? 'item' : 'items'}
              </span>
              <span className="text-xs text-zinc-300">Added to Cart</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tabular-nums">₹{cartCalculations.total}</span>
              <span className="text-xs bg-white text-zinc-900 font-bold px-3 py-1 rounded-lg">View Cart</span>
            </div>
          </button>
        </div>
      )}

      {/* Main Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 py-1.5 px-2 flex items-center justify-around">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center py-1 px-3 transition-colors ${
            currentRoute === '/' ? 'text-orange-500 font-semibold' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => navigate('/search')}
          className={`flex flex-col items-center py-1 px-3 transition-colors ${
            currentRoute === '/search' ? 'text-orange-500 font-semibold' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Search</span>
        </button>

        <button
          onClick={() => navigate('/orders')}
          className={`flex flex-col items-center py-1 px-3 transition-colors ${
            currentRoute.startsWith('/orders') ? 'text-orange-500 font-semibold' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Orders</span>
        </button>

        <button
          onClick={() => navigate('/favorites')}
          className={`relative flex flex-col items-center py-1 px-3 transition-colors ${
            currentRoute === '/favorites' ? 'text-orange-500 font-semibold' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Favorites</span>
          {favoriteRestaurantIds.length > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center py-1 px-3 transition-colors ${
            currentRoute === '/profile' ? 'text-orange-500 font-semibold' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </nav>
    </>
  );
};
