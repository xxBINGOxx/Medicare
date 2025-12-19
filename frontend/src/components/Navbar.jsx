import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaPills, FaUser, FaCaretDown, FaBars, FaTimes, FaHome, FaBoxOpen, FaEnvelope, FaSignOutAlt, FaTachometerAlt, FaUserCircle } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const checkUser = () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      setUser(userInfo);
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem('userInfo');
    window.dispatchEvent(new Event('storage'));
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/shop', label: 'Products', icon: FaBoxOpen },
    { path: '/contact', label: 'Contact', icon: FaEnvelope }
  ];

  return (
    <nav className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-lg' : 'shadow-md'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 sm:gap-3 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 sm:p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <FaPills className="text-white text-xl sm:text-2xl" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              MediCare
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <Icon className="text-sm" />
                {label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Cart Icon */}
            <Link 
              to="/cart" 
              className="relative p-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 group"
            >
              <FaShoppingCart className="text-xl sm:text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
           
            {/* User Section */}
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* Admin Dropdown */}
                {user.isAdmin ? (
                  <div className="relative">
                    <button 
                      onClick={() => setDropdownOpen(!dropdownOpen)} 
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 font-semibold hover:from-blue-100 hover:to-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <FaUser className="text-sm" />
                      <span className="hidden sm:inline">{user.name}</span>
                      <span className="hidden md:inline text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Admin</span>
                      <FaCaretDown className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                      <>
                        {/* Backdrop for mobile */}
                        <div 
                          className="fixed inset-0 z-40 lg:hidden" 
                          onClick={() => setDropdownOpen(false)}
                        />
                        
                        <div 
                          className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn"
                          onMouseLeave={() => setDropdownOpen(false)}
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          
                          <Link 
                            to="/admin" 
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 border-b border-gray-50"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaTachometerAlt className="text-blue-600" />
                            <span className="font-medium">Admin Dashboard</span>
                          </Link>
                          
                          <Link 
                            to="/dashboard" 
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaUserCircle className="text-blue-600" />
                            <span className="font-medium">My Profile</span>
                          </Link>
                          
                          <div className="border-t border-gray-100 mt-2 pt-2">
                            <button 
                              onClick={logout}
                              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 font-medium"
                            >
                              <FaSignOutAlt />
                              <span>Logout</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  /* Normal User */
                  <>
                    <Link 
                      to="/dashboard" 
                      className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-semibold hover:bg-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <FaUser className="text-sm" />
                      {user.name}
                    </Link>
                    
                    <button 
                      onClick={logout}
                      className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 border border-red-200 hover:bg-red-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                      <FaSignOutAlt className="text-sm" />
                      Logout
                    </button>
                  </>
                )}
              </div>
            ) : (
              /* Guest User */
              <div className="hidden sm:flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 animate-slideDown">
            {/* Navigation Links */}
            <div className="space-y-1 mb-4">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive(path)
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon />
                  {label}
                </Link>
              ))}
            </div>

            {/* Mobile User Section */}
            {user ? (
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="px-4 py-2 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  {user.isAdmin && (
                    <span className="inline-block mt-1 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                  >
                    <FaTachometerAlt />
                    Admin Dashboard
                  </Link>
                )}
                
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                >
                  <FaUserCircle />
                  My Profile
                </Link>
                
                <button
                  onClick={logout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 font-medium"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-center text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;