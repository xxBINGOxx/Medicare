import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post('/api/contact', formData);
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
    } catch(err) {
        toast.error('Failed to send message.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Get In Touch</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
       
        <div className="grid lg:grid-cols-2 gap-12 mb-16 max-w-7xl mx-auto">
          {/* Form Side - LEFT */}
          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-200">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Send us a Message</h2>
              <p className="text-gray-600">Fill out the form below and we'll get back to you shortly.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input 
                  placeholder="John Doe" 
                  className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" 
                  value={formData.name} 
                  onChange={e=>setFormData({...formData, name:e.target.value})} 
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input 
                  placeholder="john@example.com" 
                  type="email" 
                  className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" 
                  value={formData.email} 
                  onChange={e=>setFormData({...formData, email:e.target.value})} 
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <input 
                  placeholder="How can we help you?" 
                  className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" 
                  value={formData.subject} 
                  onChange={e=>setFormData({...formData, subject:e.target.value})} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea 
                  placeholder="Tell us more about your inquiry..." 
                  rows="6" 
                  className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none" 
                  value={formData.message} 
                  onChange={e=>setFormData({...formData, message:e.target.value})} 
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Info Side - RIGHT */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-start gap-5">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-5 rounded-2xl text-white shadow-lg flex-shrink-0">
                  <FaPhone size={28}/>
                </div>
                <div>
                  <h3 className="font-bold text-2xl mb-2 text-gray-800">Phone</h3>
                  <p className="text-gray-600 text-lg">+20 123 456 789</p>
                  <p className="text-gray-500 text-sm mt-1">Mon-Fri: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-start gap-5">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-5 rounded-2xl text-white shadow-lg flex-shrink-0">
                  <FaEnvelope size={28}/>
                </div>
                <div>
                  <h3 className="font-bold text-2xl mb-2 text-gray-800">Email</h3>
                  <p className="text-gray-600 text-lg">info@medicare.com</p>
                  <p className="text-gray-500 text-sm mt-1">We'll respond within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-start gap-5">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-5 rounded-2xl text-white shadow-lg flex-shrink-0">
                  <FaMapMarkerAlt size={28}/>
                </div>
                <div>
                  <h3 className="font-bold text-2xl mb-2 text-gray-800">Location</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Hod Sakrah WA Abu Hamad,<br/>
                    New Borg El Arab,<br/>
                    Alexandria Governorate
                  </p>
                </div>
              </div>
            </div>

            {/* Optional: Business Hours Card */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-3xl border-2 border-primary-200">
              <h3 className="font-bold text-xl mb-4 text-primary-900">Business Hours</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sunday</span>
                  <span className="text-red-600 font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Find Us Here</h2>
          <div className="rounded-3xl overflow-hidden shadow-2xl h-96 border-4 border-white">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54797.191096470604!2d29.5888173544922!3d30.86358979143509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145f7d5dcf4dc447%3A0xfbf1eb15d4fed589!2sEgypt%20Japan%20University%20Of%20Science%20%26%20Technology!5e0!3m2!1sen!2seg!4v1766040618796!5m2!1sen!2seg" 
              width="100%" 
              height="100%" 
              style={{border:0}} 
              allowFullScreen="" 
              loading="lazy"
            >
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;