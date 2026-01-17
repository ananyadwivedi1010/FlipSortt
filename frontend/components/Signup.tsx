
import React, { useState } from 'react';
import { AppView } from '../types.ts';

interface SignupProps {
    setView: (view: AppView) => void;
    setIsLoggedIn: (value: boolean) => void;
}

const Signup: React.FC<SignupProps> = ({ setView, setIsLoggedIn }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && email && password) {
            setIsLoggedIn(true);
            setView('Home');
        } else {
            alert("Please fill all details");
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-6">
            <div className="bg-white rounded-[2rem] shadow-xl p-10 w-full max-w-md border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-[#2874f0]"></div>
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Get Started</h2>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Join FlipIntegrity</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-700 outline-none focus:border-[#2874f0] transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Email ID</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-700 outline-none focus:border-[#2874f0] transition-colors"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-700 outline-none focus:border-[#2874f0] transition-colors"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-[38px] text-gray-400 hover:text-[#2874f0] transition-colors text-xs font-black uppercase tracking-wider"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <button type="submit" className="w-full bg-[#2874f0] text-white py-4 rounded-xl font-black text-lg shadow-lg hover:bg-[#1e5ebc] transition-transform active:scale-95 uppercase tracking-widest">
                        Create Account
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs font-bold text-gray-500">
                        Already have an account? <button onClick={() => setView('Login')} className="text-[#2874f0] hover:underline uppercase tracking-wide ml-1">Login</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
