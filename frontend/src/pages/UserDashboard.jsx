import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaCreditCard, FaCalendarAlt, FaTruck, FaUser, FaLock, FaMapMarkerAlt, FaShoppingBag, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')));
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({ 
      name: user?.name || '', 
      email: user?.email || '', 
      phone: user?.phone || '',
      address: user?.address || '',
      city: 'Alexandria'
  });

  const [securityData, setSecurityData] = useState({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
  });

  useEffect(() => {
    if(!user) navigate('/login');
    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/api/orders/myorders', { headers: { Authorization: `Bearer ${user.token}` }});
            setOrders(data);
        } catch(err) { console.log(err); }
    };
    fetchOrders();
  }, []);

  const updateProfileInfo = async (e) => {
    e.preventDefault();
    try {
        const { data } = await axios.put('/api/users/profile', profileData, { headers: { Authorization: `Bearer ${user.token}` }});
        const updatedUserInfo = { ...data, token: user.token };
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        setUser(updatedUserInfo);
        toast.success('Profile Details Updated');
    } catch(err) { toast.error(err.response?.data?.message || 'Update Failed'); }
  };

  const updatePassword = async (e) => {
      e.preventDefault();
      if (securityData.newPassword !== securityData.confirmPassword) return toast.error("New passwords do not match");
      try {
          await axios.put('/api/users/profile', {
              password: securityData.newPassword,
              oldPassword: securityData.oldPassword
          }, { headers: { Authorization: `Bearer ${user.token}` }});
          toast.success('Password Changed Successfully');
          setSecurityData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } catch (err) { toast.error(err.response?.data?.message || 'Password Update Failed'); }
  };

  const getStatusColor = (status) => {
      switch(status) {
          case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
          case 'Shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
          case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
  };

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const completedOrders = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, <span className="text-primary-600">{user?.name?.split(' ')[0]}</span>!
          </h1>
          <p className="text-gray-600">Manage your account and track your orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <FaShoppingBag className="text-3xl opacity-80" />
              <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">Total</span>
            </div>
            <div className="text-3xl font-bold mb-1">{totalOrders}</div>
            <div className="text-blue-100 text-sm">Total Orders</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <FaCreditCard className="text-3xl opacity-80" />
              <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">Spent</span>
            </div>
            <div className="text-3xl font-bold mb-1">{totalSpent.toFixed(2)} EGP</div>
            <div className="text-green-100 text-sm">Total Amount</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <FaChartLine className="text-3xl opacity-80" />
              <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">Success</span>
            </div>
            <div className="text-3xl font-bold mb-1">{completedOrders}</div>
            <div className="text-purple-100 text-sm">Completed Orders</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-72">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 space-y-2 sticky top-6">
              <button 
                onClick={()=>setActiveTab('profile')} 
                className={`w-full text-left p-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                  activeTab==='profile' 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg scale-105' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102'
                }`}
              >
                <FaUser className={activeTab==='profile' ? 'text-white' : 'text-primary-500'} />
                <span>My Profile</span>
              </button>
              
              <button 
                onClick={()=>setActiveTab('orders')} 
                className={`w-full text-left p-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                  activeTab==='orders' 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg scale-105' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102'
                }`}
              >
                <FaBox className={activeTab==='orders' ? 'text-white' : 'text-primary-500'} />
                <span>My Orders</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                      <p className="text-gray-500 flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Active Account
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">{totalOrders}</div>
                      <div className="text-sm text-gray-600">Orders Placed</div>
                    </div>
                    <div className="text-center border-l border-r border-gray-300">
                      <div className="text-2xl font-bold text-green-600">{completedOrders}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{totalOrders - completedOrders}</div>
                      <div className="text-sm text-gray-600">In Progress</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* PROFILE INFO FORM */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                      <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                        <FaUser className="text-primary-600 text-lg"/>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">Personal Details</h2>
                        <p className="text-sm text-gray-500">Update your personal information</p>
                      </div>
                    </div>
                    <form onSubmit={updateProfileInfo} className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name</label>
                        <input 
                          className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition" 
                          value={profileData.name} 
                          onChange={e=>setProfileData({...profileData, name:e.target.value})} 
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address</label>
                        <div className="relative">
                          <input 
                            className="w-full border-2 border-gray-200 p-3 rounded-xl bg-gray-50 cursor-not-allowed text-gray-500" 
                            value={profileData.email} 
                            disabled 
                          />
                          <span className="absolute right-3 top-3 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Verified</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Phone Number</label>
                        <input 
                          className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition" 
                          value={profileData.phone} 
                          onChange={e=>setProfileData({...profileData, phone:e.target.value})} 
                          placeholder="+20 XXX XXX XXXX"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">City</label>
                          <div className="relative">
                            <input 
                              className="w-full border-2 border-gray-200 p-3 rounded-xl bg-gray-50 cursor-not-allowed text-gray-500" 
                              value="Alexandria" 
                              disabled 
                            />
                            <FaMapMarkerAlt className="absolute right-3 top-4 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">Address</label>
                          <input 
                            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition" 
                            value={profileData.address} 
                            onChange={e=>setProfileData({...profileData, address:e.target.value})} 
                            placeholder="Street, Building..."
                          />
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl w-full mt-4 hover:scale-105"
                      >
                        Update Profile
                      </button>
                    </form>
                  </div>

                  {/* SECURITY FORM */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                      <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                        <FaLock className="text-red-600 text-lg"/>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">Security Settings</h2>
                        <p className="text-sm text-gray-500">Manage your password</p>
                      </div>
                    </div>
                    <form onSubmit={updatePassword} className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Current Password</label>
                        <input 
                          className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition" 
                          type="password" 
                          value={securityData.oldPassword} 
                          onChange={e=>setSecurityData({...securityData, oldPassword:e.target.value})} 
                          required 
                          placeholder="Enter current password" 
                        />
                      </div>
                      
                      <div className="border-t border-gray-200 my-4"></div>
                      
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">New Password</label>
                        <input 
                          className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition" 
                          type="password" 
                          value={securityData.newPassword} 
                          onChange={e=>setSecurityData({...securityData, newPassword:e.target.value})} 
                          required 
                          placeholder="Enter new password" 
                        />
                        <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Confirm New Password</label>
                        <input 
                          className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition" 
                          type="password" 
                          value={securityData.confirmPassword} 
                          onChange={e=>setSecurityData({...securityData, confirmPassword:e.target.value})} 
                          required 
                          placeholder="Confirm new password" 
                        />
                      </div>
                      <button 
                        type="submit"
                        className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl w-full mt-4 hover:scale-105"
                      >
                        Change Password
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
                    <p className="text-gray-500 text-sm mt-1">Track and manage your orders</p>
                  </div>
                  <div className="bg-primary-100 text-primary-700 px-4 py-2 rounded-xl font-semibold">
                    {totalOrders} Orders
                  </div>
                </div>
                
                {orders.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaBox className="text-4xl text-gray-400"/>
                    </div>
                    <p className="text-gray-600 font-medium mb-2">No orders yet</p>
                    <p className="text-gray-500 text-sm mb-6">Start shopping to see your orders here</p>
                    <button 
                      onClick={() => navigate('/shop')}
                      className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(o => (
                      <div key={o._id} className="border-2 border-gray-200 p-6 rounded-2xl hover:shadow-lg hover:border-primary-200 transition-all duration-300 bg-white group">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-4 rounded-xl text-white">
                              <FaBox className="text-xl" />
                            </div>
                            <div>
                              <Link to={`/order/${o._id}`} className="font-bold text-gray-800 text-lg block hover:text-primary-600 hover:underline transition">
                                Order #{o._id.slice(-8).toUpperCase()}
                              </Link>
                              <span className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                <FaCalendarAlt className="text-xs"/> 
                                {new Date(o.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary-600">{o.totalPrice.toFixed(2)} EGP</div>
                            <div className="text-xs text-gray-500">Total Amount</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${o.isPaid ? 'bg-green-100 text-green-700 border-2 border-green-200' : 'bg-yellow-100 text-yellow-700 border-2 border-yellow-200'}`}>
                            <FaCreditCard /> {o.isPaid ? 'Paid' : 'Payment Pending'}
                          </div>
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 ${getStatusColor(o.status)}`}>
                            <FaTruck /> {o.status || 'Pending'}
                          </div>
                          {o.shippingAddress && (
                            <div className="text-sm text-gray-600 flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl border-2 border-gray-200 ml-auto">
                              <FaMapMarkerAlt className="text-primary-500"/> 
                              <span className="font-medium">{o.shippingAddress.address}, {o.shippingAddress.city}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserDashboard;