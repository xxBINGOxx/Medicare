import { Link } from 'react-router-dom';
import { FaTruck, FaShieldAlt, FaHeadset, FaPills, FaStethoscope, FaHeart } from 'react-icons/fa';

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 py-28 px-6 overflow-hidden">
        
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-300 rounded-full opacity-10 blur-3xl"></div>
        
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="flex-1">
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
                    Your Health Is Our 
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">Priority</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
                    Get genuine medicines, vitamins, and personal care products delivered to your doorstep within hours. Trusted by thousands across Alexandria.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Link to="/shop" className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-10 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
                        <FaPills /> Shop Now
                    </Link>
                    <Link to="/contact" className="bg-white text-primary-600 px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-primary-200">
                        Contact Us
                    </Link>
                </div>
            </div>
            <div className="flex-1">
                <img src="matrix.jpg" className="rounded-3xl shadow-2xl transform hover:scale-105 transition duration-500" alt="Pharmacy" />
            </div>
        </div>
      </section>

      
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-primary-600">MediCare?</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We're committed to providing exceptional pharmaceutical services with convenience, quality, and care.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { 
                icon: <FaTruck className="text-4xl" />, 
                title: "Fast Delivery", 
                text: "Same-day delivery within Alexandria. Order before 3 PM and get it today!",
                color: "from-blue-500 to-blue-600"
              },
              { 
                icon: <FaShieldAlt className="text-4xl" />, 
                title: "100% Genuine", 
                text: "All products sourced directly from certified manufacturers. Quality guaranteed.",
                color: "from-green-500 to-green-600"
              },
              { 
                icon: <FaHeadset className="text-4xl" />, 
                title: "24/7 Support", 
                text: "Licensed pharmacists available round the clock to answer your questions.",
                color: "from-purple-500 to-purple-600"
              }
            ].map((f, i) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition duration-300 rounded-3xl blur-xl" style={{background: `linear-gradient(to right, ${f.color})`}}></div>
                <div className="relative bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${f.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-2xl mb-4 text-gray-900">{f.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div className="space-y-2">
              <div className="text-5xl font-bold">10K+</div>
              <div className="text-primary-100 uppercase tracking-wide text-sm">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold">5K+</div>
              <div className="text-primary-100 uppercase tracking-wide text-sm">Products Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold">98%</div>
              <div className="text-primary-100 uppercase tracking-wide text-sm">Satisfaction Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold">24/7</div>
              <div className="text-primary-100 uppercase tracking-wide text-sm">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-24 px-6">
         <div className="container mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 relative">
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary-200 rounded-full opacity-30 blur-2xl"></div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-primary-300 rounded-full opacity-20 blur-3xl"></div>
                <img src="https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800" className="rounded-3xl shadow-2xl relative z-10 hover:scale-105 transition duration-500" alt="About Us" />
            </div>
            <div className="flex-1">
                <span className="inline-block bg-primary-100 text-primary-700 font-semibold px-4 py-2 rounded-full mb-4 text-sm tracking-wide">
                    ABOUT US
                </span>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                    Reliable & Affordable Healthcare Services
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                    MediCare connects you with the widest range of pharmaceutical products. We are dedicated to improving patient health outcomes by providing a seamless digital experience that prioritizes your wellbeing.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="bg-primary-100 p-2 rounded-lg mt-1">
                      <FaPills className="text-primary-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Wide Product Range</div>
                      <div className="text-gray-600 text-sm">From prescription medicines to wellness products</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary-100 p-2 rounded-lg mt-1">
                      <FaStethoscope className="text-primary-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Expert Consultation</div>
                      <div className="text-gray-600 text-sm">Licensed pharmacists ready to assist you</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary-100 p-2 rounded-lg mt-1">
                      <FaHeart className="text-primary-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Patient-Centered Care</div>
                      <div className="text-gray-600 text-sm">Your health and satisfaction are our priority</div>
                    </div>
                  </li>
                </ul>
                <Link to="/about" className="inline-block bg-primary-600 text-white px-8 py-4 rounded-full font-bold hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Discover Our Story
                </Link>
            </div>
         </div>
      </section>

      {/* Trusted Partners Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Trusted Partners</h2>
            <p className="text-gray-600 mb-12 text-lg">We work with leading pharmaceutical companies worldwide</p>
            
            {/* Logos Grid */}
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
                <img src="pfizer.png" alt="Pfizer" className="h-12 md:h-14 object-contain opacity-60 hover:opacity-100 transition duration-300 grayscale hover:grayscale-0" />
                <img src="novartis.png" alt="Novartis" className="h-8 md:h-9 object-contain opacity-60 hover:opacity-100 transition duration-300 grayscale hover:grayscale-0" />
                <img src="roche.png" alt="Roche" className="h-12 md:h-14 object-contain opacity-60 hover:opacity-100 transition duration-300 grayscale hover:grayscale-0" />
                <img src="pharco.png" alt="Pharco" className="h-12 md:h-14 object-contain opacity-60 hover:opacity-100 transition duration-300 grayscale hover:grayscale-0" />
                <img src="gsk.png" alt="GSK" className="h-12 md:h-14 object-contain opacity-60 hover:opacity-100 transition duration-300 grayscale hover:grayscale-0" />
            </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Experience Better Healthcare?
          </h2>
          <p className="text-primary-100 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust MediCare for their pharmaceutical needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/shop" className="bg-white text-primary-700 px-10 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Start Shopping
            </Link>
            <Link to="/contact" className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-primary-700 transition-all duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
export default Home;