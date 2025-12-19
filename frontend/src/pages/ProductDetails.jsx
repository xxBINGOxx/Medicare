import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`/api/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  const addToCart = () => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user) { toast.error('Login required'); return navigate('/login'); }
    const cartKey = `cartItems_${user._id}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    const exist = cart.find(x => x._id === product._id);
    if(exist) exist.qty++;
    else cart.push({ ...product, qty: 1 });
    
    localStorage.setItem(cartKey, JSON.stringify(cart));
    toast.success('Added to Cart');
  };

  if(!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-6 py-12">
       <div className="grid md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-sm">
          <div className="flex items-center justify-center bg-gray-50 rounded-xl p-8">
              <img src={product.image} className="max-h-96 object-contain" />
          </div>
          <div className="flex flex-col justify-center">
             <span className="text-primary-600 font-bold uppercase tracking-wide mb-2">{product.category}</span>
             <h1 className="text-4xl font-bold mb-4 text-gray-900">{product.name}</h1>
             <p className="text-3xl text-primary-600 font-bold mb-6">{product.price} <span className="text-lg text-gray-500 font-normal">EGP</span></p>
             <p className="text-gray-600 mb-8 leading-relaxed text-lg">{product.description}</p>
             
             <div className="mb-8">
                <span className={`px-4 py-2 rounded-full font-bold text-sm ${product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
             </div>
             
             <button 
                onClick={addToCart}
                disabled={product.countInStock === 0}
                className="w-full md:w-auto bg-primary-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 disabled:bg-gray-300 transition shadow-lg"
             >
                Add to Cart
             </button>
          </div>
       </div>
    </div>
  );
};
export default ProductDetails;
