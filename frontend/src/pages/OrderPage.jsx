import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaTruck, FaMapMarkerAlt, FaPhone, FaBox } from 'react-icons/fa';

const OrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, user.token]);

  if (loading) return <div className="p-10 text-center">Loading Order Details...</div>;
  if (!order) return <div className="p-10 text-center text-red-500">Order not found</div>;

  return (
    <div className="container mx-auto px-6 py-12 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
         <h1 className="text-3xl font-bold text-gray-800">Order #{order._id}</h1>
         <Link to={user.isAdmin ? "/admin" : "/dashboard"} className="text-primary-600 font-bold hover:underline">
            &larr; Back to Dashboard
         </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Order Items */}
        <div className="md:col-span-2 space-y-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                 <FaBox className="text-primary-500"/> Order Items
              </h2>
              {order.orderItems.length === 0 ? <p>Order is empty</p> : (
                 <div className="space-y-4">
                    {order.orderItems.map((item, index) => (
                       <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center gap-4">
                             <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border" />
                             <div>
                                <Link to={`/product/${item.product}`} className="font-bold text-gray-800 hover:text-primary-600">
                                   {item.name}
                                </Link>
                                <p className="text-sm text-gray-500">{item.qty} x {item.price} EGP</p>
                             </div>
                          </div>
                          <div className="font-bold text-gray-700">
                             {(item.qty * item.price).toFixed(2)} EGP
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        </div>

        {/* Right Column: Summary & Info */}
        <div className="space-y-6">
           {/* Shipping Info */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                 <FaTruck className="text-primary-500"/> Shipping Info
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                 <p className="flex items-center gap-2">
                    <FaUser className="text-gray-400"/> 
                    <span className="font-bold">User:</span> {order.user?.name} ({order.user?.email})
                 </p>
                 <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400"/> 
                    <span className="font-bold">Address:</span> {order.shippingAddress.address}, {order.shippingAddress.city}
                 </p>
                 <p className="flex items-center gap-2">
                    <FaPhone className="text-gray-400"/> 
                    <span className="font-bold">Phone:</span> {order.shippingAddress.phone}
                 </p>
                 
                 <div className={`mt-4 p-3 rounded-lg text-center font-bold border ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                    order.status === 'Shipped' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                 }`}>
                    Status: {order.status}
                 </div>
              </div>
           </div>

           {/* Order Summary */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                 <span>Items</span>
                 <span>{order.totalPrice.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between mb-2">
                 <span>Shipping</span>
                 <span>0.00 EGP</span>
              </div>
              <div className="border-t my-2 pt-2 flex justify-between font-bold text-lg">
                 <span>Total</span>
                 <span>{order.totalPrice.toFixed(2)} EGP</span>
              </div>
              
              <div className={`mt-4 p-3 rounded-lg text-center font-bold border ${
                  order.isPaid ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
              }`}>
                  {order.isPaid ? `Paid on ${new Date(order.paidAt || order.createdAt).toLocaleDateString()}` : 'Not Paid'}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default OrderPage;