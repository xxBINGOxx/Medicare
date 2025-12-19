import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const { data } = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('userInfo', JSON.stringify(data));
        window.dispatchEvent(new Event('storage'));
        toast.success('Welcome back ' + data.name);
        navigate(data.isAdmin ? '/admin' : '/dashboard');
    } catch(err) {
        toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-2xl shadow-xl w-96 border border-gray-100">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Welcome Back</h2>
            <input className="w-full border p-4 rounded-xl mb-4 focus:ring-2 focus:ring-primary-500 outline-none" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="w-full border p-4 rounded-xl mb-6 focus:ring-2 focus:ring-primary-500 outline-none" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition">Login</button>
            <p className="mt-6 text-center text-gray-600">New here? <Link to="/register" className="text-primary-600 font-bold hover:underline">Create Account</Link></p>
        </form>
    </div>
  );
};
export default Login;
