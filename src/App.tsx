import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { HomePage } from './pages/HomePage';
import { RestaurantsPage } from './pages/RestaurantsPage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';
import { SearchPage } from './pages/SearchPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrdersHistoryPage } from './pages/OrdersHistoryPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { OffersPage } from './pages/OffersPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { RestaurantDashboard } from './pages/RestaurantDashboard';
import { DeliveryDashboard } from './pages/DeliveryDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const { currentRoute, currentUser, navigate } = useApp();

  // Parse path without query strings
  const cleanPath = currentRoute.split('?')[0];

  // RBAC Access Guard:
  // If a customer tries to access admin or restaurant or delivery dashboard directly,
  // we can show a friendly prompt or redirect to login/dashboard
  const renderPage = () => {
    // 1. Dynamic parameterized routes
    if (cleanPath.startsWith('/restaurant/')) {
      const id = cleanPath.replace('/restaurant/', '');
      return <RestaurantDetailPage restaurantId={id} />;
    }

    if (cleanPath.startsWith('/order-success/')) {
      const id = cleanPath.replace('/order-success/', '');
      return <OrderConfirmationPage orderId={id} />;
    }

    if (cleanPath.startsWith('/orders/')) {
      const id = cleanPath.replace('/orders/', '');
      return <OrderTrackingPage orderId={id} />;
    }

    // 2. Specific routes
    switch (cleanPath) {
      case '/':
        return currentUser.role === 'restaurant' ? (
          <RestaurantDashboard />
        ) : currentUser.role === 'delivery' ? (
          <DeliveryDashboard />
        ) : currentUser.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <HomePage />
        );

      case '/restaurants':
        return <RestaurantsPage />;

      case '/search':
        return <SearchPage />;

      case '/cart':
        return <CartPage />;

      case '/checkout':
        return <CheckoutPage />;

      case '/orders':
        return <OrdersHistoryPage />;

      case '/favorites':
        return <FavoritesPage />;

      case '/offers':
        return <OffersPage />;

      case '/profile':
        return <ProfilePage />;

      case '/login':
        return <AuthPage isRegister={false} />;

      case '/register':
        return <AuthPage isRegister={true} />;

      // Restaurant Module
      case '/restaurant-dashboard':
      case '/restaurant-orders':
      case '/restaurant-menu':
      case '/restaurant-profile':
        return <RestaurantDashboard />;

      // Delivery Module
      case '/delivery-dashboard':
      case '/delivery-orders':
        return <DeliveryDashboard />;

      // Admin Module
      case '/admin':
      case '/admin/users':
      case '/admin/restaurants':
      case '/admin/orders':
      case '/admin/food':
      case '/admin/delivery':
      case '/admin/offers':
      case '/admin/reports':
        return <AdminDashboard />;

      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
