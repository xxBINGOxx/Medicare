import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => (
    <a 
        href="https://wa.me/201000000000" 
        target="_blank" 
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-green-500 text-white p-3 md:p-4 rounded-full shadow-2xl hover:scale-110 z-50 opacity-70 hover:opacity-100 transition-all duration-300"
    >
        <FaWhatsapp className="w-6 h-6 md:w-8 md:h-8" />
    </a>
);

export default WhatsAppButton;