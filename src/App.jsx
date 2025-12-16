import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, replace } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useCartStore } from "./store/useCartStore";
import AdminRoute from "./components/AdminRoute";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import EmailVerification from "./pages/EmailVerification";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import NoEncontrado from "./pages/NoEncontrado";
import OrderHistory from "./pages/OrderHistory";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  
  const { user } = useAuthStore();
  const setUserCart = useCartStore((state) => state.setUser);

  useEffect(() => {
    setUserCart(user ? user.id : null);
  }, [user, setUserCart]);


  return (
    <Router>
      <div className="flex-grow container mx-auto px-4 py-8"><ToastContainer /></div>
      


      <Header />
      <Cart />
      
      <main className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
           <Route path="/orders" element={<ProtectedRoute><OrderHistory/></ProtectedRoute> } />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="index" element={<Navigate to="/admin/products" replace />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="*" element={<NoEncontrado/>}/>
          
         
        </Routes>
      </main>

      
      <CartDrawer />

      <Footer />
    </Router>
  );
}
export default App;