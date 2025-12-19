import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if(!user) { toast.error('Please login to view cart'); navigate('/login'); return; }
    const cartKey = `cartItems_${user._id}`;
    setCart(JSON.parse(localStorage.getItem(cartKey)) || []);
  }, []);

  const updateQty = (id, newQty, stock) => {
    if (newQty < 1 || newQty > stock) return;
    const newCart = cart.map(item => item._id === id ? {...item, qty: newQty} : item);
    setCart(newCart);
    localStorage.setItem(`cartItems_${user._id}`, JSON.stringify(newCart));
  };

  const remove = (id) => {
    const newCart = cart.filter(item => item._id !== id);
    setCart(newCart);
    localStorage.setItem(`cartItems_${user._id}`, JSON.stringify(newCart));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="container mx-auto px-6 py-12">
       <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
       {cart.length === 0 ? <div className="text-center py-10 bg-white rounded shadow"><p>Your cart is empty.</p></div> : (
         <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
                {cart.map(item => (
                    <div key={item._id} className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-6">
                            <img src={item.image} className="w-20 h-20 object-cover rounded-lg bg-gray-50" />
                            <div>
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                <p className="text-primary-600 font-bold">{item.price} EGP</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded-lg">
                                <button onClick={() => updateQty(item._id, item.qty-1, item.countInStock)} className="px-3 py-1 hover:bg-gray-100">-</button>
                                <span className="px-3 font-bold">{item.qty}</span>
                                <button onClick={() => updateQty(item._id, item.qty+1, item.countInStock)} className="px-3 py-1 hover:bg-gray-100">+</button>
                            </div>
                            <button onClick={() => remove(item._id)} className="text-red-500 hover:text-red-700 font-bold">Remove</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg h-fit border border-gray-100">
                <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                <div className="flex justify-between text-xl font-bold mb-8 text-gray-800">
                    <span>Total:</span>
                    <span>{total.toFixed(2)} EGP</span>
                </div>
                <button onClick={() => navigate('/checkout')} className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 shadow-md transition">
                    Proceed to Checkout
                </button>
            </div>
         </div>
       )}
    </div>
  );
};
export default Cart;
