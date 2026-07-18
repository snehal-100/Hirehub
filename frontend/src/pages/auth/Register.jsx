import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Phone, UserCheck, AlertCircle, Briefcase, RefreshCw } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'CANDIDATE',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const userData = await register(formData);
      if (userData.role === 'RECRUITER') {
        window.location.href = '/recruiter/dashboard';
      } else {
        window.location.href = '/candidate/dashboard';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email might be in use.');
    } finally {
      setLoading(false);
    }
  };

  const handleSpotlightMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950 px-4 py-20 overflow-hidden bg-grid-pattern">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-[15%] -left-[10%] h-[600px] w-[600px] rounded-full bg-indigo-600/15 blur-[130px] animate-orb-1"></div>
        <div className="absolute -top-[15%] -right-[10%] h-[550px] w-[550px] rounded-full bg-violet-600/10 blur-[120px] animate-orb-2"></div>
      </div>

      {/* Main Centered Register Card */}
      <div
        onMouseMove={handleSpotlightMouseMove}
        className="relative w-full max-w-xl spotlight-card p-8 sm:p-10 shadow-2xl backdrop-blur-3xl flex flex-col items-center border border-white/5 bg-slate-900/15 group cursor-default z-10"
      >
        {/* Header Logo Badge */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xl shadow-indigo-500/20 mb-6 group-hover:scale-105 transition-all duration-300">
          <Briefcase size={26} />
        </div>

        {/* Title */}
        <div className="text-center space-y-2 mb-8 select-none">
          <h2 className="text-3xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent text-glow-indigo">
            Create Account
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Join the verified platform to begin matching profiles.
          </p>
        </div>

        {error && (
          <div className="w-full flex items-center space-x-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-455 mb-6">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          {/* Role Toggle Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block pl-1">
              Select Intent
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'CANDIDATE' }))}
                className={`py-3.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  formData.role === 'CANDIDATE'
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                    : 'border-slate-850 bg-slate-950/40 text-slate-500 hover:border-slate-800'
                }`}
              >
                I want to Apply
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'RECRUITER' }))}
                className={`py-3.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  formData.role === 'RECRUITER'
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                    : 'border-slate-855 bg-slate-955/40 text-slate-500 hover:border-slate-800'
                }`}
              >
                I want to Hire
              </button>
            </div>
          </div>

          {/* Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 pl-1">
                First Name *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-655">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-850 bg-slate-950/80 py-3.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-650 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                  placeholder="John"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 pl-1">
                Last Name *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-655">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-855 bg-slate-955/80 py-3.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-650 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 pl-1">
                Email Address *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-655">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-850 bg-slate-950/80 py-3.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-655 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 pl-1">
                Password *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-655">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-850 bg-slate-955/80 py-3.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-650 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 pl-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-655">
                  <Phone size={16} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-850 bg-slate-950/80 py-3.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-650 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                  placeholder="1234567890"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-indigo-650 via-violet-650 to-indigo-650 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all hover:scale-[1.01] hover:from-indigo-600 hover:to-violet-600 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-4.5 w-4.5 animate-spin text-white" />
            ) : (
              <span className="flex items-center space-x-1.5">
                <UserCheck size={14} />
                <span>Create Session Account</span>
              </span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400 pt-6 border-t border-slate-850/60 mt-8 w-full">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-indigo-400 hover:text-indigo-305 transition-colors cursor-pointer hover:underline"
          >
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
