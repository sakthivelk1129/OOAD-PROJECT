import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Search,
  ShoppingBag,
  User as UserIcon,
  Heart,
  Tag,
  Shield,
  ChefHat,
  Bike,
  ChevronDown,
  LogOut,
  UtensilsCrossed,
} from 'lucide-react';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const {
    currentRoute,
    navigate,
    currentUser,
    switchRole,
    cartCalculations,
    selectedLocation,
    setSelectedLocation,
    favoriteRestaurantIds,
  } = useApp();

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const LOCATIONS = [
    'Oakridge Midtown, Metro City',
    'Tech Innovation Tower, Financial District',
    'Green Meadows, North Suburbs',
    'Riverfront Promenade, West End',
  ];

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'restaurant':
        return <ChefHat className="w-4 h-4 text-amber-500" />;
      case 'delivery':
        return <Bike className="w-4 h-4 text-emerald-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-indigo-500" />;
      default:
        return <UserIcon className="w-4 h-4 text-orange-500" />;
    }
  };

  const getRoleBadgeLabel = (role: UserRole) => {
    switch (role) {
      case 'restaurant':
        return 'Restaurant Partner';
      case 'delivery':
        return 'Delivery Rider';
      case 'admin':
        return 'Platform Admin';
      default:
        return 'Customer';
    }
  };

  const isCustomer = currentUser.role === 'customer';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      {/* Role Switcher Announcement Bar for Quick Demo Navigation */}
      <div className="bg-zinc-900 text-zinc-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-zinc-400 hidden sm:inline">Active View:</span>
            <span className="font-semibold text-white uppercase tracking-wider text-[11px]">
              {currentUser.role} · {currentUser.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 text-[11px] hidden md:inline">Switch Role:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => switchRole('customer')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  currentUser.role === 'customer'
                    ? 'bg-orange-500 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:text-white'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => switchRole('restaurant')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  currentUser.role === 'restaurant'
                    ? 'bg-amber-500 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:text-white'
                }`}
              >
                Restaurant
              </button>
              <button
                onClick={() => switchRole('delivery')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  currentUser.role === 'delivery'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:text-white'
                }`}
              >
                Delivery
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  currentUser.role === 'admin'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand & Location */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(isCustomer ? '/' : `/${currentUser.role}-dashboard`)}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:bg-orange-600 transition-colors">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-zinc-900 flex items-center">
                  Quick<span className="text-orange-500">Bite</span>
                </span>
              </div>
            </button>

            {/* Location Selector (Customer view) */}
            {isCustomer && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-900 font-medium py-1.5 px-2.5 rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors bg-zinc-50/50"
                >
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className="truncate max-w-[200px]">{selectedLocation}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
                </button>

                {isLocationOpen && (
                  <div className="absolute left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-zinc-200 py-2 z-50">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Select Delivery Address
                    </div>
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setIsLocationOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-orange-50 transition-colors ${
                          selectedLocation === loc ? 'font-semibold text-orange-600 bg-orange-50/50' : 'text-zinc-700'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">{loc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Zone 2: Navigation Links (Customer View) */}
          {isCustomer ? (
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-zinc-600">
              <button
                onClick={() => navigate('/')}
                className={`transition-colors hover:text-zinc-900 ${
                  currentRoute === '/' ? 'text-orange-500 font-semibold' : ''
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate('/restaurants')}
                className={`transition-colors hover:text-zinc-900 ${
                  currentRoute.startsWith('/restaurants') ? 'text-orange-500 font-semibold' : ''
                }`}
              >
                Restaurants
              </button>
              <button
                onClick={() => navigate('/offers')}
                className={`flex items-center gap-1.5 transition-colors hover:text-zinc-900 ${
                  currentRoute === '/offers' ? 'text-orange-500 font-semibold' : ''
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                <span>Offers</span>
              </button>
              <button
                onClick={() => navigate('/orders')}
                className={`transition-colors hover:text-zinc-900 ${
                  currentRoute.startsWith('/orders') ? 'text-orange-500 font-semibold' : ''
                }`}
              >
                My Orders
              </button>
              <button
                onClick={() => navigate('/favorites')}
                className={`flex items-center gap-1.5 transition-colors hover:text-zinc-900 ${
                  currentRoute === '/favorites' ? 'text-orange-500 font-semibold' : ''
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Favorites ({favoriteRestaurantIds.length})</span>
              </button>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-4 text-sm font-medium">
              <span className="text-zinc-500">
                Dashboard Mode: <span className="text-zinc-900 font-semibold capitalize">{currentUser.role}</span>
              </span>
            </div>
          )}

          {/* Zone 3: Actions (Search, Cart, Profile) */}
          <div className="flex items-center gap-3">
            {isCustomer && (
              <>
                <button
                  onClick={() => navigate('/search')}
                  className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                  title="Search dishes & restaurants"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Cart Button */}
                <button
                  onClick={() => navigate('/cart')}
                  className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 font-medium text-sm transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Cart</span>
                  {cartCalculations.itemCount > 0 && (
                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-orange-500 rounded-full">
                      {cartCalculations.itemCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center">
                  {getRoleIcon(currentUser.role)}
                </div>
                <span className="text-xs font-semibold text-zinc-800 hidden sm:inline max-w-[100px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-zinc-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-zinc-100">
                    <p className="text-sm font-semibold text-zinc-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{currentUser.email}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-700">
                      {getRoleIcon(currentUser.role)}
                      <span>{getRoleBadgeLabel(currentUser.role)}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    {isCustomer ? (
                      <>
                        <button
                          onClick={() => {
                            navigate('/profile');
                            setIsRoleDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                          <span>My Profile & Addresses</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate('/orders');
                            setIsRoleDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Order History & Bills</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate('/favorites');
                            setIsRoleDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                        >
                          <Heart className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Saved Favorites</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          navigate(`/${currentUser.role}-dashboard`);
                          setIsRoleDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 font-medium text-orange-600"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Go to {currentUser.role.toUpperCase()} Dashboard</span>
                      </button>
                    )}
                  </div>

                  <div className="border-t border-zinc-100 pt-1">
                    <button
                      onClick={() => {
                        navigate('/login');
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-zinc-600 hover:bg-zinc-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Switch Account / Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
