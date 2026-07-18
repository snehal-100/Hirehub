import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Search, MapPin, DollarSign, Briefcase, Calendar, Star, ChevronLeft, ChevronRight, SlidersHorizontal, Tag, AlertCircle, RefreshCw, MessageSquare, X, Send, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Jobs = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  
  // Search and Filter States
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [category, setCategory] = useState(urlCategory || '');
  const [experience, setExperience] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  
  // Auto-suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);
  
  const commonSuggestions = ['Java', 'Spring Boot', 'React', 'Full-Stack', 'Developer', 'AI', 'Machine Learning', 'Data Science', 'Design', 'Marketing', 'Product Manager', 'Remote', 'Internship'];

  // AI Chatbot States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your HireHub AI Career Assistant. Share your skills or ask me about matching roles, and I will scan our active openings!' }
  ]);
  const [botTyping, setBotTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState('createdAt,desc');

  const categories = ['Software Engineering', 'Data Science / AI', 'Design', 'Marketing', 'Sales', 'Product Management', 'Human Resources'];
  const locations = ['Remote', 'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'London, UK'];
  const experiences = ['Entry level', '1-3 years', '3-5 years', '5+ years'];
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 6,
        sort,
      };
      if (keyword) params.keyword = keyword;
      if (location) params.location = location;
      if (salary) params.salary = salary;
      if (category) params.category = category;
      if (experience) params.experience = experience;
      if (employmentType) params.employmentType = employmentType;

      const res = await api.get('/jobs', { params });
      setJobs(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    if (user && user.role === 'CANDIDATE') {
      try {
        const res = await api.get('/saved-jobs');
        setSavedJobIds(new Set(res.data.map(item => item.job?.id)));
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    setCategory(urlCategory || '');
  }, [urlCategory]);

  useEffect(() => {
    fetchJobs();
  }, [page, sort, category, location, experience, employmentType]);

  useEffect(() => {
    fetchSavedJobs();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, botTyping]);

  const handleKeywordChange = (e) => {
    const val = e.target.value;
    setKeyword(val);
    if (val.trim().length > 0) {
      const filtered = commonSuggestions.filter(s =>
        s.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (sug) => {
    setKeyword(sug);
    setShowSuggestions(false);
    setPage(0);
    setTimeout(fetchJobs, 50);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    setPage(0);
    fetchJobs();
  };

  const clearFilters = () => {
    setKeyword('');
    setLocation('');
    setSalary('');
    setCategory('');
    setExperience('');
    setEmploymentType('');
    setPage(0);
    setSearchParams({});
    setTimeout(fetchJobs, 50);
  };

  const toggleSaveJob = async (jobId) => {
    if (!user || user.role !== 'CANDIDATE') return;
    try {
      if (savedJobIds.has(jobId)) {
        await api.delete(`/saved-jobs/${jobId}`);
        setSavedJobIds(prev => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      } else {
        await api.post(`/saved-jobs/${jobId}`);
        setSavedJobIds(prev => new Set([...prev, jobId]));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isClosingSoon = (deadlineStr) => {
    if (!deadlineStr) return false;
    const deadline = new Date(deadlineStr);
    const today = new Date();
    deadline.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setBotTyping(true);

    setTimeout(() => {
      let botResponse = '';
      const textLower = userMsg.toLowerCase();

      if (textLower.includes('java') || textLower.includes('spring') || textLower.includes('backend')) {
        botResponse = "I found matches in 'Software Engineering'! We currently have an opening for 'Senior Full-Stack Engineer (React & Java)' which fits your backend skills. I recommend learning Docker and Cloud Architecture to make your application stand out.";
        setCategory('Software Engineering');
      } else if (textLower.includes('react') || textLower.includes('frontend') || textLower.includes('javascript')) {
        botResponse = "For frontend specialists, we have positions in 'Software Engineering' that require React skills. I have filtered the board for Engineering jobs. Try focusing on CSS transitions and TypeScript!";
        setCategory('Software Engineering');
      } else if (textLower.includes('ai') || textLower.includes('python') || textLower.includes('machine') || textLower.includes('learning')) {
        botResponse = "Awesome! We have a verified opening: 'AI / Machine Learning Engineer' in 'Data Science / AI'. I've filtered the jobs list to show AI roles. Recommending PyTorch and Retrieval-Augmented Generation (RAG) details.";
        setCategory('Data Science / AI');
      } else if (textLower.includes('design') || textLower.includes('figma') || textLower.includes('ui')) {
        botResponse = "Designers are highly valued! Check out the 'Design' category. We recommend mastering Figma component variants, typography, and interactive prototyping techniques.";
        setCategory('Design');
      } else {
        botResponse = "I can help you filter jobs. Try asking me: 'Suggest Java roles', 'Show AI positions', or share your skill profile (e.g. 'I know React and Figma')!";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      setBotTyping(false);
    }, 1100);
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-grid-pattern min-h-screen relative">
      {/* Page Header */}
      <div className="mb-10 text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl select-none">
          Discover <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-500 bg-clip-text text-transparent text-glow-indigo">Available Roles</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Explore vetted software engineering, data science, and product design positions from verified organizations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div 
          onMouseMove={handleSpotlightMouseMove}
          className="spotlight-card p-6 shadow-xl h-fit cursor-default"
        >
          <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-6">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-indigo-400" />
              <span>Filter Matrix</span>
            </h2>
            <button
              onClick={clearFilters}
              className="text-xs text-indigo-400 hover:text-indigo-305 font-bold transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 pl-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-855 bg-slate-950/80 p-2.5 text-xs text-slate-300 outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 pl-1">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-855 bg-slate-955/80 p-2.5 text-xs text-slate-355 outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="">All Locations</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Experience level filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 pl-1">
                Experience Level
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full rounded-xl border border-slate-855 bg-slate-955/80 p-2.5 text-xs text-slate-355 outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="">All Levels</option>
                {experiences.map(exp => <option key={exp} value={exp}>{exp}</option>)}
              </select>
            </div>

            {/* Employment Type */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 pl-1">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full rounded-xl border border-slate-855 bg-slate-955/80 p-2.5 text-xs text-slate-355 outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="">All Types</option>
                {employmentTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            {/* Salary */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 pl-1">
                Minimum Salary
              </label>
              <input
                type="text"
                placeholder="e.g. $100,000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full rounded-xl border border-slate-850 bg-slate-950/80 p-2.5 text-xs text-slate-300 outline-none focus:border-indigo-500 placeholder-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Jobs Main List Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar */}
          <div className="relative" ref={suggestionRef}>
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search jobs by keyword, title, skills or company..."
                  value={keyword}
                  onChange={handleKeywordChange}
                  onFocus={() => keyword.trim().length > 0 && setShowSuggestions(true)}
                  className="w-full rounded-2xl border border-slate-850 bg-slate-900/10 py-3.5 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-2xl border border-slate-850 bg-slate-900/10 px-4 py-3 text-xs font-semibold text-slate-300 outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="createdAt,desc">Newest First</option>
                  <option value="createdAt,asc">Oldest First</option>
                  <option value="deadline,asc">Closing Soon</option>
                </select>
                <button
                  type="submit"
                  className="rounded-2xl bg-indigo-650 px-6 py-3 text-xs font-bold text-white shadow hover:bg-indigo-600 hover:scale-102 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Search size={14} />
                  <span>Search</span>
                </button>
              </div>
            </form>

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 z-20 rounded-2xl border border-slate-850 bg-slate-900 p-2 shadow-2xl backdrop-blur-xl bg-opacity-95">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSuggestionClick(sug)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-indigo-600/10 hover:text-indigo-400 rounded-xl transition-all font-medium cursor-pointer"
                  >
                    🔍 {sug}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* count */}
          <div className="flex items-center justify-between text-xs text-slate-500 pl-2">
            <span>Found {totalElements} active openings</span>
          </div>

          {/* Loader */}
          {loading ? (
            <div className="flex h-60 items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-3xl border border-slate-850 bg-slate-900/5 p-12 text-center backdrop-blur-md">
              <Briefcase className="mx-auto h-12 w-12 text-slate-700 mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">No jobs match your search</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Try adjusting your filters, modifying keywords, or widening your salary requirements.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onMouseMove={handleSpotlightMouseMove}
                  className="spotlight-card p-6 shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-default group/card"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between relative z-10">
                      <div className="space-y-1 pr-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-block rounded-lg bg-indigo-950/40 border border-indigo-500/20 px-2 py-0.5 text-[9px] font-bold text-indigo-400 uppercase tracking-wide">
                            {job.category}
                          </span>
                          {isClosingSoon(job.deadline) && (
                            <span className="inline-flex items-center gap-0.5 rounded-lg bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[9px] font-bold text-rose-400 uppercase tracking-wide animate-pulse">
                              <AlertCircle size={8} />
                              <span>Closing Soon</span>
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-white group-hover/card:text-indigo-400 transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-semibold">
                          {job.recruiter?.companyName || 'Corporate Employer'}
                        </p>
                      </div>
                      
                      {user && user.role === 'CANDIDATE' && (
                        <button
                          onClick={() => toggleSaveJob(job.id)}
                          className={`rounded-xl p-2.5 border transition-all shrink-0 cursor-pointer ${
                            savedJobIds.has(job.id)
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                              : 'border-slate-850 text-slate-500 hover:text-slate-350'
                          }`}
                        >
                          <Star size={14} fill={savedJobIds.has(job.id) ? 'currentColor' : 'none'} />
                        </button>
                      )}
                    </div>

                    {/* Metadata tags */}
                    <div className="mt-4 flex flex-wrap gap-2 relative z-10">
                      <span className="flex items-center gap-1 rounded-lg bg-slate-850/60 border border-slate-800/40 px-2.5 py-1 text-[10px] text-slate-300">
                        <MapPin size={10} className="text-indigo-400" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center gap-1 rounded-lg bg-slate-855/60 border border-slate-800/40 px-2.5 py-1 text-[10px] text-slate-300">
                        <DollarSign size={10} className="text-indigo-400" />
                        <span>{job.salary}</span>
                      </span>
                      <span className="flex items-center gap-1 rounded-lg bg-slate-855/60 border border-slate-800/40 px-2.5 py-1 text-[10px] text-slate-300">
                        <Tag size={10} className="text-indigo-400" />
                        <span>{job.employmentType}</span>
                      </span>
                    </div>

                    {/* Description excerpt */}
                    <p className="mt-4 text-xs text-slate-400 line-clamp-3 leading-relaxed relative z-10">
                      {job.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-850/60 flex items-center justify-between relative z-10">
                    <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                      <Calendar size={10} />
                      <span>Deadline: {job.deadline}</span>
                    </span>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center space-x-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                className="rounded-xl border border-slate-855 bg-slate-900/10 p-2.5 text-slate-400 hover:bg-slate-850 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-semibold text-slate-400 px-4">
                Page {page + 1} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(prev => prev + 1)}
                className="rounded-xl border border-slate-855 bg-slate-900/10 p-2.5 text-slate-400 hover:bg-slate-850 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chatbot toggle */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-2xl flex items-center justify-center hover:scale-105 transition-all z-40 cursor-pointer glow-indigo"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chatbot */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] rounded-3xl border border-slate-800 bg-slate-950/95 shadow-2xl flex flex-col z-40 backdrop-blur-xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-slate-850 bg-indigo-950/20 rounded-t-3xl">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
                <Bot size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">AI Career Counselor</h4>
                <span className="text-[9px] text-emerald-400 font-medium">Online</span>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'bot' && (
                  <div className="h-6 w-6 rounded-lg bg-indigo-600/10 text-indigo-400 flex items-center justify-center shrink-0">
                    <Bot size={12} />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                    : 'bg-slate-900 border border-slate-850 text-slate-300 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {botTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="h-6 w-6 rounded-lg bg-indigo-600/10 text-indigo-400 flex items-center justify-center shrink-0">
                  <Bot size={12} />
                </div>
                <div className="bg-slate-900 border border-slate-850 rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs text-slate-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce delay-100"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendChat} className="p-4 border-t border-slate-850 bg-slate-950 rounded-b-3xl flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type skills e.g. Java, Python, UI..."
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-xs text-slate-200 placeholder-slate-650 outline-none focus:border-indigo-500"
            />
            <button type="submit" className="h-9 w-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center hover:scale-102 transition-all cursor-pointer">
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Jobs;
