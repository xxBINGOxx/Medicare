import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaCity, FaPhone } from 'react-icons/fa';

const Checkout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));
  
  const [cart, setCart] = useState([]);
  // Auto-fill address AND phone from profile
  const [address, setAddress] = useState(user?.address || ''); 
  const [phone, setPhone] = useState(user?.phone || ''); 
  const [city] = useState('Alexandria'); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!user) navigate('/login');
    const c = JSON.parse(localStorage.getItem(`cartItems_${user?._id}`));
    if(!c || c.length === 0) navigate('/cart');
    setCart(c || []);
  }, []);

  const handlePay = async () => {
    if(!address) return toast.error('Address is required');
    if(!phone) return toast.error('Phone number is required'); 
    setLoading(true);
    
    try {
        const total = cart.reduce((a,c) => a + c.price * c.qty, 0);
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        // 1. Create Order (Now sends phone too!)
        const { data: order } = await axios.post('/api/orders', {
            orderItems: cart.map(i => ({...i, product: i._id})),
            shippingAddress: { address, city: 'Alexandria', country: 'Egypt', phone },
            totalPrice: total
        }, config);

        // 2. Initiate Payment
        const { data: pay } = await axios.post('/api/payment/init', {
            orderId: order._id,
            amount: total,
            billingData: { 
                name: user.name, 
                email: user.email, 
                address: address, 
                phone: phone, 
                city: 'Alexandria'
            }
        }, config);

        window.location.href = pay.iframeUrl;

    } catch(err) {
        setLoading(false);
        toast.error(err.response?.data?.message || 'Checkout Failed');
    }
  };

  const total = cart.reduce((a,c) => a + c.price * c.qty, 0);

  return (
    <div className="max-w-xl mx-auto py-16 px-6">
       <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Secure Checkout</h1>
       <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          
          <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
            <FaMapMarkerAlt className="text-primary-600"/> Delivery Details
          </h2>

          <div className="space-y-4 mb-8">
              {/* City Field (Locked) */}
              <div>
                  <label className="block text-sm font-bold mb-1 text-gray-600">City</label>
                  <div className="relative">
                      <FaCity className="absolute left-3 top-3.5 text-gray-400" />
                      <input 
                        type="text" 
                        value={city} 
                        disabled 
                        className="w-full border p-3 pl-10 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed font-bold"
                      />
                  </div>
              </div>

              {/* Address Field */}
              <div>
                  <label className="block text-sm font-bold mb-1 text-gray-600">Street Address</label>
                  <textarea 
                    className="w-full border p-4 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition" 
                    rows="2"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Building No., Street Name, Floor..."
                  ></textarea>
              </div>

              {/* Phone Field */}
              <div>
                  <label className="block text-sm font-bold mb-1 text-gray-600">Phone Number</label>
                  <div className="relative">
                      <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
                      <input 
                        type="text" 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)}
                        className="w-full border p-3 pl-10 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition"
                        placeholder="01xxxxxxxxx"
                      />
                  </div>
              </div>
          </div>
          
          <div className="border-t pt-6 mb-8 border-dashed">
              <div className="flex justify-between text-2xl font-bold text-gray-900">
                 <span>Total:</span>
                 <span className="text-primary-600">{total.toFixed(2)} EGP</span>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">Redirecting to secure payment via PayMob</p>
          </div>
          
          <button 
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 disabled:bg-gray-400 transition shadow-lg hover:shadow-xl transform active:scale-95"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
       </div>
    </div>
  );
};
export default Checkout;