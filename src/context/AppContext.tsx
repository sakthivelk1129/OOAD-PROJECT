import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  Restaurant,
  FoodItem,
  CartItem,
  Order,
  OrderStatus,
  Coupon,
  Address,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_RESTAURANTS,
  INITIAL_FOOD_ITEMS,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
} from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface CartCalculations {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  total: number;
  itemCount: number;
}

interface AppContextType {
  // Navigation & URL
  currentRoute: string;
  navigate: (route: string) => void;

  // Auth & Roles
  currentUser: User;
  switchRole: (role: UserRole, specificUserId?: string) => void;
  users: User[];
  updateUserProfile: (data: Partial<User>) => void;
  toggleUserStatus: (userId: string) => void;
  addSavedAddress: (address: Omit<Address, 'id'>) => void;
  deleteSavedAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;

  // Restaurants & Menu
  restaurants: Restaurant[];
  activeRestaurant: Restaurant | null;
  addRestaurant: (restaurant: Omit<Restaurant, 'id'>) => void;
  updateRestaurant: (id: string, data: Partial<Restaurant>) => void;
  foodItems: FoodItem[];
  addFoodItem: (item: Omit<FoodItem, 'id'>) => void;
  updateFoodItem: (id: string, data: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
  toggleFoodAvailability: (id: string) => void;

  // Cart
  cart: CartItem[];
  cartRestaurant: Restaurant | null;
  addToCart: (item: FoodItem, quantity?: number, instructions?: string) => { replaced: boolean };
  removeFromCart: (foodItemId: string) => void;
  updateCartQuantity: (foodItemId: string, delta: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartCalculations: CartCalculations;

  // Orders
  orders: Order[];
  placeOrder: (details: {
    address: Address;
    paymentMethod: 'upi' | 'card' | 'cod';
    instructions?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  advanceOrderStage: (orderId: string) => void;

  // Favorites
  favoriteRestaurantIds: string[];
  favoriteFoodIds: string[];
  toggleFavoriteRestaurant: (restaurantId: string) => void;
  toggleFavoriteFood: (foodId: string) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;

  // UI & Location
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'qb_current_user',
  USERS: 'qb_users',
  RESTAURANTS: 'qb_restaurants',
  FOOD_ITEMS: 'qb_food_items',
  CART: 'qb_cart',
  COUPONS: 'qb_coupons',
  APPLIED_COUPON: 'qb_applied_coupon',
  ORDERS: 'qb_orders',
  FAV_RESTAURANTS: 'qb_fav_restaurants',
  FAV_FOODS: 'qb_fav_foods',
  SELECTED_LOCATION: 'qb_selected_location',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation State from Hash
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/';
  });

  const navigate = (route: string) => {
    const formatted = route.startsWith('/') ? route : `/${route}`;
    window.location.hash = formatted;
    setCurrentRoute(formatted);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      setCurrentRoute(hash || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Location
  const [selectedLocation, setSelectedLocation] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_LOCATION) || 'Oakridge Midtown, Metro City';
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_LOCATION, selectedLocation);
  }, [selectedLocation]);

  // Users & Current User
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    return stored ? JSON.parse(stored) : INITIAL_USERS;
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse current user', e);
      }
    }
    return INITIAL_USERS[0]; // Alex Rivera (Customer)
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  const switchRole = (role: UserRole, specificUserId?: string) => {
    let target = users.find((u) => (specificUserId ? u.id === specificUserId : u.role === role));
    if (!target) {
      // Create a default if not found
      target = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    }
    setCurrentUser(target);
    showToast(`Switched view to ${role.toUpperCase()}: ${target.name}`, 'info');

    // Route dynamically to role dashboard if needed
    if (role === 'customer') {
      if (currentRoute.startsWith('/admin') || currentRoute.startsWith('/restaurant') || currentRoute.startsWith('/delivery')) {
        navigate('/');
      }
    } else if (role === 'restaurant') {
      navigate('/restaurant-dashboard');
    } else if (role === 'delivery') {
      navigate('/delivery-dashboard');
    } else if (role === 'admin') {
      navigate('/admin');
    }
  };

  const updateUserProfile = (data: Partial<User>) => {
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    showToast('Profile information updated successfully');
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'suspended' ? 'active' : 'suspended';
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
    showToast('User account status updated');
  };

  const addSavedAddress = (addressData: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    const updatedAddresses = [...(currentUser.savedAddresses || []), newAddress];
    updateUserProfile({ savedAddresses: updatedAddresses });
  };

  const deleteSavedAddress = (addressId: string) => {
    const updatedAddresses = (currentUser.savedAddresses || []).filter((a) => a.id !== addressId);
    updateUserProfile({ savedAddresses: updatedAddresses });
  };

  const setDefaultAddress = (addressId: string) => {
    const updatedAddresses = (currentUser.savedAddresses || []).map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    updateUserProfile({ savedAddresses: updatedAddresses });
  };

  // Restaurants
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.RESTAURANTS);
    return stored ? JSON.parse(stored) : INITIAL_RESTAURANTS;
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
  }, [restaurants]);

  const addRestaurant = (restaurantData: Omit<Restaurant, 'id'>) => {
    const newRest: Restaurant = {
      ...restaurantData,
      id: `rest-${Date.now()}`,
    };
    setRestaurants((prev) => [newRest, ...prev]);
    showToast(`Restaurant "${newRest.name}" added successfully`);
  };

  const updateRestaurant = (id: string, data: Partial<Restaurant>) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data } : r))
    );
    showToast('Restaurant details updated');
  };

  // Food Items
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS);
    return stored ? JSON.parse(stored) : INITIAL_FOOD_ITEMS;
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(foodItems));
  }, [foodItems]);

  const addFoodItem = (itemData: Omit<FoodItem, 'id'>) => {
    const newItem: FoodItem = {
      ...itemData,
      id: `food-${Date.now()}`,
    };
    setFoodItems((prev) => [newItem, ...prev]);
    showToast(`"${newItem.name}" added to menu`);
  };

  const updateFoodItem = (id: string, data: Partial<FoodItem>) => {
    setFoodItems((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...data } : f))
    );
    showToast('Item updated successfully');
  };

  const deleteFoodItem = (id: string) => {
    setFoodItems((prev) => prev.filter((f) => f.id !== id));
    showToast('Item removed from menu');
  };

  const toggleFoodAvailability = (id: string) => {
    setFoodItems((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const updated = !f.isAvailable;
          showToast(`"${f.name}" marked as ${updated ? 'Available' : 'Sold Out'}`);
          return { ...f, isAvailable: updated };
        }
        return f;
      })
    );
  };

  // Favorites
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.FAV_RESTAURANTS);
    return stored ? JSON.parse(stored) : ['rest-1', 'rest-2'];
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAV_RESTAURANTS, JSON.stringify(favoriteRestaurantIds));
  }, [favoriteRestaurantIds]);

  const toggleFavoriteRestaurant = (restaurantId: string) => {
    setFavoriteRestaurantIds((prev) => {
      const exists = prev.includes(restaurantId);
      const next = exists ? prev.filter((id) => id !== restaurantId) : [...prev, restaurantId];
      showToast(exists ? 'Removed from favorites' : 'Saved to favorite restaurants');
      return next;
    });
  };

  const [favoriteFoodIds, setFavoriteFoodIds] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.FAV_FOODS);
    return stored ? JSON.parse(stored) : ['food-101', 'food-201'];
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAV_FOODS, JSON.stringify(favoriteFoodIds));
  }, [favoriteFoodIds]);

  const toggleFavoriteFood = (foodId: string) => {
    setFavoriteFoodIds((prev) => {
      const exists = prev.includes(foodId);
      const next = exists ? prev.filter((id) => id !== foodId) : [...prev, foodId];
      showToast(exists ? 'Removed from favorites' : 'Added dish to favorites');
      return next;
    });
  };

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.COUPONS);
    return stored ? JSON.parse(stored) : INITIAL_COUPONS;
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    showToast(`Coupon code ${coupon.code} activated`);
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    showToast(`Coupon ${code} removed`);
  };

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.APPLIED_COUPON);
    return stored ? JSON.parse(stored) : null;
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLIED_COUPON, JSON.stringify(appliedCoupon));
  }, [appliedCoupon]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CART);
    return stored ? JSON.parse(stored) : [];
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  const cartRestaurant = cart.length > 0 ? restaurants.find((r) => r.id === cart[0].restaurantId) || null : null;

  const addToCart = (item: FoodItem, quantity = 1, instructions = ''): { replaced: boolean } => {
    let replaced = false;
    // Check if cart has items from another restaurant
    if (cart.length > 0 && cart[0].restaurantId !== item.restaurantId) {
      // Clear previous restaurant items and start fresh
      replaced = true;
      setCart([
        {
          foodItemId: item.id,
          restaurantId: item.restaurantId,
          name: item.name,
          price: item.price,
          quantity,
          isVeg: item.isVeg,
          image: item.image,
          specialInstructions: instructions,
        },
      ]);
      setAppliedCoupon(null);
      showToast(`Cart refreshed with dishes from ${restaurants.find((r) => r.id === item.restaurantId)?.name || 'new restaurant'}`);
      return { replaced: true };
    }

    setCart((prev) => {
      const existing = prev.find((ci) => ci.foodItemId === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.foodItemId === item.id
            ? { ...ci, quantity: ci.quantity + quantity, specialInstructions: instructions || ci.specialInstructions }
            : ci
        );
      }
      return [
        ...prev,
        {
          foodItemId: item.id,
          restaurantId: item.restaurantId,
          name: item.name,
          price: item.price,
          quantity,
          isVeg: item.isVeg,
          image: item.image,
          specialInstructions: instructions,
        },
      ];
    });
    showToast(`Added ${item.name} to cart`);
    return { replaced: false };
  };

  const removeFromCart = (foodItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.foodItemId !== foodItemId));
  };

  const updateCartQuantity = (foodItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((ci) => {
          if (ci.foodItemId === foodItemId) {
            const nextQty = ci.quantity + delta;
            return nextQty > 0 ? { ...ci, quantity: nextQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === cleanCode && c.isActive);

    if (!found) {
      showToast('Invalid or expired coupon code', 'error');
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    const subtotal = cart.reduce((acc, it) => acc + it.price * it.quantity, 0);

    if (subtotal < found.minOrder) {
      const msg = `Minimum order amount of ₹${found.minOrder} required for ${found.code}.`;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    if (found.restaurantId && cartRestaurant && found.restaurantId !== cartRestaurant.id) {
      const msg = `Coupon ${found.code} is valid only for specific restaurants.`;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied successfully!`);
    return { success: true, message: `Coupon ${found.code} applied!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // Cart Calculations
  const cartCalculations: CartCalculations = (() => {
    const subtotal = cart.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const itemCount = cart.reduce((acc, it) => acc + it.quantity, 0);

    let discount = 0;
    if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
      const rawDiscount = (subtotal * appliedCoupon.discountPercent) / 100;
      discount = Math.min(rawDiscount, appliedCoupon.maxDiscount);
    }

    const deliveryFee = subtotal > 0 ? (cartRestaurant?.deliveryFee ?? 25) : 0;
    const platformFee = subtotal > 0 ? 5 : 0;
    const taxes = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
    const total = Math.max(0, subtotal - discount + deliveryFee + platformFee + taxes);

    return {
      subtotal,
      discount,
      deliveryFee,
      platformFee,
      taxes,
      total,
      itemCount,
    };
  })();

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return stored ? JSON.parse(stored) : INITIAL_ORDERS;
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  const placeOrder = ({
    address,
    paymentMethod,
  }: {
    address: Address;
    paymentMethod: 'upi' | 'card' | 'cod';
    instructions?: string;
  }): Order => {
    const rest = cartRestaurant || restaurants[0];
    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: newOrderId,
      orderNumber: `QB-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      deliveryAddress: address,
      restaurantId: rest.id,
      restaurantName: rest.name,
      restaurantAddress: rest.address,
      deliveryPartnerId: 'user-delivery-1',
      deliveryPartnerName: 'Rajesh Kumar',
      deliveryPartnerPhone: '+1 555-773-1029',
      items: [...cart],
      subtotal: cartCalculations.subtotal,
      discount: cartCalculations.discount,
      deliveryFee: cartCalculations.deliveryFee,
      platformFee: cartCalculations.platformFee,
      taxes: cartCalculations.taxes,
      total: cartCalculations.total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      status: 'placed',
      timeline: [
        {
          status: 'placed',
          label: 'Order Placed',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Payment confirmed via ${paymentMethod.toUpperCase()}`,
        },
      ],
      createdAt: new Date().toISOString(),
      estimatedDeliveryMinutes: rest.deliveryTimeMinutes || 30,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Order #${newOrder.orderNumber} placed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          let defaultLabel = 'Status Updated';
          switch (newStatus) {
            case 'confirmed':
              defaultLabel = 'Order Confirmed by Kitchen';
              break;
            case 'preparing':
              defaultLabel = 'Preparing Gourmet Meal';
              break;
            case 'ready_for_pickup':
              defaultLabel = 'Food Packed & Ready for Courier';
              break;
            case 'out_for_delivery':
              defaultLabel = 'Out for Delivery';
              break;
            case 'delivered':
              defaultLabel = 'Delivered Successfully';
              break;
            case 'cancelled':
              defaultLabel = 'Order Cancelled';
              break;
          }

          const newTimelineItem = {
            status: newStatus,
            label: defaultLabel,
            timestamp,
            note: note || `Order transitioned to ${newStatus}`,
          };

          return {
            ...ord,
            status: newStatus,
            paymentStatus: newStatus === 'delivered' ? 'paid' : ord.paymentStatus,
            timeline: [...ord.timeline, newTimelineItem],
          };
        }
        return ord;
      })
    );
    showToast(`Order status updated to ${newStatus.replace(/_/g, ' ').toUpperCase()}`);
  };

  const advanceOrderStage = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) return;

    const stages: OrderStatus[] = ['placed', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered'];
    const currentIndex = stages.indexOf(ord.status);
    if (currentIndex >= 0 && currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      updateOrderStatus(orderId, nextStage, `Live progress advanced to ${nextStage}`);
    }
  };

  const cancelOrder = (orderId: string, reason: string) => {
    updateOrderStatus(orderId, 'cancelled', reason);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, cancellationReason: reason } : o))
    );
    showToast('Order has been cancelled', 'info');
  };

  // Active restaurant if looking at current restaurant view
  const activeRestaurant = currentUser.restaurantId
    ? restaurants.find((r) => r.id === currentUser.restaurantId) || null
    : null;

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigate,
        currentUser,
        switchRole,
        users,
        updateUserProfile,
        toggleUserStatus,
        addSavedAddress,
        deleteSavedAddress,
        setDefaultAddress,
        restaurants,
        activeRestaurant,
        addRestaurant,
        updateRestaurant,
        foodItems,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        toggleFoodAvailability,
        cart,
        cartRestaurant,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartCalculations,
        orders,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        advanceOrderStage,
        favoriteRestaurantIds,
        favoriteFoodIds,
        toggleFavoriteRestaurant,
        toggleFavoriteFood,
        coupons,
        addCoupon,
        deleteCoupon,
        selectedLocation,
        setSelectedLocation,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
