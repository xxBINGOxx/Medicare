import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaCartPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const addToCart = () => {
    // 1. Check Login
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user) {
        toast.error('Please Login to add items');
        return navigate('/login');
    }

    // 2. Check Stock 
    if (product.countInStock <= 0) return toast.error('Sorry, this item is Out of Stock');

    // 3. Cart Logic 
    const cartKey = `cartItems_${user._id}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    const existItem = cart.find(x => x._id === product._id);
    if(existItem) {
        if(existItem.qty + 1 > product.countInStock) return toast.error('Max stock reached');
        existItem.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    localStorage.setItem(cartKey, JSON.stringify(cart));
    toast.success('Added to Cart');
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden group border border-gray-100 relative">
      
      {/* --- OUT OF STOCK OVERLAY --- */}
      {product.countInStock === 0 && (
        <div className="absolute top-0 left-0 w-full h-full bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-gray-800 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg transform -rotate-12">
                Out of Stock
            </span>
        </div>
      )}

      {/* --- IMAGE SECTION --- */}
      <div className="relative h-64 overflow-hidden">
        <img 
            src={product.image} 
            alt={product.name} 
            className={`w-full h-full object-cover transition duration-500 group-hover:scale-110 
              ${product.countInStock === 0 ? 'grayscale opacity-60' : ''}`}
            onError={(e) => e.target.src = 'https://placehold.co/400x300?text=No+Image'}
        />
      </div>
      
      {/* --- CONTENT SECTION --- */}
      <div className="p-5">
         <span className="text-xs text-primary-600 font-bold bg-primary-100 px-2 py-1 rounded uppercase tracking-wide">{product.category}</span>
         <h3 className="font-bold text-xl mt-3 text-gray-800 mb-2 truncate">{product.name}</h3>
         <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
         
         <div className="flex justify-between items-center border-t pt-4">
            <span className="text-2xl font-bold text-primary-600">{product.price} <span className="text-sm font-normal">EGP</span></span>
            <div className="flex gap-2 relative z-20">
               
               <Link to={`/product/${product._id}`} className="p-3 text-gray-600 bg-gray-100 rounded-full hover:bg-primary-500 hover:text-white transition">
                 <FaEye />
               </Link>

               {/* --- ADD TO CART BUTTON --- */}
               <button 
                  onClick={addToCart} 
                  className={`p-3 rounded-full transition shadow-md flex items-center justify-center
                    ${product.countInStock === 0 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-primary-500 text-white hover:bg-primary-600' 
                    }`}
               >
                  <FaCartPlus />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
export default ProductCard;