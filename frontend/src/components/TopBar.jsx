import { FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const TopBar = () => {
  return (
    <div className="bg-primary-700 text-white py-2 px-6 flex justify-between items-center text-sm">
        <div className="flex gap-6">
            <span className="flex items-center gap-2"><FaPhone /> +20 123 456 789</span>
            <span className="flex items-center gap-2"><FaEnvelope /> support@medicare.com</span>
        </div>
        <div className="flex gap-4">
            <FaFacebook className="cursor-pointer hover:text-gray-300"/>
            <FaTwitter className="cursor-pointer hover:text-gray-300"/>
            <FaInstagram className="cursor-pointer hover:text-gray-300"/>
        </div>
    </div>
  );
};
export default TopBar;
