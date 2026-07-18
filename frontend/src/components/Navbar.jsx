import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Briefcase, Bell, LogOut, User as UserIcon, Menu, X, CheckSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.slice(0, 5));
      const countRes = await api.get('/notifications/unread-count');
      setUnreadCount(countRes.data.count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
      isActive(path)
        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/25 shadow-sm'
        : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
    }`;

  return (
    <div className="sticky top-0 z-50 w-full px-4 pt-4 select-none">
      <div className="mx-auto max-w-7xl rounded-2xl border border-white/5 bg-slate-950/75 backdrop-blur-xl px-6 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-505 text-white shadow-lg shadow-indigo-500/20 transition-all group-hover:scale-105">
                <Briefcase size={18} />
              </div>
              <span className="bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-lg font-bold tracking-tight text-transparent">
                HireHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              <Link to="/" className={linkClass('/')}>Home</Link>
              <Link to="/jobs" className={linkClass('/jobs')}>Find Jobs</Link>

              {user && user.role === 'CANDIDATE' && (
                <>
                  <Link to="/candidate/dashboard" className={linkClass('/candidate/dashboard')}>Dashboard</Link>
                  <Link to="/candidate/profile" className={linkClass('/candidate/profile')}>Profile</Link>
                </>
              )}

              {user && user.role === 'RECRUITER' && (
                <>
                  <Link to="/recruiter/dashboard" className={linkClass('/recruiter/dashboard')}>Dashboard</Link>
                  <Link to="/recruiter/post-job" className={linkClass('/recruiter/post-job')}>Post Job</Link>
                  <Link to="/recruiter/profile" className={linkClass('/recruiter/profile')}>Company</Link>
                </>
              )}

              {user && user.role === 'ADMIN' && (
                <>
                  <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>Admin Dashboard</Link>
                </>
              )}
            </div>
          </div>

          {/* User Controls & Bell */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (!showNotifications) fetchNotifications();
                    }}
                    className="relative rounded-full p-2 text-slate-405 hover:bg-slate-900/60 hover:text-white transition-all duration-300"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-slate-950">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-850 bg-slate-950 p-2 shadow-2xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-3 duration-200 z-50">
                      <div className="flex items-center justify-between border-b border-slate-900 px-3 py-2">
                        <span className="font-bold text-xs uppercase text-slate-400">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="flex items-center space-x-1 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors font-bold uppercase cursor-pointer"
                          >
                            <CheckSquare size={10} />
                            <span>Mark read</span>
                          </button>
                        )}
                      </div>
                      <div className="max-h-60 overflow-y-auto py-1">
                        {notifications.length === 0 ? (
                          <p className="text-center text-xs text-slate-500 py-6 font-semibold">No new events.</p>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              className={`px-3 py-2.5 rounded-xl hover:bg-slate-900/40 transition-all ${
                                !n.isRead ? 'bg-indigo-950/10 border-l-2 border-indigo-505' : ''
                              }`}
                            >
                              <p className="text-xs font-bold text-slate-200">{n.title}</p>
                              <p className="text-[10px] text-slate-450 mt-0.5 font-medium leading-relaxed">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile info */}
                <div className="flex items-center space-x-3 pl-3 border-l border-slate-900">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-200 leading-tight">{user.firstName} {user.lastName}</span>
                    <span className="text-[9px] text-indigo-400 font-extrabold tracking-wider uppercase mt-0.5">{user.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/40 text-slate-400 hover:bg-rose-500/10 hover:text-rose-455 transition-all duration-300 border border-slate-800/40 cursor-pointer"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-indigo-550 transition-all hover:scale-102 cursor-pointer"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-slate-900 hover:text-white focus:outline-none transition-colors cursor-pointer"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border border-white/5 rounded-2xl bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-2 mt-2 shadow-2xl">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-900 hover:text-white"
          >
            Home
          </Link>
          <Link
            to="/jobs"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-900 hover:text-white"
          >
            Find Jobs
          </Link>

          {user && user.role === 'CANDIDATE' && (
            <>
              <Link
                to="/candidate/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                to="/candidate/profile"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                Profile
              </Link>
            </>
          )}

          {user && user.role === 'RECRUITER' && (
            <>
              <Link
                to="/recruiter/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                to="/recruiter/post-job"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                Post Job
              </Link>
              <Link
                to="/recruiter/profile"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                Company
              </Link>
            </>
          )}

          {user && user.role === 'ADMIN' && (
            <Link
              to="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              Admin Dashboard
            </Link>
          )}

          {user ? (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full text-left flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-455 hover:bg-rose-500/10 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          ) : (
            <div className="pt-4 border-t border-slate-900 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-900"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
