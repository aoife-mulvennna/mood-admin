import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { variables } from '../Variables';

const ResetStaffPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch(`${variables.API_URL}reset-staff-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Password reset successfully. You can now log in.');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setMessage(data.message || 'Failed to reset password.');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setMessage('An error occurred while resetting the password.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
                <h3 className="text-2xl font-bold text-center mb-6">Reset Staff Password</h3>
                {message && (
                    <div className="text-center mb-4">{message}</div>
                )}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition"
                        >
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetStaffPassword;
