export type UserRole = 'customer' | 'restaurant' | 'delivery' | 'admin';

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  street: string;
  area: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  savedAddresses?: Address[];
  paymentPreferences?: {
    preferredMethod: 'upi' | 'card' | 'cod';
    savedUpiId?: string;
  };
  restaurantId?: string; // If role === 'restaurant'
  deliveryVehicle?: string; // If role === 'delivery'
  isAvailable?: boolean; // For delivery partner online status
  status?: 'active' | 'suspended';
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  isVeg: boolean;
  rating: number;
  ratingCount: number;
  image: string;
  isAvailable: boolean;
  isBestSeller?: boolean;
  prepTimeMinutes: number;
  tags?: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  tagLine: string;
  cuisine: string[];
  rating: number;
  ratingCount: number;
  deliveryTimeMinutes: number;
  deliveryFee: number;
  minOrder: number;
  priceLevel: '₹' | '₹₹' | '₹₹₹';
  heroImage: string;
  isVegOnly?: boolean;
  address: string;
  area: string;
  city: string;
  isOpen: boolean;
  featured?: boolean;
  activeOffer?: string;
  ownerId?: string;
  status: 'approved' | 'pending' | 'rejected' | 'inactive';
}

export interface CartItem {
  foodItemId: string;
  restaurantId: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  image: string;
  specialInstructions?: string;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderTimelineItem {
  status: OrderStatus;
  label: string;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: Address;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  total: number;
  paymentMethod: 'upi' | 'card' | 'cod';
  paymentStatus: 'paid' | 'pending';
  status: OrderStatus;
  timeline: OrderTimelineItem[];
  createdAt: string;
  estimatedDeliveryMinutes: number;
  cancellationReason?: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
  description: string;
  expiryDate: string;
  restaurantId?: string; // Optional specific restaurant
  isActive: boolean;
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
