import React, { useState } from 'react';
import { variables } from '../Variables';
import { useNavigate } from 'react-router-dom';

const ForgotStaffPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${variables.API_URL}forgot-staff-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('A reset link has been sent to your email address.');
            } else {
                setMessage(data.message || 'Failed to send reset link.');
            }
        } catch (error) {
            console.error('Error sending reset link:', error);
            setMessage('An error occurred while sending the reset link.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
                <h3 className="text-2xl font-bold text-center mb-6">Forgot Staff Password</h3>
                {message && (
                    <div className="text-center mb-4">{message}</div>
                )}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Staff Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition"
                        >
                            Send Reset Link
                        </button>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="text-sm text-gray-600 hover:underline"
                    >
                        Go back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotStaffPassword;
