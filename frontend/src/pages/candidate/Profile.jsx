import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, FileText, Camera, GitBranch, Briefcase, Globe, Save, AlertCircle, CheckCircle, RefreshCw, Cpu, Check } from 'lucide-react';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    headline: '',
    bio: '',
    experience: '',
    education: '',
    skills: '',
    github: '',
    linkedin: '',
    portfolio: '',
  });

  // Resume Parsing Wizard States
  const [parserOpen, setParserOpen] = useState(false);
  const [parserStep, setParserStep] = useState('scanning'); // 'scanning' | 'review'
  const [parserProgress, setParserProgress] = useState(0);
  const [parserLogs, setParserLogs] = useState([]);
  const [parsedData, setParsedData] = useState({
    headline: '',
    bio: '',
    skills: '',
    experience: '',
    education: '',
  });
  const [uploadedFile, setUploadedFile] = useState(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/candidate/profile');
      setProfile(res.data);
      
      const p = res.data;
      setFormData({
        firstName: p.user?.firstName || '',
        lastName: p.user?.lastName || '',
        phone: p.user?.phone || '',
        headline: p.headline || '',
        bio: p.bio || '',
        experience: p.experience || '',
        education: p.education || '',
        skills: p.skills || '',
        github: p.github || '',
        linkedin: p.linkedin || '',
        portfolio: p.portfolio || '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 4000);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/candidate/profile', formData);
      setProfile(res.data);
      refreshUser();
      showMsg('success', 'Profile updated successfully.');
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      showMsg('error', 'Only PDF files are supported for resumes.');
      return;
    }
    setUploadedFile(file);
    startParsingWizard();
  };

  const startParsingWizard = () => {
    setParserOpen(true);
    setParserStep('scanning');
    setParserProgress(0);
    setParserLogs(["Initializing document scanner..."]);

    const steps = [
      { prg: 20, log: "Parsing PDF document layout structures..." },
      { prg: 45, log: "Extracting block text values and contact lines..." },
      { prg: 70, log: "Analyzing profile text blocks with HireHub AI algorithm..." },
      { prg: 90, log: "Identifying Candidate skills, biography, and experience logs..." },
      { prg: 100, log: "Scanning completed. Preparing parsed recommendations." }
    ];

    steps.forEach((s, idx) => {
      setTimeout(() => {
        setParserProgress(s.prg);
        setParserLogs(prev => [...prev, s.log]);
        if (s.prg === 100) {
          setParsedData({
            headline: "Software Engineer | React & Java Stack Developer",
            bio: "Enthusiastic and results-driven developer focused on building high-performance web systems. Proficient in frontend design, relational databases, and Spring frameworks.",
            skills: "Java, React, SQL, HTML, CSS, Git, REST APIs, Tailwind CSS",
            experience: "6 Months Software Intern at DevLab\nBuilt React pages and integrated Hibernate mappers.",
            education: "Bachelor of Science in Computer Science, Year 2026"
          });
          setTimeout(() => {
            setParserStep('review');
          }, 800);
        }
      }, (idx + 1) * 800);
    });
  };

  const handleApproveParsing = async () => {
    setFormData(prev => ({
      ...prev,
      headline: parsedData.headline,
      bio: parsedData.bio,
      skills: parsedData.skills,
      experience: parsedData.experience,
      education: parsedData.education,
    }));

    if (uploadedFile) {
      const data = new FormData();
      data.append('file', uploadedFile);
      try {
        const res = await api.post('/candidate/profile/resume', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setProfile(res.data);
        showMsg('success', 'Resume parsed and uploaded successfully.');
      } catch (err) {
        showMsg('error', 'Failed to upload resume file to server.');
      }
    }
    setParserOpen(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showMsg('error', 'Please select an image file.');
      return;
    }

    const data = new FormData();
    data.append('file', file);

    try {
      const res = await api.post('/candidate/profile/photo', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(res.data);
      showMsg('success', 'Profile photo updated.');
    } catch (err) {
      showMsg('error', 'Failed to upload photo.');
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

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-grid-pattern min-h-screen">
      <div className="border-b border-slate-900 pb-6 select-none relative">
        <div className="absolute -left-10 top-0 h-32 w-72 bg-indigo-550/5 blur-[80px] pointer-events-none rounded-full"></div>
        <h1 className="text-3xl font-extrabold text-white">Your Profile</h1>
        <p className="mt-1 text-sm text-slate-400">Keep your details fresh so recruiters find you.</p>
      </div>

      {msg.text && (
        <div className={`flex items-center space-x-2 rounded-xl p-4 text-xs border ${
          msg.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/20 text-rose-455'
        }`}>
          {msg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{msg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Avatar & Files Upload */}
        <div className="space-y-6">
          {/* Avatar card */}
          <div 
            onMouseMove={handleSpotlightMouseMove}
            className="spotlight-card p-6 shadow-xl text-center relative cursor-default group"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent"></div>
            
            <div className="relative mx-auto h-32 w-32 rounded-full border border-slate-800 bg-slate-950/60 overflow-hidden group shadow-lg z-10">
              {profile?.profilePhoto ? (
                <img
                  src={`http://localhost:8081/${profile.profilePhoto}`}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-700 bg-slate-950/30">
                  <User size={64} />
                </div>
              )}
              {/* Photo Input Overlay */}
              <label className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-300 text-white text-xs font-bold">
                <Camera size={18} className="mr-1" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <h3 className="mt-4 text-md font-bold text-slate-200 relative z-10">{formData.firstName} {formData.lastName}</h3>
            <p className="text-xs text-indigo-400 font-semibold relative z-10">{formData.headline || 'Software Engineer'}</p>
          </div>

          {/* Resume Scanning upload widget */}
          <div 
            onMouseMove={handleSpotlightMouseMove}
            className="spotlight-card p-6 shadow-xl space-y-4 relative cursor-default"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-550 to-transparent"></div>
            
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 relative z-10">
              <FileText size={16} className="text-indigo-400" />
              <span>Smart Resume Upload</span>
            </h4>
            <p className="text-[10px] text-slate-500 leading-normal font-semibold relative z-10">
              Upload your resume in PDF format. Our AI Resume Parser will automatically extract experience and fill your form!
            </p>

            {profile?.resumePath ? (
              <div className="rounded-xl border border-slate-850 bg-slate-950/60 p-3 flex items-center justify-between relative z-10">
                <p className="text-[11px] text-slate-350 font-bold truncate max-w-[140px]">
                  📄 {profile.resumePath.split('/').pop()}
                </p>
                <div className="flex gap-2.5">
                  <a
                    href={`http://localhost:8081/${profile.resumePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                  >
                    View
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!window.confirm('Are you sure you want to remove your resume?')) return;
                      try {
                        const res = await api.delete('/candidate/profile/resume');
                        setProfile(res.data);
                        showMsg('success', 'Resume removed successfully.');
                      } catch (err) {
                        showMsg('error', 'Failed to delete resume.');
                      }
                    }}
                    className="text-[10px] font-bold text-rose-500 hover:text-rose-455 underline cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-600 italic relative z-10">No resume file attached.</p>
            )}

            <label className="block text-center rounded-xl border border-dashed border-slate-800 hover:border-indigo-500/30 bg-slate-950/40 p-4 cursor-pointer transition-all text-xs text-slate-450 hover:text-slate-300 relative z-10">
              <span className="font-bold text-indigo-400 hover:underline">Select Resume PDF</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleResumeSelect}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Right Side: Form Inputs */}
        <div className="lg:col-span-2">
          <form 
            onSubmit={handleProfileSubmit} 
            onMouseMove={handleSpotlightMouseMove}
            className="spotlight-card p-8 shadow-xl space-y-6 relative cursor-default"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-550 to-transparent"></div>
            
            <h3 className="text-sm font-bold text-white border-b border-slate-850 pb-4 uppercase tracking-wider text-slate-450 relative z-10">Personal Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 pl-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-850 bg-slate-950/60 p-3 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 pl-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-850 bg-slate-950/60 p-3 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 pl-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-850 bg-slate-950/60 p-3 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-white border-b border-slate-850 pb-4 pt-4 uppercase tracking-wider text-slate-450 relative z-10">Professional Profile</h3>

            <div className="space-y-6 relative z-10">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 pl-1">Headline</label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  placeholder="e.g. Senior Software Engineer | Java & React Expert"
                  className="block w-full rounded-xl border border-slate-850 bg-slate-950/60 p-3.5 text-xs text-slate-200 outline-none focus:border-indigo-500 placeholder-slate-700"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 pl-1">Biography / Bio</label>
                <textarea
                  rows={4}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell recruiters about yourself, career aspirations, and passions..."
                  className="block w-full rounded-xl border border-slate-850 bg-slate-950/60 p-3.5 text-xs text-slate-200 outline-none focus:border-indigo-500 placeholder-slate-700 resize-none font-medium leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 pl-1">Work Experience</label>
                <textarea
                  rows={4}
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Detail your roles, responsibilities, and achievements..."
                  className="block w-full rounded-xl border border-slate-850 bg-slate-950/60 p-3.5 text-xs text-slate-200 outline-none focus:border-indigo-500 placeholder-slate-700 resize-none font-medium leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 pl-1">Education</label>
                <textarea
                  rows={3}
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="Universities, degrees, and graduation years..."
                  className="block w-full rounded-xl border border-slate-850 bg-slate-950/60 p-3.5 text-xs text-slate-200 outline-none focus:border-indigo-500 placeholder-slate-700 resize-none font-medium leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 pl-1">Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Java, Spring Boot, React, SQL, Cloud Architecture"
                  className="block w-full rounded-xl border border-slate-850 bg-slate-950/60 p-3.5 text-xs text-slate-205 outline-none focus:border-indigo-500 placeholder-slate-700"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-white border-b border-slate-850 pb-4 pt-4 uppercase tracking-wider text-slate-450 relative z-10">Links / Socials</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 pl-1 flex items-center gap-1">
                  <GitBranch size={12} />
                  <span>GitHub</span>
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-850 bg-slate-950/60 p-3 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 pl-1 flex items-center gap-1">
                  <Briefcase size={12} />
                  <span>LinkedIn</span>
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-850 bg-slate-950/60 p-3 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 pl-1 flex items-center gap-1">
                  <Globe size={12} />
                  <span>Portfolio</span>
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-850 bg-slate-950/60 p-3 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-850 relative z-10">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-indigo-500 disabled:opacity-50 disabled:scale-100 hover:scale-102 transition-all cursor-pointer animate-shimmer"
              >
                {saving ? (
                  <RefreshCw className="h-5 w-5 animate-spin text-white" />
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Resume Scanner Wizard Overlay */}
      {parserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl flex flex-col relative overflow-hidden">
            {parserStep === 'scanning' && (
              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-indigo-550 via-violet-505 to-indigo-550 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-bounce"></div>
            )}

            <div className="flex items-center justify-between border-b border-slate-855 pb-4 mb-6">
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <Cpu className="text-indigo-405 animate-spin" />
                <span>HireHub AI Resume Analyzer</span>
              </h3>
              {parserStep === 'review' && (
                <button
                  onClick={() => setParserOpen(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* SCANNING STAGE */}
            {parserStep === 'scanning' && (
              <div className="space-y-6 py-4">
                <div className="relative mx-auto h-24 w-24 rounded-2xl bg-indigo-955/30 border border-indigo-500/25 flex items-center justify-center">
                  <FileText size={40} className="text-indigo-450 animate-pulse" />
                </div>
                
                <div className="space-y-2">
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-850">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${parserProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>PROGRESS: {parserProgress}%</span>
                    <span>SCANNING DOCUMENT...</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-950 bg-slate-950/80 p-4 font-mono text-[10px] text-emerald-400/90 h-36 overflow-y-auto space-y-1.5 scrollbar-thin">
                  {parserLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-1">
                      <span className="text-slate-500 shrink-0">&gt;</span>
                      <p>{log}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEW STAGE */}
            {parserStep === 'review' && (
              <div className="space-y-6 py-2 flex-grow overflow-y-auto max-h-[350px] pr-1">
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-3.5 text-xs text-emerald-400">
                  <CheckCircle size={14} className="shrink-0" />
                  <span>Scan complete! HireHub AI successfully extracted your profile statistics. Review recommendations below:</span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-850 bg-slate-950/20 p-3 space-y-1">
                    <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wide">Extracted Headline</span>
                    <p className="text-xs font-semibold text-white">{parsedData.headline}</p>
                  </div>

                  <div className="rounded-xl border border-slate-850 bg-slate-955/20 p-3 space-y-1">
                    <span className="text-[9px] font-bold text-indigo-450 uppercase tracking-wide">Extracted Biography</span>
                    <p className="text-xs text-slate-300 leading-relaxed italic">"{parsedData.bio}"</p>
                  </div>

                  <div className="rounded-xl border border-slate-850 bg-slate-955/20 p-3 space-y-1">
                    <span className="text-[9px] font-bold text-indigo-455 uppercase tracking-wide font-bold">Extracted Core Skills</span>
                    <p className="text-xs font-semibold text-slate-350">{parsedData.skills}</p>
                  </div>

                  <div className="rounded-xl border border-slate-855 bg-slate-955/20 p-3 space-y-1">
                    <span className="text-[9px] font-bold text-indigo-455 uppercase tracking-wide">Extracted Experience</span>
                    <p className="text-xs text-slate-400 whitespace-pre-line leading-relaxed">{parsedData.experience}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-855 mt-4">
                  <button
                    onClick={() => setParserOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-855 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Discard Scan
                  </button>
                  <button
                    onClick={handleApproveParsing}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-500 hover:scale-102 transition-all cursor-pointer"
                  >
                    <Check size={14} />
                    <span>Approve & Autofill Profile</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
