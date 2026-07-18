import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import RouteGuard from './components/RouteGuard';

// Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Candidate Pages
import CandidateDashboard from './pages/candidate/Dashboard';
import CandidateProfile from './pages/candidate/Profile';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/Dashboard';
import RecruiterPostJob from './pages/recruiter/PostJob';
import RecruiterCompany from './pages/recruiter/Company';
import RecruiterApplicants from './pages/recruiter/Applicants';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  const [coords, setCoords] = useState({ x: -400, y: -400 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [visible]);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
          
          {/* Global Ambient Cursor Follower */}
          {visible && (
            <div
              className="pointer-events-none fixed h-[600px] w-[600px] rounded-full blur-[80px] z-0 transition-transform duration-200 ease-out"
              style={{
                left: `${coords.x - 300}px`,
                top: `${coords.y - 300}px`,
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.03) 60%, transparent 100%)',
              }}
            ></div>
          )}

          <Navbar />
          
          <main className="flex-grow relative z-10">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Candidate Protected Routes */}
              <Route
                path="/candidate/dashboard"
                element={
                  <RouteGuard allowedRoles={['CANDIDATE']}>
                    <CandidateDashboard />
                  </RouteGuard>
                }
              />
              <Route
                path="/candidate/profile"
                element={
                  <RouteGuard allowedRoles={['CANDIDATE']}>
                    <CandidateProfile />
                  </RouteGuard>
                }
              />

              {/* Recruiter Protected Routes */}
              <Route
                path="/recruiter/dashboard"
                element={
                  <RouteGuard allowedRoles={['RECRUITER']}>
                    <RecruiterDashboard />
                  </RouteGuard>
                }
              />
              <Route
                path="/recruiter/post-job"
                element={
                  <RouteGuard allowedRoles={['RECRUITER']}>
                    <RecruiterPostJob />
                  </RouteGuard>
                }
              />
              <Route
                path="/recruiter/profile"
                element={
                  <RouteGuard allowedRoles={['RECRUITER']}>
                    <RecruiterCompany />
                  </RouteGuard>
                }
              />
              <Route
                path="/recruiter/applicants"
                element={
                  <RouteGuard allowedRoles={['RECRUITER']}>
                    <RecruiterApplicants />
                  </RouteGuard>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <RouteGuard allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </RouteGuard>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
