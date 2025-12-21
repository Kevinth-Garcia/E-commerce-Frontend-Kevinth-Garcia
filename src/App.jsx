import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";

import Login from "./components/Login";
import Register from "./components/Register";
import Cart from "./components/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
import NoEncontrado from "./pages/NoEncontrado";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-zinc-950 dark:text-zinc-100">
      <BrowserRouter>
        <Header />

        <ToastContainer
          position="top-right"
          autoClose={2200}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />

        {/* main que ocupa el espacio y empuja el footer abajo */}
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              {/* Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Recuperación / verificación */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />

              <Route path="/verify-email" element={<EmailVerification />} />
              <Route
                path="/verify-email/:token"
                element={<EmailVerification />}
              />

              {/* Carrito */}
              <Route path="/cart" element={<Cart />} />

              {/* Privadas */}
              <Route element={<ProtectedRoute />}>
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/checkout" element={<Checkout />} />
              </Route>

              {/* Admin */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
              </Route>

              <Route path="*" element={<NoEncontrado />} />
            </Routes>
          </div>
        </main>

        <Footer />
      </BrowserRouter>
    </div>
  );
}
