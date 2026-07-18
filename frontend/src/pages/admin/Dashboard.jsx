import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Shield, Users, Briefcase, FileText, CheckCircle2, UserX, UserCheck, Trash2, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/admin/dashboard');
      setDashboardStats(statsRes.data);
    } catch (err) {
      console.error('Stats failed to fetch', err);
    }

    try {
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Users failed to fetch', err);
    }

    try {
      const recruitersRes = await api.get('/admin/recruiters');
      setRecruiters(recruitersRes.data || []);
    } catch (err) {
      console.error('Recruiters failed to fetch', err);
    }

    try {
      const jobsRes = await api.get('/admin/jobs');
      setJobs(jobsRes.data || []);
    } catch (err) {
      console.error('Jobs failed to fetch', err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyRecruiter = async (recruiterId) => {
    try {
      await api.put(`/admin/recruiters/${recruiterId}/verify`);
      setRecruiters(prev => prev.map(rec => rec.id === recruiterId ? { ...rec, verified: true } : rec));
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, enabled: !u.enabled } : u));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will remove all their profiles and records.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to remove this job posting?')) return;
    try {
      await api.delete(`/admin/jobs/${jobId}`);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const getRegistrationsChartData = () => {
    if (!dashboardStats || !dashboardStats.monthlyRegistrations) return [];
    return Object.entries(dashboardStats.monthlyRegistrations).map(([month, count]) => ({
      name: month,
      registrations: count,
    }));
  };

  const getRoleDistributionData = () => {
    const candidateCount = users.filter(u => u.role === 'CANDIDATE').length;
    const recruiterCount = users.filter(u => u.role === 'RECRUITER').length;
    const adminCount = users.filter(u => u.role === 'ADMIN').length;
    
    return [
      { name: 'Candidates', value: candidateCount, color1: '#6366f1', color2: '#4f46e5' },
      { name: 'Recruiters', value: recruiterCount, color1: '#a855f7', color2: '#7c3aed' },
      { name: 'Admins', value: adminCount, color1: '#10b981', color2: '#059669' }
    ];
  };

  const handleSpotlightMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const roleData = getRoleDistributionData();

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10 bg-grid-pattern min-h-screen">
      {/* Welcome Header with Ambient Light Backdrop */}
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-8 select-none">
        <div className="absolute -left-10 top-0 h-40 w-80 bg-indigo-550/5 blur-[80px] pointer-events-none rounded-full"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/25 shadow-lg">
              <Shield size={22} />
            </div>
            <span className="bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent text-glow-indigo">
              Platform Moderation Deck
            </span>
          </h1>
          <p className="mt-1.5 text-xs text-slate-450 font-semibold pl-14">Telemetry monitor, recruiter verification queue, and user authorization controls.</p>
        </div>
        <button 
          onClick={fetchAdminData}
          className="relative z-10 inline-flex items-center space-x-1.5 rounded-2xl border border-slate-800 bg-slate-900/35 hover:bg-slate-900/85 px-4.5 py-3 text-xs font-bold text-slate-300 hover:text-white shadow hover:scale-102 transition-all cursor-pointer"
        >
          <Sparkles size={14} className="text-indigo-400" />
          <span>Sync Telemetry</span>
        </button>
      </div>

      {/* Stats Widgets with Individual Glow Accents */}
      {dashboardStats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          {/* Total Users */}
          <div 
            onMouseMove={handleSpotlightMouseMove} 
            className="spotlight-card p-6 shadow-2xl relative cursor-default overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 hover:shadow-indigo-500/5"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Users</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Users size={16} />
              </div>
            </div>
            <p className="mt-4 text-4xl font-extrabold text-white tracking-tight relative z-10 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">{dashboardStats.totalUsers}</p>
            <div className="mt-2 text-[9px] text-slate-500 font-bold uppercase tracking-wider relative z-10">
              {dashboardStats.totalCandidates} CANDIDATES • {dashboardStats.totalRecruiters} RECRUITERS
            </div>
          </div>

          {/* Platform Jobs */}
          <div 
            onMouseMove={handleSpotlightMouseMove} 
            className="spotlight-card p-6 shadow-2xl relative cursor-default overflow-hidden group hover:border-purple-500/30 transition-all duration-500 hover:shadow-purple-500/5"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-transparent"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Platform Jobs</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Briefcase size={16} />
              </div>
            </div>
            <p className="mt-4 text-4xl font-extrabold text-white tracking-tight relative z-10 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">{dashboardStats.totalJobs}</p>
            <div className="mt-2 text-[9px] text-slate-500 font-bold uppercase tracking-wider relative z-10">Active job vacancies</div>
          </div>

          {/* Applications */}
          <div 
            onMouseMove={handleSpotlightMouseMove} 
            className="spotlight-card p-6 shadow-2xl relative cursor-default overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 hover:shadow-emerald-500/5"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-transparent"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Applications</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileText size={16} />
              </div>
            </div>
            <p className="mt-4 text-4xl font-extrabold text-white tracking-tight relative z-10 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">{dashboardStats.totalApplications}</p>
            <div className="mt-2 text-[9px] text-slate-500 font-bold uppercase tracking-wider relative z-10">Submitted portfolios</div>
          </div>

          {/* Pending Recruiter verification */}
          <div 
            onMouseMove={handleSpotlightMouseMove} 
            className="spotlight-card p-6 shadow-2xl relative cursor-default overflow-hidden group hover:border-rose-500/30 transition-all duration-500 hover:shadow-rose-500/5"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500 to-transparent"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pending</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-455 border border-rose-500/20">
                <ShieldAlert size={16} />
              </div>
            </div>
            <p className="mt-4 text-4xl font-extrabold text-white tracking-tight relative z-10 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {recruiters.filter(r => !r.verified).length}
            </p>
            <div className="mt-2 text-[9px] text-slate-500 font-bold uppercase tracking-wider relative z-10">Recruiter Queue</div>
          </div>
        </div>
      )}

      {/* Chart and Verification Grid with Gradient Fills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registrations Chart */}
        <div onMouseMove={handleSpotlightMouseMove} className="lg:col-span-2 spotlight-card p-6 shadow-xl cursor-default relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-550 to-transparent"></div>
          <h2 className="text-xs font-bold text-slate-450 uppercase tracking-widest mb-6 relative z-10">User Registration Trends</h2>
          <div className="relative z-10">
            {getRegistrationsChartData().length === 0 ? (
              <div className="h-60 flex items-center justify-center border border-dashed border-slate-850 rounded-2xl bg-slate-950/20">
                <p className="text-xs text-slate-500 font-medium">No registrations logged this month yet.</p>
              </div>
            ) : (
              <div className="w-full h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getRegistrationsChartData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.85}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#090d16', borderColor: '#1e293b', borderRadius: '16px' }}
                      labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#818cf8', fontSize: '11px' }}
                    />
                    <Bar dataKey="registrations" fill="url(#colorRegistrations)" radius={[8, 8, 0, 0]} barSize={34} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* User Role Distribution */}
        <div onMouseMove={handleSpotlightMouseMove} className="spotlight-card p-6 shadow-xl flex flex-col justify-between cursor-default relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-550 to-transparent"></div>
          <h2 className="text-xs font-bold text-slate-450 uppercase tracking-widest mb-6 relative z-10">Role Distribution</h2>
          <div className="w-full h-64 mt-2 flex-grow relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleData} layout="vertical" margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                <defs>
                  {roleData.map((r, i) => (
                    <linearGradient id={`colorRole-${i}`} key={i} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor={r.color1} stopOpacity={0.85}/>
                      <stop offset="95%" stopColor={r.color2} stopOpacity={0.25}/>
                    </linearGradient>
                  ))}
                </defs>
                <XAxis type="number" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#090d16', borderColor: '#1e293b', borderRadius: '16px' }}
                  labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#colorRole-${index})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recruiter Verification Queue with Accent glows */}
      <div onMouseMove={handleSpotlightMouseMove} className="spotlight-card p-6 shadow-xl cursor-default relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-550 to-transparent"></div>
        <h2 className="text-xs font-bold text-slate-450 uppercase tracking-widest mb-6 flex items-center gap-1.5 relative z-10">
          <ShieldAlert size={16} className="text-amber-400" />
          <span>Employer Verification Queue</span>
        </h2>
        <div className="relative z-10">
          {recruiters.filter(r => !r.verified).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-850 p-8 text-center bg-slate-950/20">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
              <p className="text-xs text-slate-500 font-medium">All recruiter applications have been verified. No pending tasks.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recruiters.filter(r => !r.verified).map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-2xl border border-slate-850 bg-slate-950/40 p-5 flex flex-col justify-between hover:border-slate-750 transition-all duration-300"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{rec.companyName || 'Unnamed Corporate'}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                      Recruiter: <span>{rec.user?.firstName} {rec.user?.lastName}</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-semibold">{rec.user?.email}</p>
                    <p className="text-[10px] text-indigo-405 font-bold mt-2.5">
                      {rec.industry} • {rec.location}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-850/65 mt-4">
                    {rec.website ? (
                      <a 
                        href={rec.website} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors underline font-bold uppercase tracking-wider"
                      >
                        Visit Website →
                      </a>
                    ) : <span className="text-[9px] text-slate-600 font-bold uppercase">No Web Link</span>}
                    <button
                      onClick={() => handleVerifyRecruiter(rec.id)}
                      className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-[10px] font-bold text-white shadow hover:bg-emerald-500 hover:scale-102 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 size={10} />
                      <span>Verify Account</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Moderation Lists Area */}
      <div className="space-y-6">
        {/* Navigation Tabs with clean sliding look */}
        <div className="flex border-b border-slate-850 space-x-6 text-[10px] font-bold pl-2 uppercase tracking-widest select-none">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 border-b-2 transition-all relative cursor-pointer ${
              activeTab === 'users' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-550 hover:text-white'
            }`}
          >
            <span>Users List</span>
            <span className="ml-2 rounded-lg bg-slate-850 border border-slate-800 px-2 py-0.5 text-[9px] font-semibold text-slate-350">{users.length}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-4 border-b-2 transition-all relative cursor-pointer ${
              activeTab === 'jobs' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-550 hover:text-white'
            }`}
          >
            <span>Active Jobs</span>
            <span className="ml-2 rounded-lg bg-slate-850 border border-slate-800 px-2 py-0.5 text-[9px] font-semibold text-slate-355">{jobs.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('recruiters')}
            className={`pb-4 border-b-2 transition-all relative cursor-pointer ${
              activeTab === 'recruiters' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-550 hover:text-white'
            }`}
          >
            <span>Verified Employers</span>
            <span className="ml-2 rounded-lg bg-slate-850 border border-slate-800 px-2 py-0.5 text-[9px] font-semibold text-slate-355">
              {recruiters.filter(r => r.verified).length}
            </span>
          </button>
        </div>

        {/* Tab Content Panel */}
        <div onMouseMove={handleSpotlightMouseMove} className="spotlight-card p-6 shadow-xl cursor-default relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent"></div>
          <div className="relative z-10">
            {/* Users List */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 font-bold uppercase tracking-widest">
                      <th className="pb-3 pl-2">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 pr-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/30">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-900/10 group/row transition-colors">
                        <td className="py-4 pl-2 font-bold text-slate-200">{u.firstName} {u.lastName}</td>
                        <td className="py-4 text-slate-400 font-semibold">{u.email}</td>
                        <td className="py-4">
                          <span className="inline-block rounded-lg bg-slate-850/60 border border-slate-800 px-2.5 py-0.5 font-bold uppercase text-[9px] tracking-widest text-slate-350">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`inline-block rounded-lg px-2.5 py-0.5 font-bold uppercase text-[9px] border tracking-wider ${
                            u.enabled
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/10 border-rose-500/20 text-rose-455'
                          }`}>
                            {u.enabled ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="py-4 pr-2 text-right">
                          {u.role !== 'ADMIN' && (
                            <div className="flex justify-end gap-2 opacity-80 group-hover/row:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleToggleUserStatus(u.id)}
                                className={`rounded-xl p-2 border transition-all cursor-pointer ${
                                  u.enabled
                                    ? 'bg-rose-500/10 border-rose-500/25 text-rose-455 hover:bg-rose-500/20'
                                    : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                                }`}
                                title={u.enabled ? 'Disable User' : 'Enable User'}
                              >
                                {u.enabled ? <UserX size={12} /> : <UserCheck size={12} />}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="rounded-xl border border-slate-850 p-2 text-slate-500 hover:text-rose-400 hover:border-rose-500/20 transition-all cursor-pointer hover:bg-slate-900"
                                title="Delete User"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Active Jobs */}
            {activeTab === 'jobs' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 font-bold uppercase tracking-widest">
                      <th className="pb-3 pl-2">Job Title</th>
                      <th className="pb-3">Company</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Location</th>
                      <th className="pb-3 pr-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/30">
                    {jobs.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-900/10 group/row transition-colors">
                        <td className="py-4 pl-2 font-bold text-slate-200">{j.title}</td>
                        <td className="py-4 text-slate-400 font-semibold">{j.recruiter?.companyName || 'Corporate Employer'}</td>
                        <td className="py-4">
                          <span className="inline-block rounded-lg bg-indigo-950/35 border border-indigo-900/20 px-2.5 py-0.5 text-[9px] font-bold text-indigo-400">
                            {j.category}
                          </span>
                        </td>
                        <td className="py-4 text-slate-450 font-semibold">{j.location}</td>
                        <td className="py-4 pr-2 text-right">
                          <button
                            onClick={() => handleDeleteJob(j.id)}
                            className="rounded-xl border border-slate-850 p-2 text-slate-500 hover:text-rose-400 hover:border-rose-500/20 transition-all cursor-pointer hover:bg-slate-900"
                            title="Remove Job Listing"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Verified Employers */}
            {activeTab === 'recruiters' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 font-bold uppercase tracking-widest">
                      <th className="pb-3 pl-2">Company</th>
                      <th className="pb-3">Industry</th>
                      <th className="pb-3">Location</th>
                      <th className="pb-3">Website</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/30">
                    {recruiters.filter(r => r.verified).map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-900/10 transition-colors">
                        <td className="py-4 pl-2 font-bold text-slate-200">{rec.companyName}</td>
                        <td className="py-4 text-slate-400 font-semibold">{rec.industry}</td>
                        <td className="py-4 text-slate-450 font-semibold">{rec.location}</td>
                        <td className="py-4">
                          {rec.website ? (
                            <a href={rec.website} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors underline font-semibold">
                              {rec.website.replace('https://', '').replace('http://', '')}
                            </a>
                          ) : <span className="text-slate-650">-</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
