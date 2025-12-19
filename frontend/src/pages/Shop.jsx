import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { FaSearch, FaFilter, FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9; 

  useEffect(() => {
    axios.get('/api/products').then(res => {
        setProducts(res.data);
        setFiltered(res.data);
    });
  }, []);

  useEffect(() => {
    let result = products;
    if(category !== 'All') result = result.filter(p => p.category === category);
    if(search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
    setCurrentPage(1); 
  }, [search, category, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filtered.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filtered.length / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
         
         {/* Sidebar Filter */}
         <div className="lg:w-1/4 h-fit lg:sticky lg:top-24 z-10">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div 
                    className="flex justify-between items-center cursor-pointer lg:cursor-default"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                    <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                        <FaFilter className="text-primary-500"/> Categories
                    </h3>
                    <div className="lg:hidden text-gray-500">
                        {isFilterOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                </div>

                <div className={`mt-6 space-y-2 transition-all duration-300 ease-in-out ${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => {
                                setCategory(cat);
                                setIsFilterOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                                category === cat 
                                ? 'bg-primary-500 text-white shadow-md' 
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
         </div>

         {/* Main Content */}
         <div className="lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-2xl font-bold text-gray-800">
                   Products ({filtered.length})
               </h2>
               <div className="relative mt-4 sm:mt-0 w-full sm:w-auto">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                      placeholder="Search medicine..." 
                      className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none w-full"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                  />
               </div>
            </div>
            
            {filtered.length > 0 ? (
                <>
                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentProducts.map(p => <ProductCard key={p._id} product={p} />)}
                    </div>

                    {/* --- PAGINATION CONTROLS --- */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-12 gap-2">
                            {/* Previous Button */}
                            <button 
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-3 rounded-full border border-gray-300 hover:bg-primary-50 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <FaChevronLeft />
                            </button>

                            {/* Page Numbers */}
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNum = index + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => paginate(pageNum)}
                                        className={`w-10 h-10 rounded-full font-bold transition ${
                                            currentPage === pageNum
                                                ? 'bg-primary-600 text-white shadow-lg'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            {/* Next Button */}
                            <button 
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-3 rounded-full border border-gray-300 hover:bg-primary-50 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                    <p className="text-gray-500 text-lg">No products found.</p>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};
export default Shop;