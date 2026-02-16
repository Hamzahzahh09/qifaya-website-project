'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Chrome, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { post } from '@/lib/api';

export default function AuthPage() {
    const [type, setType] = useState<'login' | 'register'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const endpoint = type === 'login' ? '/auth/login' : '/auth/register';
            const payload = type === 'login'
                ? { email: formData.email, password: formData.password }
                : {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    password: formData.password
                };

            const response = await post(endpoint, payload);

            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));

            window.location.href = '/';
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
            setIsLoading(false);
        }
    };

    const ImageSection = () => (
        <div className="hidden md:block w-[45%] h-full relative p-4">
            <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-2xl">
                <Image
                    src="/images/auth-hero.jpg"
                    alt="Qifaya Model"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/5" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-6xl h-full md:h-[85vh] bg-white rounded-[2.5rem] flex flex-col md:flex-row overflow-hidden border border-zinc-100 shadow-sm relative">

                {/* Mobile logic: Header */}
                <div className="md:hidden p-6 pb-0">
                    <span className="text-xl font-bold tracking-tight text-[#6D1B1B]">Qifaya</span>
                </div>

                {/* Form Section */}
                <div className={`flex-1 flex flex-col p-8 md:p-16 ${type === 'register' ? 'md:order-last' : ''}`}>
                    <div className="hidden md:block mb-8">
                        <span className="text-xl font-bold tracking-tight text-[#6D1B1B]">Qifaya</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-zinc-900 mb-2 tracking-tight">
                            {type === 'login' ? 'Assalamu’alaikum, welcome back.' : 'Join your modest fashion community.'}
                        </h1>
                        <p className="text-zinc-500 text-xs font-medium">
                            Designed to Be Seen, Made to be Remembered.
                        </p>
                    </div>


                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                        <AnimatePresence mode="wait">
                            {type === 'register' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex gap-4"
                                >
                                    <div className="flex-1 space-y-1">
                                        <label className="text-[10px] font-bold text-zinc-800 ml-1">First Name</label>
                                        <div className="relative">
                                            <input
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                type="text"
                                                placeholder="Enter Your First Name"
                                                className="w-full bg-white border border-[#A5E1EF] rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-[#00ACC1] transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <label className="text-[10px] font-bold text-zinc-800 ml-1">Last Name</label>
                                        <div className="relative">
                                            <input
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                type="text"
                                                placeholder="Enter your Last Name"
                                                className="w-full bg-white border border-[#A5E1EF] rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-[#00ACC1] transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-1">
                            {type === 'register' && <label className="text-[10px] font-bold text-zinc-800 ml-1">Email</label>}
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-[#A5E1EF] pr-3 text-[#00ACC1]">
                                    <Mail size={16} />
                                </div>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    type="email"
                                    placeholder="Enter Your Email"
                                    className="w-full bg-white border border-[#A5E1EF] rounded-xl py-3 pl-16 pr-4 text-xs focus:outline-none focus:border-[#00ACC1] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                {type === 'register' && <label className="text-[10px] font-bold text-zinc-800 ml-1">Password</label>}
                            </div>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-zinc-100 pr-3 text-zinc-300">
                                    <Lock size={16} />
                                </div>
                                <input
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    type="password"
                                    placeholder="Enter Your Password"
                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3 pl-16 pr-4 text-xs focus:outline-none focus:border-[#00ACC1] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-[10px] font-medium ml-1">{error}</p>}

                        <button
                            disabled={isLoading}
                            className="w-full bg-[#00ACC1] hover:bg-[#0097A7] text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#00ACC1]/20 mt-4 h-12 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                type === 'login' ? 'Sign In' : 'Sign Up'
                            )}
                        </button>

                        <button
                            type="button"
                            className="w-full bg-white border border-zinc-200 text-zinc-900 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 h-12"
                        >
                            <Image src="https://www.google.com/favicon.ico" width={16} height={16} alt="Google" className="mr-1" />
                            {type === 'login' ? 'Sign in with Google' : 'Signup with Google'}
                        </button>

                        <div className="text-center md:text-left mt-4">
                            <p className="text-zinc-400 text-[10px] font-medium">
                                {type === 'login' ? 'Already have account? ' : 'Already have account? '}
                                <button
                                    type="button"
                                    onClick={() => setType(type === 'login' ? 'register' : 'login')}
                                    className="text-[#00ACC1] font-bold hover:underline"
                                >
                                    {type === 'login' ? 'Sign Up' : 'Sign up'}
                                </button>
                            </p>
                        </div>
                    </form>

                    {/* Badge Section (Desktop Only) */}
                    <div className="hidden md:flex mt-auto bg-[#F9F9F9] rounded-2xl p-4 items-center justify-between max-w-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 flex items-center justify-center overflow-hidden">
                                        <div className="w-full h-full bg-zinc-300 rounded-full" />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-zinc-800">Join with 20k+ Users!</p>
                                <p className="text-[8px] text-zinc-400">Let's see our happy customer</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                            <ArrowUpRight size={16} />
                        </div>
                    </div>
                </div>

                {/* Right Section: Image */}
                <ImageSection />
            </div>
        </div>
    );
}
