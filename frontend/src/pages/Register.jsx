import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register = () => {
  const [data, setData] = useState({ name: '', email: '', password: '', phone: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post('/api/auth/register', data);
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        window.dispatchEvent(new Event('storage'));
        toast.success('Account Created');
        navigate('/');
    } catch(err) {
        toast.error(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleRegister} className="bg-white p-10 rounded-2xl shadow-xl w-96 border border-gray-100">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Create Account</h2>
            <input className="w-full border p-4 rounded-xl mb-4 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Full Name" value={data.name} onChange={e=>setData({...data, name:e.target.value})} />
            <input className="w-full border p-4 rounded-xl mb-4 focus:ring-2 focus:ring-primary-500 outline-none" type="email" placeholder="Email" value={data.email} onChange={e=>setData({...data, email:e.target.value})} />
            <input className="w-full border p-4 rounded-xl mb-4 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Phone" value={data.phone} onChange={e=>setData({...data, phone:e.target.value})} />
            <input className="w-full border p-4 rounded-xl mb-6 focus:ring-2 focus:ring-primary-500 outline-none" type="password" placeholder="Password" value={data.password} onChange={e=>setData({...data, password:e.target.value})} />
            <button className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition">Register</button>
            <p className="mt-6 text-center text-gray-600">Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Login</Link></p>
        </form>
    </div>
  );
};
export default Register;
