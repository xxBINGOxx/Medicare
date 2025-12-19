import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom'; 
import { 
  FaTrash, FaUserShield, FaPlus, FaMinus, FaUsers, FaBoxOpen, 
  FaClipboardList, FaEnvelopeOpenText, FaTruck, FaMapMarkerAlt, 
  FaPhone, FaKey, FaSearch, FaFilter, FaChartBar, FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const config = { headers: { Authorization: `Bearer ${user?.token}` } };
  const SUPER_ADMIN_EMAIL = 'admin@pharmacy.com';
  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;

  const [tab, setTab] = useState('dashboard');
  const [data, setData] = useState({ users: [], products: [], orders: [], contacts: [] });
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  
  // Product Form State
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', description: '', countInStock: '', tags: '' });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if(!user || !user.isAdmin) navigate('/');
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    try {
        // Fetch specific data based on tab to optimize, or all for dashboard
        if (tab === 'dashboard') {
            const [usersRes, productsRes, ordersRes, contactsRes] = await Promise.all([
                axios.get('/api/users', config),
                axios.get('/api/products'),
                axios.get('/api/orders', config),
                axios.get('/api/contact', config)
            ]);
            setData({
                users: usersRes.data,
                products: productsRes.data,
                orders: ordersRes.data,
                contacts: contactsRes.data
            });
        } else if(tab === 'users') {
            const { data: res } = await axios.get('/api/users', config);
            setData(prev => ({...prev, users: res}));
        } else if (tab === 'products') {
            const { data: res } = await axios.get('/api/products');
            setData(prev => ({...prev, products: res}));
        } else if (tab === 'orders') {
            const { data: res } = await axios.get('/api/orders', config);
            setData(prev => ({...prev, orders: res}));
        } else if (tab === 'contacts') {
            const { data: res } = await axios.get('/api/contact', config);
            setData(prev => ({...prev, contacts: res}));
        }
    } catch(err) { toast.error('Error fetching data'); }
  };

  const deleteItem = async (endpoint, id) => {
    if(!window.confirm('Are you sure you want to delete this?')) return;
    try { await axios.delete(`/api/${endpoint}/${id}`, config); toast.success('Deleted successfully'); fetchData(); } 
    catch(err) { toast.error(err.response?.data?.message || 'Error deleting'); }
  };

  const toggleAdmin = async (id, currentStatus) => {
    if (!isSuperAdmin) return toast.error('Only Super Admin can change roles');
    try { 
        await axios.put(`/api/users/${id}/role`, {}, config); 
        toast.success(`User is now ${!currentStatus ? 'Admin' : 'User'}`); 
        fetchData(); 
    }
    catch(err) { toast.error(err.response?.data?.message || 'Error updating role'); }
  };

  const resetUserPassword = async (id) => {
      const newPass = window.prompt("Enter new password for this user:");
      if (!newPass) return;
      try {
          await axios.put(`/api/users/${id}/force-password`, { password: newPass }, config);
          toast.success("Password has been reset");
      } catch (err) {
          toast.error(err.response?.data?.message || "Failed to reset password");
      }
  };

  const updateStock = async (product, change) => {
    const newStock = product.countInStock + change;
    if(newStock < 0) return; 
    try {
        await axios.put(`/api/products/${product._id}`, { countInStock: newStock }, config);
        toast.success(`Stock updated: ${newStock}`);
        fetchData();
    } catch (err) { toast.error('Error updating stock'); }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
        await axios.put(`/api/orders/${id}/status`, { status: newStatus }, config);
        toast.success(`Order marked as ${newStatus}`);
        fetchData();
    } catch (err) { toast.error('Error updating status'); }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newProduct).forEach(k => formData.append(k, newProduct[k]));
    if(image) formData.append('image', image);

    try {
        await axios.post('/api/products', formData, { headers: { ...config.headers, 'Content-Type': 'multipart/form-data' } });
        toast.success('Product Added');
        setNewProduct({ name: '', price: '', category: '', description: '', countInStock: '', tags: '' });
        setImage(null);
        fetchData();
    } catch(err) { toast.error('Error adding product'); }
  };

  const getStatusColor = (status) => {
      switch(status) {
          case 'Delivered': return 'bg-green-100 text-green-700 border-green-300';
          case 'Shipped': return 'bg-purple-100 text-purple-700 border-purple-300';
          case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-300';
          case 'Cancelled': return 'bg-red-100 text-red-700 border-red-300';
          default: return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      }
  };

  // --- FILTER & PAGINATION LOGIC ---
  const filteredOrders = data.orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = orderFilter === 'all' || order.status === orderFilter;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // --- STATS CALCULATION ---
  const totalRevenue = data.orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingOrders = data.orders.filter(o => o.status === 'Pending' || !o.status).length;
  const lowStockProducts = data.products.filter(p => p.countInStock < 5).length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-2xl flex flex-col border-r border-gray-200 z-10 sticky top-0 h-screen">
         <div className="p-6 border-b bg-gradient-to-r from-primary-600 to-primary-700">
            <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
              <FaUserShield /> Admin Panel
            </h2>
         </div>
         <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {[
                { id: 'dashboard', icon: <FaChartBar/>, label: 'Dashboard' },
                { id: 'users', icon: <FaUsers/>, label: 'Users', badge: data.users.length },
                { id: 'products', icon: <FaBoxOpen/>, label: 'Products', badge: data.products.length },
                { id: 'orders', icon: <FaClipboardList/>, label: 'Orders', badge: data.orders.length },
                { id: 'contacts', icon: <FaEnvelopeOpenText/>, label: 'Messages', badge: data.contacts.length }
            ].map(item => (
                <button 
                  key={item.id} 
                  onClick={()=>{setTab(item.id); setCurrentPage(1);}} 
                  className={`flex items-center justify-between w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    tab===item.id 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg scale-105' 
                      : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
                  }`}
                >
                    <div className="flex items-center gap-3">
                      {item.icon} 
                      <span className="font-semibold">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        tab===item.id ? 'bg-white text-primary-600' : 'bg-primary-100 text-primary-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                </button>
            ))}
         </nav>
         {isSuperAdmin && (
            <div className="p-4 border-t bg-purple-50">
              <div className="flex items-center gap-2 text-purple-700 justify-center">
                <FaUserShield />
                <span className="text-sm font-bold">Super Admin Access</span>
              </div>
            </div>
         )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto h-screen">
        
        {/* --- DASHBOARD OVERVIEW TAB --- */}
        {tab === 'dashboard' && (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Stats Cards */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500 hover:transform hover:-translate-y-1 transition duration-300">
                <div className="flex items-center justify-between mb-2">
                  <FaUsers className="text-3xl text-blue-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{data.users.length}</div>
                <div className="text-gray-600 text-sm">Total Users</div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500 hover:transform hover:-translate-y-1 transition duration-300">
                <div className="flex items-center justify-between mb-2">
                  <FaBoxOpen className="text-3xl text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{data.products.length}</div>
                <div className="text-gray-600 text-sm">Products</div>
                {lowStockProducts > 0 && <div className="text-xs text-red-500 mt-1 font-bold">{lowStockProducts} Low Stock!</div>}
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-500 hover:transform hover:-translate-y-1 transition duration-300">
                <div className="flex items-center justify-between mb-2">
                  <FaClipboardList className="text-3xl text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{data.orders.length}</div>
                <div className="text-gray-600 text-sm">Total Orders</div>
                {pendingOrders > 0 && <div className="text-xs text-yellow-600 mt-1 font-bold">{pendingOrders} Pending</div>}
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-primary-500 hover:transform hover:-translate-y-1 transition duration-300">
                <div className="flex items-center justify-between mb-2">
                  <FaTruck className="text-3xl text-primary-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{totalRevenue.toFixed(2)} EGP</div>
                <div className="text-gray-600 text-sm">Total Revenue</div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Recent Orders</h3>
                <div className="space-y-3">
                  {data.orders.slice(0, 5).map(o => (
                    <div key={o._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                      <div>
                        <div className="font-semibold text-gray-800">#{o._id.slice(-6)}</div>
                        <div className="text-xs text-gray-500">{o.user?.email}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary-600">{o.totalPrice} EGP</div>
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(o.status)}`}>{o.status || 'Pending'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Low Stock Alert</h3>
                <div className="space-y-3">
                  {data.products.filter(p => p.countInStock < 5).slice(0, 5).map(p => (
                    <div key={p._id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                      <div className="flex items-center gap-3">
                        <img src={p.image} className="w-10 h-10 rounded object-cover" />
                        <div>
                          <div className="font-semibold text-gray-800">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.category}</div>
                        </div>
                      </div>
                      <div className="text-red-600 font-bold">{p.countInStock} left</div>
                    </div>
                  ))}
                  {data.products.filter(p => p.countInStock < 5).length === 0 && (
                    <div className="text-center text-gray-500 py-4">All products are well stocked!</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- USERS TAB --- */}
        {tab === 'users' && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
               <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-white flex justify-between items-center">
                   <div>
                     <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
                     <p className="text-gray-600 text-sm">Total: {data.users.length} users</p>
                   </div>
                   {isSuperAdmin && <span className="bg-purple-100 text-purple-800 text-xs px-3 py-2 rounded-full font-bold">Super Admin Mode</span>}
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-700 text-sm uppercase border-b-2 border-gray-200">
                        <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Actions</th></tr>
                    </thead>
                    <tbody>
                        {data.users.map(u => (
                            <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                                      {u.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium text-gray-800">{u.name}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-gray-600">{u.email}</td>
                                <td className="p-4">
                                    {u.email === SUPER_ADMIN_EMAIL ? (
                                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">Super Admin</span>
                                    ) : (
                                        <button 
                                          onClick={() => toggleAdmin(u._id, u.isAdmin)}
                                          disabled={!isSuperAdmin}
                                          className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                                              u.isAdmin 
                                              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                          } ${!isSuperAdmin ? 'cursor-not-allowed opacity-50' : ''}`}
                                        >
                                            {u.isAdmin ? 'Admin' : 'User'}
                                        </button>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                      {u.email !== SUPER_ADMIN_EMAIL && (
                                        <>
                                            <button onClick={()=>resetUserPassword(u._id)} className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition" title="Reset Password">
                                                <FaKey />
                                            </button>
                                            {(isSuperAdmin || !u.isAdmin) && (
                                                <button onClick={()=>deleteItem('users', u._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete User">
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </>
                                      )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
               </div>
            </div>
        )}

        {/* --- PRODUCTS TAB --- */}
        {tab === 'products' && (
            <div>
               <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 border border-gray-100">
                   <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>
                   <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input placeholder="Product Name" className="border-2 border-gray-200 p-3 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name:e.target.value})} required/>
                      <input placeholder="Category" className="border-2 border-gray-200 p-3 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" value={newProduct.category} onChange={e=>setNewProduct({...newProduct, category:e.target.value})} required/>
                      <input type="number" placeholder="Price (EGP)" className="border-2 border-gray-200 p-3 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price:e.target.value})} required/>
                      <input type="number" placeholder="Stock Quantity" className="border-2 border-gray-200 p-3 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" value={newProduct.countInStock} onChange={e=>setNewProduct({...newProduct, countInStock:e.target.value})} required/>
                      <input type="file" className="border-2 border-gray-200 p-3 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" onChange={e=>setImage(e.target.files[0])} required/>
                      <input placeholder="Tags (comma separated)" className="border-2 border-gray-200 p-3 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" value={newProduct.tags} onChange={e=>setNewProduct({...newProduct, tags:e.target.value})} />
                      <textarea placeholder="Product Description" className="col-span-1 md:col-span-2 border-2 border-gray-200 p-3 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none h-24" value={newProduct.description} onChange={e=>setNewProduct({...newProduct, description:e.target.value})} required/>
                      <button className="col-span-1 md:col-span-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition shadow-lg">Add Product</button>
                   </form>
               </div>
               
               <h3 className="text-2xl font-bold mb-4 text-gray-800">Inventory ({data.products.length})</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {data.products.map(p => (
                       <div key={p._id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100 group">
                           <div className="relative overflow-hidden rounded-xl mb-4 h-40">
                             <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                           </div>
                           <h4 className="font-bold text-lg mb-2 text-gray-800 truncate" title={p.name}>{p.name}</h4>
                           <p className="text-sm text-gray-500 mb-3">{p.category}</p>
                           <div className="flex items-center justify-between mb-4">
                             <span className="text-xl font-bold text-primary-600">{p.price} EGP</span>
                             <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                                 <button onClick={() => updateStock(p, -1)} className="w-7 h-7 flex items-center justify-center bg-white hover:bg-red-50 hover:text-red-600 rounded-full text-sm shadow-sm transition border border-gray-200"><FaMinus /></button>
                                 <span className={`text-sm font-bold px-2 ${p.countInStock < 5 ? 'text-red-500' : 'text-gray-700'}`}>{p.countInStock}</span>
                                 <button onClick={() => updateStock(p, 1)} className="w-7 h-7 flex items-center justify-center bg-white hover:bg-green-50 hover:text-green-600 rounded-full text-sm shadow-sm transition border border-gray-200"><FaPlus /></button>
                             </div>
                           </div>
                           <button onClick={()=>deleteItem('products', p._id)} className="w-full text-red-500 hover:bg-red-50 p-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 border border-red-100 hover:border-red-200">
                             <FaTrash /> Delete
                           </button>
                       </div>
                   ))}
               </div>
            </div>
        )}

        {/* --- CONTACTS TAB --- */}
        {tab === 'contacts' && (
             <div>
                 <div className="flex items-center justify-between mb-6">
                   <div>
                     <h2 className="text-3xl font-bold text-gray-800">Customer Messages</h2>
                     <p className="text-gray-600">Total: {data.contacts.length} messages</p>
                   </div>
                 </div>
                 <div className="space-y-4">
                   {data.contacts.map(c => (
                       <div key={c._id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 relative hover:shadow-xl transition">
                           <button onClick={()=>deleteItem('contact', c._id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"><FaTrash/></button>
                           <div className="flex items-start gap-4 mb-4">
                             <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                               {c.name?.charAt(0).toUpperCase()}
                             </div>
                             <div className="flex-1">
                               <h3 className="font-bold text-xl text-gray-800 mb-1">{c.subject || 'No Subject'}</h3>
                               <div className="flex items-center gap-4 text-sm text-gray-500">
                                 <span className="font-medium">{c.name}</span>
                                 <span>{c.email}</span>
                               </div>
                             </div>
                           </div>
                           <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-200 mb-3">{c.message}</p>
                           <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
                       </div>
                   ))}
                   {data.contacts.length === 0 && (
                     <div className="bg-white p-12 rounded-2xl text-center text-gray-500 shadow-sm">
                       <FaEnvelopeOpenText className="text-5xl mx-auto mb-3 opacity-30" />
                       <p>No messages yet</p>
                     </div>
                   )}
                 </div>
             </div>
         )}

         {/* --- ORDERS TAB --- */}
         {tab === 'orders' && (
             <div>
                 {/* Search and Filter Bar */}
                 <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-gray-100">
                   <div className="flex flex-col md:flex-row gap-4">
                     <div className="flex-1 relative">
                       <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                       <input 
                         type="text"
                         placeholder="Search by Order ID or Email..."
                         className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                         value={searchTerm}
                         onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                       />
                     </div>
                     <div className="relative min-w-[200px]">
                       <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                       <select 
                         className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none appearance-none bg-white cursor-pointer"
                         value={orderFilter}
                         onChange={(e) => {setOrderFilter(e.target.value); setCurrentPage(1);}}
                       >
                         <option value="all">All Orders</option>
                         <option value="Pending">Pending</option>
                         <option value="Processing">Processing</option>
                         <option value="Shipped">Shipped</option>
                         <option value="Delivered">Delivered</option>
                         <option value="Cancelled">Cancelled</option>
                       </select>
                     </div>
                   </div>
                   <div className="mt-4 text-sm text-gray-600 font-medium">
                     Showing {currentOrders.length > 0 ? indexOfFirstOrder + 1 : 0}-{Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
                   </div>
                 </div>

                 {/* Orders List */}
                 <div className="space-y-4">
                     {currentOrders.map(o => (
                         <div key={o._id} className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-primary-500 flex flex-col lg:flex-row justify-between items-start gap-6 hover:shadow-xl transition duration-300">
                             
                             <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-3">
                                     <Link to={`/order/${o._id}`} className="font-bold text-xl text-gray-800 hover:text-primary-600 hover:underline transition">
                                         Order #{o._id.slice(-6)}
                                     </Link>
                                     <span className={`text-xs px-3 py-1 rounded-full border font-bold ${getStatusColor(o.status)}`}>{o.status || 'Pending'}</span>
                                 </div>
                                 
                                 <div className="text-sm text-gray-600 space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="flex items-center gap-2"><span className="font-bold w-16">User:</span> {o.user?.email || 'Unknown'}</p>
                                    <p className="flex items-center gap-2"><span className="font-bold w-16">Date:</span> {new Date(o.createdAt).toLocaleString()}</p>
                                    
                                    {/* ADDRESS & PHONE DISPLAY */}
                                    {o.shippingAddress && (
                                        <div className="pt-2 mt-2 border-t border-gray-200">
                                            <p className="flex items-center gap-2 mb-1"><FaMapMarkerAlt className="text-primary-500"/> <span className="font-semibold">Delivery To: {o.shippingAddress.address}, {o.shippingAddress.city}</span></p>
                                            <p className="pl-6 text-gray-800 flex items-center gap-2 mt-1"><FaPhone className="text-primary-500 text-xs"/>{o.shippingAddress.phone || 'No Phone Provided'}</p>
                                        </div>
                                    )}
                                 </div>
                             </div>

                             <div className="flex flex-col items-end gap-3 min-w-[200px] w-full lg:w-auto">
                                 <span className="text-2xl font-bold text-primary-600">{o.totalPrice} EGP</span>
                                 <p className={`text-sm font-bold px-3 py-1 rounded-full ${o.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.isPaid ? 'Paid ✅' : 'Pending Payment ⏳'}</p>
                                 
                                 <div className="w-full mt-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Update Status:</label>
                                    <div className="flex items-center gap-2 w-full bg-gray-50 p-1 rounded-lg border border-gray-200">
                                        <FaTruck className="text-gray-400 ml-2" />
                                        <select 
                                            className="bg-transparent text-sm font-medium text-gray-700 p-2 w-full outline-none cursor-pointer"
                                            value={o.status || 'Pending'}
                                            onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                 </div>
                             </div>
                         </div>
                     ))}
                     {currentOrders.length === 0 && (
                        <div className="text-center py-10 text-gray-500">No orders found matching your search.</div>
                     )}
                 </div>

                 {/* Pagination Controls */}
                 {filteredOrders.length > ordersPerPage && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-3 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <FaChevronLeft />
                        </button>
                        <span className="font-bold text-gray-700">Page {currentPage} of {totalPages}</span>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-3 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                 )}
             </div>
         )}
      </div>
    </div>
  );
};
export default AdminDashboard;