import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const PaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); 
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // 1. Get all params from URL
                const params = Object.fromEntries([...searchParams]);
                
                // 2. Send to Backend
                const { data } = await axios.post('/api/payment/verify', params);

                if (data.success) {
                    setStatus('success');
                    setMessage('Payment Successful! Redirecting...');
                    
                    // Clear Cart
                    const user = JSON.parse(localStorage.getItem('userInfo'));
                    if(user) localStorage.removeItem(`cartItems_${user._id}`);
                    
                    setTimeout(() => navigate('/dashboard'), 3000);
                } else {
                    setStatus('failed');
                    setMessage('Payment Verification Failed.');
                }
            } catch (error) {
                console.error(error);
                setStatus('failed');
                setMessage('Error verifying payment.');
            }
        };

        if (searchParams.get('hmac')) {
            verifyPayment();
        } else {
            setStatus('failed');
            setMessage('No payment data found.');
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
                        <h2 className="text-xl font-bold text-gray-700">Processing...</h2>
                        <p className="text-gray-500">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <FaCheckCircle className="text-5xl text-green-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <button onClick={() => navigate('/dashboard')} className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition">
                            Go to Dashboard
                        </button>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="flex flex-col items-center">
                        <FaTimesCircle className="text-5xl text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <button onClick={() => navigate('/cart')} className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-900 transition">
                            Return to Cart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentCallback;