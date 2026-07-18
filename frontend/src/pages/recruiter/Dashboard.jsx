import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Briefcase, Inbox, Percent, Plus, Eye, Award, Settings, Printer, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await api.get('/recruiter/dashboard');
      setStats(statsRes.data);

      const jobsRes = await api.get('/jobs/recruiter');
      setPostedJobs(jobsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCloseJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to close this job post? Applications will stop.')) return;
    try {
      await api.patch(`/jobs/${jobId}/close`);
      setPostedJobs(prev => prev.map(job => job.id === jobId ? { ...job, status: 'CLOSED' } : job));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    const jobsRows = postedJobs.map(job => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">${job.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${job.category}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${job.location}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${job.status}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${job.deadline}</td>
      </tr>
    `).join('');

    const statusList = stats && stats.statusBreakdown ? Object.entries(stats.statusBreakdown).map(([status, count]) => `
      <div style="flex: 1; min-width: 100px; border: 1px solid #eee; padding: 12px; border-radius: 8px; margin: 5px; text-align: center;">
        <strong style="display: block; font-size: 10px; text-transform: uppercase; color: #777;">${status}</strong>
        <span style="font-size: 20px; font-weight: bold; color: #4f46e5;">${count}</span>
      </div>
    `).join('') : '';

    printWindow.document.write(`
      <html>
        <head>
          <title>HireHub Recruiter Summary Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; margin: 40px; }
            h1 { font-size: 24px; color: #111; margin-bottom: 5px; }
            p { font-size: 12px; color: #666; margin-top: 0; }
            .stats-container { display: flex; justify-content: space-between; margin: 30px 0; }
            .stat-box { flex: 1; padding: 20px; border: 1px solid #ddd; border-radius: 12px; margin-right: 15px; background: #fafafa; }
            .stat-box:last-child { margin-right: 0; }
            .stat-label { font-size: 10px; text-transform: uppercase; color: #888; font-weight: bold; letter-spacing: 0.5px; }
            .stat-val { font-size: 24px; font-weight: bold; color: #111; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 12px; }
            th { background: #f3f4f6; padding: 12px; border-bottom: 2px solid #e5e7eb; text-align: left; font-weight: 600; }
          </style>
        </head>
        <body>
          <div style="border-bottom: 3px solid #4f46e5; padding-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
              <h1>HireHub - Recruiter Summary Report</h1>
              <p>Generated on ${new Date().toLocaleString()}</p>
            </div>
            <div style="font-size: 12px; font-weight: bold; color: #4f46e5; text-transform: uppercase;">
              Verified Employer Details
            </div>
          </div>
          
          <div class="stats-container">
            <div class="stat-box">
              <div class="stat-label">Jobs Posted</div>
              <div class="stat-val">${stats?.totalJobsPosted || 0}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Applications Received</div>
              <div class="stat-val">${stats?.totalApplicationsReceived || 0}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Hiring Match Rate</div>
              <div class="stat-val">${stats?.hiringRate ? stats.hiringRate.toFixed(1) : 0}%</div>
            </div>
          </div>

          <h3 style="margin-top: 35px; border-bottom: 1px solid #eee; padding-bottom: 8px;">Applications Breakdown by Stage</h3>
          <div style="display: flex; flex-wrap: wrap; margin-bottom: 30px;">
            ${statusList || '<p>No application stages logged yet.</p>'}
          </div>

          <h3 style="margin-top: 35px; border-bottom: 1px solid #eee; padding-bottom: 8px;">Active Job Listings Details</h3>
          <table>
            <thead>
              <tr>
                <th style="padding: 12px;">Job Title</th>
                <th style="padding: 12px;">Category</th>
                <th style="padding: 12px;">Location</th>
                <th style="padding: 12px;">Status</th>
                <th style="padding: 12px;">Deadline</th>
              </tr>
            </thead>
            <tbody>
              ${jobsRows || '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #666;">No jobs posted yet.</td></tr>'}
            </tbody>
          </table>
          
          <div style="margin-top: 80px; font-size: 10px; text-align: center; color: #999; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            This document is generated automatically by HireHub. All applications are verified.
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getChartData = () => {
    if (!stats || !stats.statusBreakdown) return [];
    return Object.entries(stats.statusBreakdown).map(([status, count]) => ({
      name: status,
      count: count,
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

  const CHART_ACCENTS = [
    { color1: '#6366f1', color2: '#4f46e5' },
    { color1: '#a855f7', color2: '#7c3aed' },
    { color1: '#f59e0b', color2: '#d97706' },
    { color1: '#f97316', color2: '#ea580c' },
    { color1: '#10b981', color2: '#059669' },
    { color1: '#f43f5e', color2: '#e11d48' },
  ];

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
      {/* Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-8 select-none">
        <div className="absolute -left-10 top-0 h-40 w-80 bg-indigo-550/5 blur-[80px] pointer-events-none rounded-full"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent text-glow-indigo">
            Recruiter Operations
          </h1>
          <p className="mt-1.5 text-xs text-slate-450 font-semibold">Post job details, evaluate applicant resumes, and print summaries.</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto relative z-10">
          {postedJobs.length > 0 && (
            <button
              onClick={handlePrintReport}
              className="inline-flex items-center space-x-2 rounded-2xl border border-slate-800 bg-slate-900/35 hover:bg-slate-900/85 px-5 py-3.5 text-xs font-bold text-slate-300 hover:text-white shadow transition-all cursor-pointer"
            >
              <Printer size={14} />
              <span>Export Report</span>
            </button>
          )}
          <Link
            to="/recruiter/post-job"
            className="inline-flex items-center space-x-2 rounded-2xl bg-indigo-650 px-6 py-3.5 text-xs font-bold text-white shadow hover:bg-indigo-600 hover:scale-102 transition-all cursor-pointer animate-shimmer"
          >
            <Plus size={14} />
            <span>Create Vacancy</span>
          </Link>
        </div>
      </div>

      {/* Analytics Widgets */}
      {stats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Jobs Posted */}
          <div 
            onMouseMove={handleSpotlightMouseMove} 
            className="spotlight-card p-6 shadow-2xl relative cursor-default overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 hover:shadow-indigo-500/5"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Jobs Posted</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Briefcase size={16} />
              </div>
            </div>
            <p className="mt-4 text-4xl font-extrabold text-white tracking-tight relative z-10 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">{stats.totalJobsPosted}</p>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider relative z-10">Active job vacancies</span>
          </div>

          {/* Submissions */}
          <div 
            onMouseMove={handleSpotlightMouseMove} 
            className="spotlight-card p-6 shadow-2xl relative cursor-default overflow-hidden group hover:border-purple-500/30 transition-all duration-500 hover:shadow-purple-500/5"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-transparent"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Submissions</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Inbox size={16} />
              </div>
            </div>
            <p className="mt-4 text-4xl font-extrabold text-white tracking-tight relative z-10 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">{stats.totalApplicationsReceived}</p>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider relative z-10">Profiles received</span>
          </div>

          {/* Hiring Conversion Rate */}
          <div 
            onMouseMove={handleSpotlightMouseMove} 
            className="spotlight-card p-6 shadow-2xl relative cursor-default overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 hover:shadow-emerald-500/5"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-transparent"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hiring Ratio</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Percent size={16} />
              </div>
            </div>
            <p className="mt-4 text-4xl font-extrabold text-white tracking-tight relative z-10 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {stats.hiringRate ? `${stats.hiringRate.toFixed(1)}%` : '0%'}
            </p>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider relative z-10">Conversion rate</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Jobs List */}
        <div className="lg:col-span-2 space-y-6">
          <div onMouseMove={handleSpotlightMouseMove} className="spotlight-card p-6 shadow-xl cursor-default relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent"></div>
            <h2 className="text-xs font-bold text-slate-455 uppercase tracking-widest mb-6 flex items-center gap-1.5 relative z-10">
              <Sparkles size={16} className="text-indigo-400" />
              <span>Active vacancies roster</span>
            </h2>

            <div className="relative z-10">
              {postedJobs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-855 rounded-2xl bg-slate-955/20">
                  <p className="text-xs font-semibold">You haven't posted any jobs yet.</p>
                  <Link to="/recruiter/post-job" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold underline mt-2 block cursor-pointer">
                    Post your first vacancy
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {postedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border border-slate-850 bg-slate-955/40 p-4 pl-5 gap-4 hover:border-slate-750 transition-all duration-300 group/item"
                    >
                      {/* Left accent color bar */}
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-550"></div>
                      
                      <div className="space-y-1.5 pr-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-200 group-hover/item:text-indigo-400 transition-colors truncate">{job.title}</h3>
                          <span className={`inline-block rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                            job.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : 'bg-slate-800 border-slate-700 text-slate-405'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-450 font-semibold">{job.category} • {job.location}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Deadline: {job.deadline}</p>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                        <div className="flex gap-2">
                          <Link
                            to={`/recruiter/applicants?jobId=${job.id}`}
                            className="rounded-xl border border-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Eye size={12} className="text-indigo-400" />
                            <span>Applicants</span>
                          </Link>
                          {job.status === 'ACTIVE' && (
                            <button
                              onClick={() => handleCloseJob(job.id)}
                              className="rounded-xl border border-rose-500/15 px-3.5 py-2.5 text-xs font-bold text-rose-455 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            >
                              Close Job
                            </button>
                          )}
                          <Link
                            to={`/recruiter/post-job?editId=${job.id}`}
                            className="rounded-xl border border-slate-800 px-2.5 py-2.5 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
                            title="Edit Job"
                          >
                            <Settings size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analytics Chart with Def Gradients */}
        <div className="space-y-6">
          <div onMouseMove={handleSpotlightMouseMove} className="spotlight-card p-6 shadow-xl flex flex-col h-full cursor-default relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-550 to-transparent"></div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-455 mb-6 flex items-center gap-1.5 relative z-10">
              <Award size={16} className="text-indigo-400" />
              <span>Pipeline analytics</span>
            </h2>

            <div className="relative z-10 w-full">
              {postedJobs.length === 0 || chartData.length === 0 ? (
                <div className="flex-grow flex items-center justify-center py-10 text-slate-500 text-xs border border-dashed border-slate-850 rounded-2xl bg-slate-955/20 text-center font-medium">
                  Chart details will load once applications are received.
                </div>
              ) : (
                <div className="w-full h-64 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        {chartData.map((entry, index) => (
                          <linearGradient id={`recGradient-${index}`} key={index} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_ACCENTS[index % CHART_ACCENTS.length].color1} stopOpacity={0.85}/>
                            <stop offset="95%" stopColor={CHART_ACCENTS[index % CHART_ACCENTS.length].color2} stopOpacity={0.15}/>
                          </linearGradient>
                        ))}
                      </defs>
                      <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#090d16', borderColor: '#1e293b', borderRadius: '16px' }}
                        labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                        itemStyle={{ color: '#fff', fontSize: '11px' }}
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={24}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#recGradient-${index})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
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
