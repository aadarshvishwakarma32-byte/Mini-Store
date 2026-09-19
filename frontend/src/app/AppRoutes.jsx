import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import { ProtectedRoute, AdminRoute } from '../components/ProtectedRoute.jsx';
import Home from '../pages/Home.jsx';
import About from '../pages/About.jsx';
import Service from '../pages/Service.jsx';
import Contact from '../pages/Contact.jsx';
import Categories from '../pages/Categories.jsx';
import Checkout from '../pages/Checkout.jsx';
import CardPayment from '../pages/CardPayment.jsx';
import UpiPayment from '../pages/UpiPayment.jsx';
import NetBanking from '../pages/NetBanking.jsx';
import Orders from '../pages/Orders.jsx';
import Login from '../pages/Auth/Login.jsx';
import Register from '../pages/Auth/Register.jsx';
import ForgotPassword from '../pages/Auth/ForgotPassword.jsx';
import ResetPassword from '../pages/Auth/ResetPassword.jsx';
import Profile from '../pages/Auth/Profile.jsx';
import Settings from '../pages/Auth/Settings.jsx';
import Wishlist from '../pages/Auth/Wishlist.jsx';
import AdminProducts from '../pages/Admin/AdminProducts.jsx';
import AdminDashboard from '../pages/Admin/AdminDashboard.jsx';
import AdminUsers from '../pages/Admin/AdminUsers.jsx';
import AdminSettings from '../pages/Admin/AdminSettings.jsx';
import AdminMonitoring from '../pages/Admin/AdminMonitoring.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route path="/deals" element={<PlaceholderPage title="Today's Deals" />} />
        <Route path="/new-arrivals" element={<PlaceholderPage title="New Arrivals" />} />
        <Route path="/best-sellers" element={<PlaceholderPage title="Best Sellers" />} />
        <Route path="/trending" element={<PlaceholderPage title="Trending" />} />
        <Route path="/categories" element={<Categories />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/card-payment"
          element={
            <ProtectedRoute>
              <CardPayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upi-payment"
          element={
            <ProtectedRoute>
              <UpiPayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/net-banking"
          element={
            <ProtectedRoute>
              <NetBanking />
            </ProtectedRoute>
          }
        />
        <Route path="/offers" element={<PlaceholderPage title="Offers" />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="monitoring" element={<AdminMonitoring />} />
      </Route>
    </Routes>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div className="main">
      <div className="page">
        <h1 className="pageTitle">{title}</h1>
        <div className="status">This page is coming soon.</div>
      </div>
    </div>
  );
}

export default AppRoutes;
