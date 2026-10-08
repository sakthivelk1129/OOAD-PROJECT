import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RestaurantCard } from '../components/RestaurantCard';
import { FoodCard } from '../components/FoodCard';
import {
  HERO_FOOD_SPREAD,
  FOOD_CATEGORIES,
} from '../data/mockData';
import {
  Search,
  ArrowRight,
  Sparkles,
  Flame,
  Clock,
  ShieldCheck,
  Percent,
  CheckCircle,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate, restaurants, foodItems, orders } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  // Filter restaurants by category if selected
  const filteredRestaurants = restaurants.filter((r) => {
    if (selectedCategory === 'all') return true;
    return r.cuisine.some((c) => c.toLowerCase().includes(selectedCategory.toLowerCase()));
  });

  const popularRestaurants = filteredRestaurants.slice(0, 6);
  const recommendedFoods = foodItems.filter((f) => f.isBestSeller).slice(0, 4);

  // Recently ordered dishes from past orders
  const pastOrderedItems = orders.flatMap((o) => o.items).slice(0, 3);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/60 to-white pt-8 pb-12 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/80 text-orange-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Superfast Food Delivery in Metro City</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 tracking-tight leading-[1.1] text-balance">
                Crave it? Get it{' '}
                <span className="text-orange-500 underline decoration-orange-300 decoration-wavy decoration-2">
                  delivered hot
                </span>{' '}
                in minutes.
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 max-w-xl leading-relaxed">
                Discover artisan woodfired pizzas, fragrant handi biryanis, authentic Chettinad dosas, and fresh bakery treats from top chefs.
              </p>

              {/* Fast Search Input in Hero */}
              <form onSubmit={handleSearchSubmit} className="relative max-w-lg">
                <div className="relative flex items-center bg-white rounded-2xl shadow-md border border-zinc-200/90 p-1.5 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent transition-all">
                  <Search className="w-5 h-5 text-zinc-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search restaurant, dish, or cuisine (e.g., Biryani, Pizza)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shrink-0 shadow-sm"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>25-35 min Average Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Hygiene Certified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Live GPS Tracking</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/70 aspect-[4/3] bg-zinc-100">
                <img
                  src={HERO_FOOD_SPREAD}
                  alt="Delicious culinary spread"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
                      Curated Daily
                    </span>
                    <h3 className="text-lg font-bold">10+ Premium Local Cuisines</h3>
                    <p className="text-xs text-zinc-200">Cooked fresh on order, packed with insulated thermal bags</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Food Categories Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Explore by Cuisine</h2>
            <p className="text-xs text-zinc-500">Find your favorite cravings in a tap</p>
          </div>
          <button
            onClick={() => navigate('/restaurants')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>See All Restaurants</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {FOOD_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.name || (cat.id === 'all' && selectedCategory === 'all');
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id === 'all' ? 'all' : cat.name)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
              <Percent className="w-3.5 h-3.5" />
              <span>Flat 50% OFF up to ₹100</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hungry? Enjoy your first order on us!
            </h3>
            <p className="text-xs sm:text-sm text-orange-100">
              Use code <span className="font-mono font-bold bg-white/25 px-2 py-0.5 rounded">WELCOME50</span> at checkout on orders above ₹199.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/offers')}
              className="bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all active:scale-95"
            >
              View All Promo Codes
            </button>
          </div>
        </div>
      </section>

      {/* Popular Restaurants Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span>Popular Restaurants Near You</span>
            </h2>
            <p className="text-xs text-zinc-500">Hand-picked by foodies and rated 4.5+ stars</p>
          </div>
          <button
            onClick={() => navigate('/restaurants')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>View All ({restaurants.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* Recommended Food Dishes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Recommended Bestsellers
            </h2>
            <p className="text-xs text-zinc-500">Most loved culinary masterworks ready to order</p>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedFoods.map((item) => (
            <FoodCard key={item.id} item={item} showRestaurantName />
          ))}
        </div>
      </section>

      {/* Recently Ordered Quick Reorder Banner (if user has orders) */}
      {pastOrderedItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-zinc-50 border border-zinc-200/80 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-zinc-900">Recently Ordered</h3>
                <p className="text-xs text-zinc-500">Quick reorder your previous favorites</p>
              </div>
              <button
                onClick={() => navigate('/orders')}
                className="text-xs font-bold text-orange-600 hover:underline"
              >
                Order History →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {pastOrderedItems.map((it, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-xl border border-zinc-200 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="truncate">
                    <p className="text-xs font-bold text-zinc-800 truncate">{it.name}</p>
                    <p className="text-[11px] text-zinc-500 tabular-nums">₹{it.price}</p>
                  </div>
                  <button
                    onClick={() => {
                      const match = foodItems.find((f) => f.id === it.foodItemId);
                      if (match) {
                        navigate(`/restaurant/${match.restaurantId}`);
                      }
                    }}
                    className="shrink-0 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Clean Footer */}
      <footer className="border-t border-zinc-200 pt-12 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-zinc-900 text-sm mb-3">QuickBite</h4>
            <p className="text-zinc-500 leading-relaxed">
              Order delicious food from your favorite neighborhood restaurants delivered with speed and care.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-zinc-900 text-sm mb-3">Company</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/restaurants')} className="hover:text-zinc-900">Explore Restaurants</button></li>
              <li><button onClick={() => navigate('/offers')} className="hover:text-zinc-900">Offers & Coupons</button></li>
              <li><button onClick={() => navigate('/orders')} className="hover:text-zinc-900">Track Orders</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-zinc-900 text-sm mb-3">Partner Roles</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/restaurant-dashboard')} className="hover:text-zinc-900">Restaurant Partner Portal</button></li>
              <li><button onClick={() => navigate('/delivery-dashboard')} className="hover:text-zinc-900">Delivery Fleet Rider</button></li>
              <li><button onClick={() => navigate('/admin')} className="hover:text-zinc-900">Admin Operations Console</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-zinc-900 text-sm mb-3">Operating Hubs</h4>
            <p className="text-zinc-500 leading-relaxed">
              Serving Midtown, Riverfront, Old Quarter, Green Meadows, and Financial District 24/7.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 QuickBite Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] text-zinc-400">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>FSSAI Certified</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
