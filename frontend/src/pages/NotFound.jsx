import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-2xl w-full">
        
        <div className="flex justify-center mb-8">
          <div className="relative">
            
            <div className="absolute inset-0 bg-red-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <FaExclamationTriangle className="text-8xl text-red-500 relative z-10 drop-shadow-lg" />
          </div>
        </div>

        
        <div className="text-center mb-8">
          <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 tracking-tight">
            404
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto mt-4 rounded-full"></div>
        </div>

        
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-200 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 text-base md:text-lg leading-relaxed max-w-md mx-auto">
            The medicine or page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
          >
            <FaHome className="text-xl" />
            <span>Back to Home</span>
          </Link>
        </div>

        
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-3">You might also want to:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/medicines" className="text-teal-600 hover:text-teal-700 font-medium text-sm hover:underline">
              Browse Medicines
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/contact" className="text-teal-600 hover:text-teal-700 font-medium text-sm hover:underline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;