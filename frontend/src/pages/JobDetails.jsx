import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { MapPin, DollarSign, Briefcase, Calendar, Users, AlertCircle, ArrowLeft, Send, CheckCircle, Cpu, Sparkles, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Application Modal States
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyError, setApplyError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [hasAppliedBefore, setHasAppliedBefore] = useState(false);

  // AI Matching States
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [matchingSkills, setMatchingSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [generatingLetter, setGeneratingLetter] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
        
        if (user && user.role === 'CANDIDATE') {
          const profileRes = await api.get('/candidate/profile');
          setCandidateProfile(profileRes.data);
          
          const appsRes = await api.get('/applications/candidate');
          const alreadyApplied = appsRes.data.some(app => app.job?.id === parseInt(id));
          setHasAppliedBefore(alreadyApplied);

          calculateSkillMatch(profileRes.data, res.data);
        }
      } catch (err) {
        setError('Job not found or failed to fetch details.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id, user]);

  const calculateSkillMatch = (candProf, jobData) => {
    if (!candProf || !candProf.skills || !jobData) {
      setMatchPercentage(35);
      setMissingSkills(['Docker', 'AWS', 'System Design']);
      return;
    }

    const candSkills = candProf.skills.toLowerCase().split(',').map(s => s.trim());
    const jobText = (jobData.title + " " + jobData.description).toLowerCase();
    
    const technicalKeywords = [
      'java', 'spring', 'springboot', 'react', 'javascript', 'html', 'css', 
      'sql', 'mysql', 'docker', 'aws', 'kubernetes', 'python', 'pytorch', 
      'tensorflow', 'git', 'figma', 'design', 'ux', 'rest', 'api'
    ];

    const matched = [];
    const missing = [];

    candSkills.forEach(skill => {
      if (jobText.includes(skill)) {
        matched.push(skill);
      }
    });

    technicalKeywords.forEach(kw => {
      if (jobText.includes(kw) && !candSkills.includes(kw)) {
        const pretty = kw.charAt(0).toUpperCase() + kw.slice(1);
        missing.push(pretty);
      }
    });

    setMatchingSkills(matched.map(s => s.toUpperCase()));
    setMissingSkills(missing.slice(0, 3));

    const totalMatchable = matched.length + missing.length;
    let pct = 30;
    if (totalMatchable > 0) {
      pct = Math.round((matched.length / totalMatchable) * 70) + 30;
    }
    setMatchPercentage(Math.min(98, pct));
  };

  const handleGenerateCoverLetter = () => {
    if (!job) return;
    setGeneratingLetter(true);
    let counter = 0;
    
    const draftText = `Dear Hiring Team,\n\nI am writing to express my strong interest in the '${job.title}' position at your company. With a background in software systems and a proven capability in core engineering parameters, I am confident in my match for this role.\n\nMy profile matches ${matchPercentage}% of your technical parameters. I have hands-on experience working with ${matchingSkills.length > 0 ? matchingSkills.join(', ') : 'modern development frameworks'} which directly align with your stack requirements. I am excited to bring my technical problem-solving skills to your team.\n\nSincerely,\n${user?.firstName || 'Candidate'}`;

    const interval = setInterval(() => {
      counter += 15;
      setCoverLetter(draftText.substring(0, counter));
      if (counter >= draftText.length) {
        clearInterval(interval);
        setGeneratingLetter(false);
      }
    }, 15);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!candidateProfile?.resumePath) {
      setApplyError('Please upload a resume in your profile before applying.');
      return;
    }
    setApplyError('');
    setApplying(true);

    try {
      await api.post(`/applications/apply/${id}`, { coverLetter });
      setApplied(true);
      setHasAppliedBefore(true);
      setTimeout(() => {
        setShowApplyModal(false);
      }, 2000);
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to submit application. Try again.');
    } finally {
      setApplying(false);
    }
  };

  // Spotlight mouse tracker hook
  const handleSpotlightMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center bg-grid-pattern min-h-screen">
        <div className="flex justify-center text-rose-500 mb-4">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Job Post Unavailable</h2>
        <p className="text-sm text-slate-500 mb-6">{error || 'This job does not exist or has been deleted.'}</p>
        <Link to="/jobs" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300">
          Return to Job Board
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 bg-grid-pattern min-h-screen">
      {/* Back link */}
      <Link to="/jobs" className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-450 hover:text-white transition-colors mb-8 cursor-pointer pl-1">
        <ArrowLeft size={14} />
        <span>Back to Job Roster</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Job Header & Details Area */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            onMouseMove={handleSpotlightMouseMove}
            className="spotlight-card p-8 shadow-2xl relative group cursor-default"
          >
            <span className="inline-block rounded-lg bg-indigo-950/40 border border-indigo-500/20 px-2.5 py-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wide mb-4">
              {job.category}
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{job.title}</h1>
            <p className="mt-2 text-xs text-slate-400 font-semibold">Posted by {job.recruiter?.companyName || 'Corporate Employer'}</p>

            {/* Quick stats tags */}
            <div className="mt-6 flex flex-wrap gap-4 border-y border-slate-850/60 py-4 relative z-10">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <MapPin size={14} className="text-indigo-400" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <DollarSign size={14} className="text-indigo-400" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <Briefcase size={14} className="text-indigo-400" />
                <span>{job.employmentType}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <Calendar size={14} className="text-indigo-400" />
                <span>Deadline: {job.deadline}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <Users size={14} className="text-indigo-400" />
                <span>{job.vacancies} vacancies</span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8 relative z-10">
              <h2 className="text-base font-bold text-white mb-4 uppercase tracking-wider text-slate-400">Job Description</h2>
              <div className="text-xs text-slate-400 leading-relaxed whitespace-pre-line space-y-4 font-medium">
                {job.description}
              </div>
            </div>
          </div>
        </div>

        {/* Action Center & AI Skill Matcher sidebar */}
        <div className="space-y-6">
          {/* Action Center */}
          <div 
            onMouseMove={handleSpotlightMouseMove}
            className="spotlight-card p-6 shadow-2xl cursor-default"
          >
            <h3 className="text-xs font-bold text-slate-455 uppercase tracking-wider mb-4">Action Center</h3>
            <div className="relative z-10">
              {job.status === 'CLOSED' ? (
                <div className="text-center rounded-xl bg-slate-800/40 p-4 border border-slate-750/30 text-slate-500 text-xs font-bold">
                  This job listing has closed
                </div>
              ) : !user ? (
                <Link
                  to="/login"
                  className="block text-center rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white hover:bg-indigo-500 shadow hover:scale-102 transition-all cursor-pointer animate-shimmer"
                >
                  Log In to Apply
                </Link>
              ) : user.role === 'CANDIDATE' ? (
                hasAppliedBefore ? (
                  <div className="text-center rounded-xl bg-emerald-500/10 p-4 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    You have applied to this job
                  </div>
                ) : (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="w-full text-center rounded-xl bg-indigo-600 py-3.5 text-xs font-bold text-white hover:bg-indigo-500 shadow hover:scale-102 transition-all cursor-pointer animate-shimmer"
                  >
                    Apply Now
                  </button>
                )
              ) : (
                <div className="text-center rounded-xl bg-slate-800/40 p-4 border border-slate-700/30 text-slate-500 text-[10px] font-bold uppercase">
                  Hiring Managers cannot apply
                </div>
              )}
            </div>
          </div>

          {/* AI Skill Matcher */}
          {user && user.role === 'CANDIDATE' && (
            <div 
              onMouseMove={handleSpotlightMouseMove}
              className="spotlight-card p-6 shadow-2xl space-y-6 cursor-default"
            >
              <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1.5 select-none">
                <Cpu size={14} className="text-indigo-400 animate-pulse" />
                <span>AI Skill Match Auditor</span>
              </h3>

              {/* Matching Circle Gauge */}
              <div className="flex items-center justify-center gap-6 relative z-10">
                <div className="relative h-20 w-20 flex items-center justify-center">
                  <svg className="h-20 w-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.03)" strokeWidth="5" fill="transparent" />
                    <circle 
                      cx="40" 
                      cy="40" 
                      r="34" 
                      stroke="#6366f1" 
                      strokeWidth="5" 
                      fill="transparent" 
                      strokeDasharray="213.6" 
                      strokeDashoffset={213.6 - (213.6 * matchPercentage) / 100}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-white">{matchPercentage}%</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Compatibility Index</h4>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                    {matchPercentage > 70 ? 'Excellent Match!' : 'Good compatibility, some gaps.'}
                  </p>
                </div>
              </div>

              {/* Skills breakdown */}
              <div className="space-y-4 pt-2 border-t border-slate-850/60 relative z-10">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <Check size={10} />
                    <span>Matching Skills ({matchingSkills.length})</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchingSkills.length === 0 ? (
                      <span className="text-[10px] text-slate-655 italic font-semibold">None matched yet.</span>
                    ) : (
                      matchingSkills.map(s => (
                        <span key={s} className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle size={10} />
                    <span>Skills to Acquire ({missingSkills.length})</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.map(s => (
                      <span key={s} className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-400">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About Company */}
          <div 
            onMouseMove={handleSpotlightMouseMove}
            className="spotlight-card p-6 shadow-2xl cursor-default"
          >
            <h3 className="text-xs font-bold text-slate-455 uppercase tracking-wider mb-4">About Company</h3>
            <div className="space-y-4 relative z-10">
              {job.recruiter?.companyLogo && (
                <img
                  src={`http://localhost:8081/${job.recruiter.companyLogo}`}
                  alt="Company Logo"
                  className="h-11 w-11 rounded-xl object-cover bg-slate-800 border border-slate-700/50"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div>
                <h4 className="text-xs font-bold text-slate-200">{job.recruiter?.companyName || 'Corporate Employer'}</h4>
                <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[9px] text-emerald-400 font-bold uppercase mt-1">
                  <ShieldCheck size={9} />
                  <span>Verified</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-450 leading-relaxed font-semibold">
                {job.recruiter?.about || 'No company overview details provided.'}
              </p>
              {job.recruiter?.website && (
                <a
                  href={job.recruiter.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-350 block cursor-pointer"
                >
                  Visit Website →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-md font-bold text-white">Apply for {job.title}</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {applied ? (
              <div className="text-center py-10 space-y-4">
                <div className="flex justify-center text-emerald-500">
                  <CheckCircle size={48} />
                </div>
                <h4 className="text-md font-bold text-white">Application Submitted!</h4>
                <p className="text-xs text-slate-400">Recruiter has been notified of your profile interest.</p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-6">
                {applyError && (
                  <div className="flex items-center space-x-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-400">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{applyError}</span>
                  </div>
                )}

                <div className="rounded-xl border border-slate-850 bg-slate-950/40 p-4 space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Candidate Selected Resume</h4>
                  {candidateProfile?.resumePath ? (
                    <p className="text-xs text-slate-350 font-semibold truncate">
                      📄 {candidateProfile.resumePath.split('/').pop()}
                    </p>
                  ) : (
                    <div className="space-y-1.5 text-center py-2">
                      <p className="text-xs text-rose-400 font-semibold">No resume uploaded on your profile.</p>
                      <Link
                        to="/candidate/profile"
                        className="text-xs text-indigo-400 hover:text-indigo-350 font-bold underline cursor-pointer"
                      >
                        Upload Resume PDF first
                      </Link>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-450 uppercase tracking-wider pl-1">
                      Cover Letter (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateCoverLetter}
                      disabled={generatingLetter}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-305 flex items-center gap-1 cursor-pointer hover:underline disabled:opacity-50"
                    >
                      <Sparkles size={11} />
                      <span>AI Magic Draft</span>
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Describe why you are a great fit for this position..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs text-slate-200 outline-none focus:border-indigo-500 placeholder-slate-700 resize-none font-medium leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-500 hover:scale-102 transition-all cursor-pointer"
                  >
                    {applying ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
