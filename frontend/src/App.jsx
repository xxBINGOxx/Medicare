import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TopBar from './components/TopBar';
import WhatsAppButton from './components/WhatsAppButton';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Contact from './pages/Contact';
import PaymentCallback from './pages/PaymentCallback';
import NotFound from './pages/NotFound';
import OrderPage from './pages/OrderPage';



function App() {
  return (
    <div className="flex flex-col min-h-screen">
       <ToastContainer position="top-right" autoClose={3000} />
       <TopBar />
       <Navbar />
       <main className="flex-grow">
          <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/shop" element={<Shop />} />
             <Route path="/contact" element={<Contact />} />
             <Route path="/product/:id" element={<ProductDetails />} />
             <Route path="/login" element={<Login />} />
             <Route path="/register" element={<Register />} />
             <Route path="/cart" element={<Cart />} />
             <Route path="/checkout" element={<Checkout />} />
             <Route path="/payment-callback" element={<PaymentCallback />} />
             <Route path="/admin" element={<AdminDashboard />} />
             <Route path="/dashboard" element={<UserDashboard />} />
             <Route path="/order/:id" element={<OrderPage />} />
             <Route path="*" element={<NotFound />} />
          </Routes>
       </main>
       <WhatsAppButton />
       <Footer />
    </div>
  )
}

export default App;
