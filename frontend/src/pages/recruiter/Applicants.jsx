import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, FileText, CheckCircle2, XCircle, Calendar, MessageSquare, Briefcase, Award, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';

const Applicants = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');

  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedAppId, setExpandedAppId] = useState(null);
  
  // Filtering
  const [statusFilter, setStatusFilter] = useState('');

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      if (jobId) {
        // Fetch specific job applicants
        const res = await api.get(`/applications/job/${jobId}`);
        setApplicants(res.data);
        if (res.data.length > 0) {
          setJobTitle(res.data[0].job.title);
        } else {
          // If no applications, fetch the job title separately
          const jobRes = await api.get(`/jobs/${jobId}`);
          setJobTitle(jobRes.data.title);
        }
      } else {
        // Fetch all recruiter applicants
        const res = await api.get('/applications/recruiter');
        setApplicants(res.data);
        setJobTitle('All Listings');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (appId, nextStatus) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, { status: nextStatus });
      // Update local state
      setApplicants(prev => prev.map(app => app.id === appId ? { ...app, status: res.data.status } : app));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleExpand = (appId) => {
    setExpandedAppId(prev => prev === appId ? null : appId);
  };

  const getStatusBadge = (status) => {
    const map = {
      APPLIED: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      REVIEWED: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      SHORTLISTED: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      INTERVIEW: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
      SELECTED: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      REJECTED: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    };
    return (
      <span className={`inline-block rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${map[status] || 'bg-slate-800'}`}>
        {status}
      </span>
    );
  };

  const filteredApplicants = statusFilter
    ? applicants.filter(app => app.status === statusFilter)
    : applicants;

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Link to="/recruiter/dashboard" className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Applicants Panel</h1>
          <p className="mt-1 text-sm text-slate-400">Review submissions for: <span className="text-indigo-400 font-semibold">{jobTitle}</span></p>
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500"
        >
          <option value="">All Stages</option>
          <option value="APPLIED">Applied</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="INTERVIEW">Interview</option>
          <option value="SELECTED">Selected / Hired</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {filteredApplicants.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/10 p-12 text-center backdrop-blur-md">
          <FileText className="mx-auto h-12 w-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">No applicants found</h3>
          <p className="text-sm text-slate-500">There are currently no submissions matching your filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplicants.map((app) => {
            const isExpanded = expandedAppId === app.id;
            return (
              <div
                key={app.id}
                className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur-md space-y-4 transition-all hover:border-slate-700/60"
              >
                {/* Header overview */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex gap-4">
                    {/* Photo */}
                    <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center overflow-hidden shrink-0">
                      {app.candidate.profilePhoto ? (
                        <img src={`http://localhost:8081/${app.candidate.profilePhoto}`} alt="" className="object-cover h-full w-full" />
                      ) : (
                        <span className="text-sm font-bold text-slate-400">
                          {app.candidate.user.firstName[0]}{app.candidate.user.lastName[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-200">
                          {app.candidate.user.firstName} {app.candidate.user.lastName}
                        </h3>
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-xs text-indigo-400 font-semibold">{app.candidate.headline || 'Developer'}</p>
                      {!jobId && <p className="text-[10px] text-slate-500">Applying for: <span className="font-semibold text-slate-400">{app.job.title}</span></p>}
                    </div>
                  </div>

                  {/* Actions / Expand button */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
                    </span>
                    <button
                      onClick={() => toggleExpand(app.id)}
                      className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-1 text-xs"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'Review Details'}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="pt-6 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-200">
                    {/* Left: Bio, Experience, Education */}
                    <div className="md:col-span-2 space-y-4">
                      {/* Bio */}
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Candidate Bio</h4>
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                          {app.candidate.bio || 'No bio provided.'}
                        </p>
                      </div>

                      {/* Exp & Edu */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            <Briefcase size={12} />
                            <span>Experience</span>
                          </h4>
                          <p className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-850 whitespace-pre-line">
                            {app.candidate.experience || 'No details provided.'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            <GraduationCap size={12} />
                            <span>Education</span>
                          </h4>
                          <p className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-850 whitespace-pre-line">
                            {app.candidate.education || 'No details provided.'}
                          </p>
                        </div>
                      </div>

                      {/* Cover letter */}
                      {app.coverLetter && (
                        <div className="space-y-1">
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            <MessageSquare size={12} />
                            <span>Cover Letter</span>
                          </h4>
                          <p className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-850 whitespace-pre-line italic">
                            "{app.coverLetter}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right: Actions, Resume, Skills */}
                    <div className="space-y-4">
                      {/* Skills */}
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                          <Award size={12} />
                          <span>Candidate Skills</span>
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {app.candidate.skills
                            ? app.candidate.skills.split(',').map((skill, index) => (
                                <span key={index} className="rounded-lg bg-slate-800/60 px-2.5 py-1 text-[10px] text-slate-300 font-semibold border border-slate-700/20">
                                  {skill.trim()}
                                </span>
                              ))
                            : <span className="text-xs text-slate-500">None specified.</span>}
                        </div>
                      </div>

                      {/* Resume PDF */}
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Submitted Resume</h4>
                        <a
                          href={`http://localhost:8081/${app.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl border border-slate-800 hover:border-indigo-500/30 bg-slate-950/50 p-3 flex items-center justify-between group transition-all"
                        >
                          <span className="text-xs text-slate-300 group-hover:text-indigo-400 transition-colors font-medium truncate max-w-[150px]">
                            📄 Download PDF
                          </span>
                          <span className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300">View</span>
                        </a>
                      </div>

                      {/* Recruitment Controls */}
                      <div className="space-y-2 pt-2 border-t border-slate-800/60">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Update Stage</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {app.status === 'APPLIED' && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'REVIEWED')}
                              className="py-2 text-[11px] font-bold rounded-lg border border-purple-500/20 bg-purple-500/5 text-purple-400 hover:bg-purple-500/10 transition-all text-center"
                            >
                              Mark Reviewed
                            </button>
                          )}
                          {(app.status === 'APPLIED' || app.status === 'REVIEWED') && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'SHORTLISTED')}
                              className="py-2 text-[11px] font-bold rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10 transition-all text-center"
                            >
                              Shortlist
                            </button>
                          )}
                          {app.status === 'SHORTLISTED' && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'INTERVIEW')}
                              className="py-2 text-[11px] font-bold rounded-lg border border-orange-500/20 bg-orange-500/5 text-orange-400 hover:bg-orange-500/10 transition-all text-center col-span-2"
                            >
                              Schedule Interview
                            </button>
                          )}
                          {app.status === 'INTERVIEW' && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'SELECTED')}
                              className="py-2 text-[11px] font-bold rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 transition-all text-center col-span-2 flex items-center justify-center gap-1"
                            >
                              <CheckCircle2 size={12} />
                              <span>Hire Candidate</span>
                            </button>
                          )}
                          {app.status !== 'SELECTED' && app.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'REJECTED')}
                              className="py-2 text-[11px] font-bold rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 transition-all text-center flex items-center justify-center gap-1"
                            >
                              <XCircle size={12} />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Applicants;
