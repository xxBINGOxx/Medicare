const Footer = () => (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
            <div>
                <h2 className="text-2xl font-bold mb-4 text-primary-500">MediCare</h2>
                <p className="text-gray-400 leading-relaxed">Your trusted partner for health and wellness. Delivering genuine medicines to your doorstep.</p>
            </div>
            <div>
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-gray-400">
                    <li><a href="/" className="hover:text-primary-500">Home</a></li>
                    <li><a href="/shop" className="hover:text-primary-500">Shop</a></li>
                    <li><a href="/contact" className="hover:text-primary-500">Contact Us</a></li>
                </ul>
            </div>
            <div>
                <h3 className="text-xl font-bold mb-4">Contact Info</h3>
                <p className="text-gray-400">📍 Hod Sakrah WA Abu Hamad, Borg El Arab, Alexandria, Egypt</p>
                <p className="text-gray-400 mt-2">📞 +20 123 456 789</p>
                <p className="text-gray-400 mt-2">✉️ support@medicare.com</p>
            </div>
        </div>
        <div className="text-center mt-12 border-t border-gray-800 pt-8 text-gray-500 text-sm">
            © 2025 MediCare Pharmacy. All rights reserved.
        </div>
    </footer>
);
export default Footer;
