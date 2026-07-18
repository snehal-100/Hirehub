import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, UserPlus, ShieldCheck, Zap, BarChart, Code, Cpu, Palette, Megaphone, LineChart, Layers, MapPin, DollarSign, Calendar, Activity, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trendingJobs, setTrendingJobs] = useState([]);
  const canvasRef = useRef(null);
  
  // Real-time Activity Feed States
  const [activities, setActivities] = useState([
    { id: 1, text: "Alex S. applied for 'Senior Full-Stack Engineer'", time: "Just now" },
    { id: 2, text: "TechCorp Solutions posted 'AI / Machine Learning Engineer'", time: "2 mins ago" },
    { id: 3, text: "Jane D. verified her recruiter profile status", time: "5 mins ago" },
    { id: 4, text: "Sarah K. uploaded her new developer resume", time: "10 mins ago" },
  ]);

  const mockNames = ["David L.", "Michael C.", "Sophia R.", "Emma W.", "Daniel M.", "Olivia T."];
  const mockRoles = ["Data Analyst", "UI/UX Designer", "DevOps Engineer", "Frontend Specialist", "QA Architect"];
  const mockCompanies = ["CloudScale", "IntellectAI", "CreativePulse", "WebFlow Pro", "SecuroNet"];

  useEffect(() => {
    const fetchTrendingJobs = async () => {
      try {
        const res = await api.get('/jobs', { params: { size: 2 } });
        setTrendingJobs(res.data.content || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrendingJobs();

    // Ticker simulation
    const interval = setInterval(() => {
      const name = mockNames[Math.floor(Math.random() * mockNames.length)];
      const role = mockRoles[Math.floor(Math.random() * mockRoles.length)];
      const company = mockCompanies[Math.floor(Math.random() * mockCompanies.length)];
      
      const type = Math.random();
      let activityText = "";
      if (type < 0.4) {
        activityText = `${name} applied for '${role}' position`;
      } else if (type < 0.7) {
        activityText = `${company} published a new '${role}' opening`;
      } else {
        activityText = `${name} updated their skills profile`;
      }

      setActivities(prev => [
        { id: Date.now(), text: activityText, time: "Just now" },
        ...prev.slice(0, 4)
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Particle Node Network Canvas Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let particles = [];
    const particleCount = 65;
    
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    let mouse = { x: null, y: null, radius: 160 };
    
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.55;
        this.vy = (Math.random() - 0.5) * 0.55;
        this.radius = Math.random() * 2 + 1.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
        ctx.fill();
      }
    }
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 105) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.16 - dist / 1050})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.26 - dist / 1600})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const categoriesList = [
    { name: 'Software Engineering', icon: Code, count: '4.2k+ jobs' },
    { name: 'Data Science / AI', icon: Cpu, count: '1.8k+ jobs' },
    { name: 'Design', icon: Palette, count: '950 jobs' },
    { name: 'Marketing', icon: Megaphone, count: '1.2k+ jobs' },
    { name: 'Sales', icon: LineChart, count: '2.1k+ jobs' },
    { name: 'Product Management', icon: Layers, count: '850 jobs' },
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/jobs?category=${encodeURIComponent(categoryName)}`);
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
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-slate-950">
      
      {/* Interactive Canvas Background Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Premium Mesh Ambient Spots */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none bg-grid-pattern">
        <div className="absolute top-[-25%] right-[-10%] h-[700px] w-[700px] rounded-full bg-gradient-to-tr from-indigo-500/10 to-indigo-650/15 blur-[160px]"></div>
        <div className="absolute bottom-[-20%] left-[-15%] h-[750px] w-[750px] rounded-full bg-gradient-to-br from-violet-500/10 to-violet-650/15 blur-[160px]"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center space-y-28 relative z-10">
        
        {/* Hero Section */}
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/5 px-4.5 py-2 text-xs font-bold tracking-wide text-indigo-400 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.05)] select-none">
            <Zap size={12} className="animate-pulse" />
            <span className="uppercase tracking-wider">Hiring Operating System v1.2</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl leading-[1.1] select-none">
            The Intelligent Way to{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-500 bg-clip-text text-transparent text-glow-indigo">
              Hire & Get Hired
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed font-medium">
            Discover verified tech positions or manage applications in a high-fidelity system designed for developers, recruiters, and platform moderations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/jobs"
              className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4.5 text-sm font-bold text-white shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-103 transition-all cursor-pointer group"
            >
              <span>Explore Board</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            {!user && (
              <Link
                to="/register"
                className="flex items-center space-x-2 rounded-2xl border border-slate-850 bg-slate-900/10 px-8 py-4.5 text-sm font-bold text-slate-350 hover:text-white hover:bg-slate-900/40 hover:border-slate-700 transition-all hover:scale-103 cursor-pointer"
              >
                <UserPlus size={16} />
                <span>Join Platform</span>
              </Link>
            )}
          </div>
        </div>

        {/* SaaS Mockup Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {/* Main Visual Terminal Mockup */}
          <div className="lg:col-span-2 spotlight-card p-0 shadow-2xl flex flex-col justify-between text-left relative group cursor-default" onMouseMove={handleSpotlightMouseMove}>
            <div className="flex items-center justify-between border-b border-slate-850 bg-slate-950 px-5 py-3 rounded-t-3xl">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-indigo-400" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest select-none">HireHub Terminal Shell</span>
              </div>
              <div className="flex gap-1.5 select-none">
                <span className="h-2 w-2 rounded-full bg-rose-500/60"></span>
                <span className="h-2 w-2 rounded-full bg-amber-500/60"></span>
                <span className="h-2 w-2 rounded-full bg-emerald-500/60"></span>
              </div>
            </div>

            <div className="p-6 font-mono text-xs text-slate-350 space-y-4 flex-grow h-60 overflow-y-auto">
              <div className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">$</span>
                <p className="text-slate-400">hirehub --query matching-engine</p>
              </div>
              <div className="text-[11px] text-emerald-400/90 pl-4 space-y-1">
                <p>[INFO] Seeded default database schema "hirehub" successfully.</p>
                <p>[INFO] Seeded Platform Admin: admin@hirehub.com (verified)</p>
                <p>[INFO] Seeded Recruiter: Jane Doe at TechCorp (verified)</p>
                <p>[INFO] Seeded Candidate: Alex Smith (Skills: Java, React, Git)</p>
                <p>[INFO] Active matching listeners: [ON] Port 8081</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">$</span>
                <p className="text-slate-400">verify-roles --active</p>
              </div>
              <div className="text-[11px] text-indigo-400/90 pl-4">
                <p>&gt; Candidates: 1, Recruiters: 1, Admins: 1</p>
              </div>
              <div className="flex items-start gap-2 animate-pulse">
                <span className="text-indigo-500 font-bold">$</span>
                <span className="h-3 w-1.5 bg-indigo-500"></span>
              </div>
            </div>

            <div className="border-t border-slate-850 px-6 py-4 bg-slate-950 flex items-center justify-between text-[10px] text-slate-500 font-bold select-none rounded-b-3xl">
              <span>SYSTEM: ONLINE</span>
              <span>PING: 14ms</span>
            </div>
          </div>

          {/* Live Activity Feed panel */}
          <div className="spotlight-card p-6 shadow-2xl text-left flex flex-col justify-between relative group cursor-default" onMouseMove={handleSpotlightMouseMove}>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-6 select-none">
                <Activity size={14} className="text-indigo-400 animate-pulse" />
                <span>Live Event Stream</span>
              </h3>
              
              <div className="space-y-4 max-h-[220px] overflow-hidden relative">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="rounded-2xl border border-slate-850 bg-slate-950/20 p-3.5 flex items-start gap-3 transition-all duration-500 animate-in slide-in-from-top-4 duration-300 hover:border-slate-800"
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 animate-ping"></span>
                    <div className="space-y-0.5">
                      <p className="text-[11px] text-slate-300 leading-normal font-semibold">{act.text}</p>
                      <span className="text-[9px] text-slate-500 font-bold uppercase">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-850/60 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase select-none">
              <span>Feed Status</span>
              <span className="text-emerald-400">Polling</span>
            </div>
          </div>
        </div>

        {/* Category Tiles */}
        <div className="space-y-12">
          <div className="text-center space-y-2 select-none">
            <h2 className="text-2xl font-bold text-white sm:text-4xl">Browse by Domain</h2>
            <p className="text-sm text-slate-400">Select an expert sector to filter relevant postings instantly.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categoriesList.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleCategoryClick(cat.name)}
                  onMouseMove={handleSpotlightMouseMove}
                  className="spotlight-card p-6 text-center backdrop-blur-md hover:-translate-y-2 transition-all duration-300 group cursor-pointer shadow-lg z-10"
                >
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-slate-400 group-hover:bg-indigo-600/10 group-hover:text-indigo-400 transition-all shadow-inner">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 text-xs font-bold text-slate-200 group-hover:text-white line-clamp-1">{cat.name}</h3>
                  <p className="mt-1.5 text-[9px] font-bold text-slate-500 group-hover:text-slate-450 uppercase tracking-wider">{cat.count}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Trending Jobs */}
        {trendingJobs.length > 0 && (
          <div className="space-y-12">
            <div className="text-center space-y-2 select-none">
              <h2 className="text-2xl font-bold text-white sm:text-4xl">Trending Opportunities</h2>
              <p className="text-sm text-slate-400">Inspect highly requested roles verified by HireHub.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {trendingJobs.map((job) => (
                <div
                  key={job.id}
                  onMouseMove={handleSpotlightMouseMove}
                  className="spotlight-card p-6 text-left backdrop-blur-md hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between shadow-xl cursor-default"
                >
                  <div>
                    <span className="inline-block rounded-lg bg-indigo-950/40 border border-indigo-500/20 px-2.5 py-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wide mb-3">
                      {job.category}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold">{job.recruiter?.companyName || 'Corporate Employer'}</p>

                    <div className="mt-4 flex gap-3">
                      <span className="flex items-center gap-1 rounded-lg bg-slate-850/60 border border-slate-800/40 px-2.5 py-1 text-[10px] text-slate-355">
                        <MapPin size={11} className="text-indigo-400" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center gap-1 rounded-lg bg-slate-850/60 border border-slate-800/40 px-2.5 py-1 text-[10px] text-slate-355">
                        <DollarSign size={11} className="text-indigo-400" />
                        <span>{job.salary}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-850/60 flex items-center justify-between z-10">
                    <span className="text-[9px] text-slate-500 flex items-center gap-1">
                      <Calendar size={11} />
                      <span>Deadline: {job.deadline}</span>
                    </span>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                      Apply Now →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="spotlight-card p-8 text-left hover:border-indigo-500/30 transition-all duration-350 shadow-xl group cursor-default" onMouseMove={handleSpotlightMouseMove}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-400 mb-6 group-hover:scale-105 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Verified Recruiters</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Every recruiter is verified manually by our admins. No fake listings, only high-quality opportunities.
            </p>
          </div>

          <div className="spotlight-card p-8 text-left hover:border-indigo-500/30 transition-all duration-350 shadow-xl group cursor-default" onMouseMove={handleSpotlightMouseMove}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-400 mb-6 group-hover:scale-105 transition-transform">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Instant Alerts</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Receive live notifications for application updates, shortlisted invitations, and recruiter verification checks.
            </p>
          </div>

          <div className="spotlight-card p-8 text-left hover:border-indigo-500/30 transition-all duration-350 shadow-xl group cursor-default" onMouseMove={handleSpotlightMouseMove}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-400 mb-6 group-hover:scale-105 transition-transform">
              <BarChart size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Dashboard Telemetry</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Interactive analytics panel for tracking application statuses, recruitment metrics, and platform usage.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900/60 bg-slate-950 py-8 text-center text-xs text-slate-500 mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} HireHub. Crafted for recruiters and professionals alike.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
