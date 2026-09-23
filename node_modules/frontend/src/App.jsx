import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import Footer from "../global/footer";
import Navbar from "../global/navbar";
import Login from "./pages/auth/login/Login";
import ForgotPassword from "./pages/auth/forgotpassword/ForgotPassword";
import Register from "./pages/auth/register/Register";
import ResetPassword from "./pages/auth/resetPassword/ResetPassword";
import VerifyOtp from "./pages/auth/verifyOtp/VerifyOtp";
import Cart from "./pages/cart/Cart";
import CheckOut from "./pages/checkout/CheckOut";
import Home from "./pages/home/Home";
import ProductDetails from "./pages/productDetails/productDetails";
import MyProfile from "./pages/profile/MyProfile";
import MyOrder from "./pages/order/MyOrder";
import MyReviews from "./pages/reviews/MyReview";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import AddProduct from "./pages/admin/dashboard/AddProduct";
import EditProduct from "./pages/admin/dashboard/EditProduct";
import AllReviews from "./pages/admin/AllReview";
import store from "../global/STORE/store";

function getUserRoleFromToken() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    return payload?.userRole || null;
  } catch {
    return null;
  }
}

function PublicOnly({ children }) {
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");
  const user = useSelector((state) => state.auth.data);
  const userRole = user?.userRole || getUserRoleFromToken();

  if (!token) return children;
  if (userRole === "seller") return <Navigate to="/admin/dashboard" replace />;

  return <Navigate to="/" replace />;
}

function AdminOnly({ children }) {
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");
  const user = useSelector((state) => state.auth.data);
  const userRole = user?.userRole || getUserRoleFromToken();

  if (!token) return <Navigate to="/loginn" replace />;
  if (!userRole) return <Navigate to="/login" replace />;
  if (userRole !== "seller") return <Navigate to="/" replace />;

  return children;
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />
          <Route path="/verify-otp" element={<PublicOnly><VerifyOtp /></PublicOnly>} />
          <Route path="/reset-password" element={<PublicOnly><ResetPassword /></PublicOnly>} />
          <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
          <Route path="/productdetails/:id" element={<ProductDetails />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/orders" element={<MyOrder />} />
          <Route path="/reviews" element={<MyReviews />} />
          <Route path="/admin/dashboard" element={<AdminOnly><AdminDashboard /></AdminOnly>} />
          <Route path="/admin/products/add" element={<AdminOnly><AddProduct /></AdminOnly>} />
          <Route path="/admin/products/edit/:id" element={<AdminOnly><EditProduct /></AdminOnly>} />
          <Route path="/admin/reviews" element={<AdminOnly><AllReviews /></AdminOnly>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
