import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Briefcase, RefreshCw, Terminal, ShieldCheck, Cpu, Activity } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const userData = await login(email, password);
      if (userData.role === 'ADMIN') {
        window.location.href = '/admin/dashboard';
      } else if (userData.role === 'RECRUITER') {
        window.location.href = '/recruiter/dashboard';
      } else {
        window.location.href = '/candidate/dashboard';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
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
    <div className="min-h-[calc(100vh-4rem)] flex items-stretch bg-slate-950 overflow-hidden bg-grid-pattern relative">
      
      {/* Dynamic Background Mesh Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[15%] -left-[10%] h-[700px] w-[700px] rounded-full bg-indigo-600/10 blur-[140px] animate-orb-1"></div>
        <div className="absolute -bottom-[15%] -right-[10%] h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[130px] animate-orb-2"></div>
      </div>

      {/* LEFT PANEL: Branding & Futuristic Telemetry Mockup */}
      <div 
        onMouseMove={handleSpotlightMouseMove}
        className="hidden md:flex flex-col justify-between w-1/2 p-16 border-r border-slate-900 bg-slate-900/10 backdrop-blur-2xl relative overflow-hidden group cursor-default select-none z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        {/* Top brand */}
        <div className="space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/5 px-4.5 py-2 text-[10px] font-bold tracking-widest text-indigo-400 uppercase shadow-sm">
            <Cpu size={12} className="animate-pulse" />
            <span>Authentication Gate v1.4</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight">
            Access the{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-500 bg-clip-text text-transparent text-glow-indigo">
              HireHub OS
            </span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed font-semibold max-w-sm">
            Inspect corporate vacancy boards, match profiles using our compatibility gauge, and review recruiter credentials.
          </p>
        </div>

        {/* Visual Mockup: Futuristic Telemetry Console */}
        <div className="relative z-10 rounded-2xl border border-slate-850 bg-slate-950 p-6 shadow-2xl space-y-4 animate-float">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-indigo-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Console Shell</span>
            </div>
            <div className="flex gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500/50"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500/50"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/50"></span>
            </div>
          </div>

          <div className="font-mono text-[10px] text-slate-400 space-y-1.5">
            <p className="text-indigo-455">$ check-telemetry --status</p>
            <p className="text-emerald-450">[ONLINE] Security configuration verified.</p>
            <p className="text-emerald-450">[ONLINE] Spring Boot JPA layer verified.</p>
            <p className="text-slate-500">[LOGS] Loaded admin@hirehub.com</p>
            <p className="text-slate-500">[LOGS] Session authorization: JWT bearer</p>
          </div>

          <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[9px] text-slate-500 font-bold">
            <span>TLS ENCRYPTED</span>
            <span className="flex items-center gap-1">
              <Activity size={10} className="text-emerald-500 animate-pulse" />
              <span>STABLE</span>
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider relative z-10 pl-1 select-none">
          <ShieldCheck size={14} className="text-indigo-505" />
          <span>Talent telemetry systems active</span>
        </div>
      </div>

      {/* RIGHT PANEL: Centered Form Card */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 sm:p-12 relative z-10">
        <div
          onMouseMove={handleSpotlightMouseMove}
          className="w-full max-w-md spotlight-card p-8 sm:p-10 shadow-2xl backdrop-blur-3xl flex flex-col border border-white/5 bg-slate-900/15 group cursor-default"
        >
          {/* Header Logo */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xl shadow-indigo-500/20 mb-6 self-center md:self-start group-hover:scale-105 transition-all duration-300">
            <Briefcase size={26} />
          </div>

          {/* Title */}
          <div className="text-center md:text-left space-y-2 mb-8 select-none">
            <h2 className="text-3xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent text-glow-indigo">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-405 font-semibold">
              Enter credentials to initialize secure session.
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
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block pl-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-600">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-850 bg-slate-950/80 py-3.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-650 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block pl-1">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-600">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-850 bg-slate-950/80 py-3.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-650 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-indigo-650 via-violet-650 to-indigo-650 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all hover:scale-[1.01] hover:from-indigo-600 hover:to-violet-600 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="h-4.5 w-4.5 animate-spin text-white" />
              ) : (
                <span className="flex items-center space-x-1.5">
                  <LogIn size={13} />
                  <span>Initialize Session</span>
                </span>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center text-xs text-slate-400 pt-6 border-t border-slate-850/60 mt-8 w-full select-none">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-indigo-400 hover:text-indigo-305 transition-colors cursor-pointer hover:underline"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
