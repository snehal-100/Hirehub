import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Briefcase, Star, Trash2, Calendar, Award, ExternalLink, Inbox, Circle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await api.get('/candidate/dashboard');
      setStats(statsRes.data);

      const appsRes = await api.get('/applications/candidate');
      setApplications(appsRes.data || []);

      const savedRes = await api.get('/saved-jobs');
      setSavedJobs(savedRes.data || []);
    } catch (err) {
      console.error('Failed to load candidate dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await api.delete(`/applications/${appId}`);
      setApplications(prev => prev.filter(app => app.id !== appId));
      setStats(prev => ({ ...prev, totalApplications: Math.max(0, prev.totalApplications - 1) }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveSaved = async (jobId) => {
    try {
      await api.delete(`/saved-jobs/${jobId}`);
      setSavedJobs(prev => prev.filter(item => item.job?.id !== jobId));
      setStats(prev => ({ ...prev, totalSavedJobs: Math.max(0, prev.totalSavedJobs - 1) }));
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      APPLIED: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      REVIEWED: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      SHORTLISTED: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      INTERVIEW: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
      SELECTED: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      REJECTED: 'bg-rose-500/10 border-rose-500/20 text-rose-455',
    };
    return (
      <span className={`inline-block rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${map[status] || 'bg-slate-800'}`}>
        {status}
      </span>
    );
  };

  const getStatusLeftBar = (status) => {
    const map = {
      APPLIED: 'bg-blue-500',
      REVIEWED: 'bg-purple-500',
      SHORTLISTED: 'bg-amber-500',
      INTERVIEW: 'bg-orange-500',
      SELECTED: 'bg-emerald-500',
      REJECTED: 'bg-rose-500',
    };
    return map[status] || 'bg-slate-800';
  };

  const getChartData = () => {
    const counts = {};
    applications.forEach(app => {
      if (app.status) {
        counts[app.status] = (counts[app.status] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  };

  const handleSpotlightMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const CHART_COLORS = {
    APPLIED: '#3b82f6',
    REVIEWED: '#a855f7',
    SHORTLISTED: '#f59e0b',
    INTERVIEW: '#f97316',
    SELECTED: '#10b981',
    REJECTED: '#f43f5e',
  };

  const chartData = getChartData();

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10 bg-grid-pattern min-h-screen">
      {/* Welcome Header */}
      <div className="relative border-b border-slate-900 pb-8 select-none">
        <div className="absolute -left-10 top-0 h-40 w-80 bg-indigo-550/5 blur-[80px] pointer-events-none rounded-full"></div>
        <h1 className="text-3xl font-extrabold text-white bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent text-glow-indigo">
          Candidate Workspace
        </h1>
        <p className="mt-1.5 text-xs text-slate-450 font-semibold">Track active application flows and manage bookmarked rosters.</p>
      </div>

      {/* Analytics widgets */}
      {stats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Total Submissions */}
          <div 
            onMouseMove={handleSpotlightMouseMove} 
            className="spotlight-card p-6 shadow-2xl relative cursor-default overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 hover:shadow-indigo-500/5"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Submissions</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Briefcase size={16} />
              </div>
            </div>
            <p className="mt-4 text-4xl font-extrabold text-white tracking-tight relative z-10 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">{stats.totalApplications}</p>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider relative z-10">Active pipelines</span>
          </div>

          {/* Saved Roles */}
          <div 
            onMouseMove={handleSpotlightMouseMove} 
            className="spotlight-card p-6 shadow-2xl relative cursor-default overflow-hidden group hover:border-purple-500/30 transition-all duration-500 hover:shadow-purple-500/5"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-transparent"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saved Roles</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Star size={16} />
              </div>
            </div>
            <p className="mt-4 text-4xl font-extrabold text-white tracking-tight relative z-10 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">{stats.totalSavedJobs}</p>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider relative z-10">Bookmarked vacancies</span>
          </div>

          {/* Interviews Called */}
          <div 
            onMouseMove={handleSpotlightMouseMove} 
            className="spotlight-card p-6 shadow-2xl relative cursor-default overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 hover:shadow-emerald-500/5"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-transparent"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Interviews Called</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-450 border border-emerald-500/20">
                <Award size={16} />
              </div>
            </div>
            <p className="mt-4 text-4xl font-extrabold text-white tracking-tight relative z-10 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">{stats.totalInterviews}</p>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider relative z-10">Active invitations</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Applications List */}
        <div className="lg:col-span-2 space-y-6">
          <div onMouseMove={handleSpotlightMouseMove} className="spotlight-card p-6 shadow-xl cursor-default relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent"></div>
            <h2 className="text-sm font-bold text-slate-450 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
              <Inbox size={16} className="text-indigo-400" />
              <span>Application Milestones</span>
            </h2>

            <div className="relative z-10">
              {applications.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-850 rounded-2xl bg-slate-955/20">
                  <p className="text-xs font-semibold">You haven't submitted any profiles yet.</p>
                  <Link to="/jobs" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold underline mt-2 block cursor-pointer">
                    Browse Active Openings
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border border-slate-850 bg-slate-955/40 p-4 pl-5 gap-4 hover:border-slate-750 transition-all duration-300 group/item"
                    >
                      {/* Left glowing status indicator bar */}
                      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${getStatusLeftBar(app.status)}`}></div>
                      
                      <div className="space-y-1 pr-2">
                        <h3 className="text-sm font-bold text-slate-200 group-hover/item:text-indigo-405 transition-colors truncate">{app.job?.title || 'Job Posting'}</h3>
                        <p className="text-xs text-slate-450 font-semibold">{app.job?.recruiter?.companyName || 'Corporate Employer'}</p>
                        <p className="text-[9px] text-slate-500 flex items-center gap-1 mt-1 font-bold uppercase">
                          <Calendar size={11} />
                          <span>Applied on: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                        {getStatusBadge(app.status)}
                        <div className="flex gap-2">
                          {app.job && (
                            <Link
                              to={`/jobs/${app.job.id}`}
                              className="rounded-xl border border-slate-800 p-2.5 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <ExternalLink size={12} />
                            </Link>
                          )}
                          {app.status === 'APPLIED' && (
                            <button
                              onClick={() => handleWithdraw(app.id)}
                              className="rounded-xl border border-rose-500/15 p-2.5 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Withdraw Profile"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recharts Analytics & Bookmarks */}
        <div className="space-y-6">
          {/* Recharts Wheel */}
          {applications.length > 0 && (
            <div onMouseMove={handleSpotlightMouseMove} className="spotlight-card p-6 shadow-xl flex flex-col items-center cursor-default relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-550 to-transparent"></div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-450 mb-4 w-full text-left relative z-10">Funnels Breakdown</h2>
              <div className="w-full h-40 relative flex items-center justify-center z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={CHART_COLORS[entry.name] || '#8884d8'} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#090d16', borderColor: '#1e293b', borderRadius: '16px' }}
                      itemStyle={{ color: '#fff', fontSize: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 w-full text-[9px] text-slate-450 relative z-10">
                {chartData.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 font-bold uppercase tracking-wider truncate">
                    <Circle size={8} fill={CHART_COLORS[entry.name]} stroke="none" className="shrink-0" />
                    <span className="truncate">{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookmarks */}
          <div onMouseMove={handleSpotlightMouseMove} className="spotlight-card p-6 shadow-xl cursor-default relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-550 to-transparent"></div>
            <h2 className="text-sm font-bold text-slate-450 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
              <Star size={16} className="text-amber-400" />
              <span>Watchlist Roles</span>
            </h2>

            <div className="relative z-10">
              {savedJobs.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs border border-dashed border-slate-850 rounded-2xl bg-slate-950/20">
                  No bookmarked roles.
                </div>
              ) : (
                <div className="space-y-4">
                  {savedJobs.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-850 bg-slate-955/40 p-4 space-y-3 hover:border-slate-750 transition-all duration-300"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 truncate">{item.job?.title || 'Job Listing'}</h4>
                        <p className="text-[10px] text-slate-450 mt-0.5">{item.job?.recruiter?.companyName || 'Corporate Employer'}</p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-slate-850/40">
                        {item.job && (
                          <Link
                            to={`/jobs/${item.job.id}`}
                            className="text-[11px] font-bold text-indigo-400 hover:text-indigo-305 flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>View Details</span>
                            <ExternalLink size={10} />
                          </Link>
                        )}
                        <button
                          onClick={() => handleRemoveSaved(item.job?.id)}
                          className="text-[10px] text-rose-500 hover:text-rose-455 font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
