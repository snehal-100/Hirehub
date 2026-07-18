import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Building, Globe, MapPin, Tag, FileText, Camera, Save, AlertCircle, CheckCircle } from 'lucide-react';

const Company = () => {
  const { user, refreshUser } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
    website: '',
    industry: '',
    location: '',
    about: '',
  });

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/recruiter/profile');
      setProfile(res.data);
      
      const p = res.data;
      setFormData({
        firstName: p.user.firstName || '',
        lastName: p.user.lastName || '',
        phone: p.user.phone || '',
        companyName: p.companyName || '',
        website: p.website || '',
        industry: p.industry || '',
        location: p.location || '',
        about: p.about || '',
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
    setTimeout(() => setMsg({ type: '', text: '' }), 4500);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/recruiter/profile', formData);
      setProfile(res.data);
      refreshUser();
      showMsg('success', 'Company profile updated.');
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Failed to update company profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showMsg('error', 'Please select an image file for the company logo.');
      return;
    }

    const data = new FormData();
    data.append('file', file);

    try {
      const res = await api.post('/recruiter/profile/logo', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(res.data);
      showMsg('success', 'Company logo updated.');
    } catch (err) {
      showMsg('error', 'Failed to upload company logo.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Company Profile</h1>
        <p className="mt-1 text-sm text-slate-400">Establish your company presence to attract applicants.</p>
      </div>

      {msg.text && (
        <div className={`flex items-center space-x-2 rounded-xl p-4 text-sm border ${
          msg.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {msg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{msg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side Logo Card */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur-md text-center">
            {/* Logo upload */}
            <div className="relative mx-auto h-32 w-32 rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden group flex items-center justify-center">
              {profile?.companyLogo ? (
                <img
                  src={`http://localhost:8081/${profile.companyLogo}`}
                  alt="Company Logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-600 bg-slate-900/40">
                  <Building size={48} />
                </div>
              )}
              {/* Photo Input Overlay */}
              <label className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-300 text-white text-xs font-semibold">
                <Camera size={18} className="mr-1" />
                <span>Upload Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <h3 className="mt-4 text-md font-bold text-slate-200">{formData.companyName || 'Set Company Name'}</h3>
            <p className="text-xs text-indigo-400 font-semibold">{formData.industry || 'Tech Industry'}</p>

            <div className="mt-6 border-t border-slate-800/80 pt-4 flex flex-col items-center gap-2">
              <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-bold uppercase border ${
                profile?.verified
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              }`}>
                {profile?.verified ? 'Verified Employer' : 'Pending Verification'}
              </span>
              {!profile?.verified && (
                <p className="text-[10px] text-slate-500 px-2 mt-1 leading-normal">
                  Verification is completed by administrators. Verified recruiters can post jobs on the portal.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleProfileSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/30 p-8 backdrop-blur-md space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-4">Recruiter Account</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-4 pt-4">Company Details</h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">Website URL</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g. Artificial Intelligence, FinTech"
                    className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. San Francisco, CA"
                    className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">About Company</label>
                <textarea
                  rows={4}
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Describe your company culture, products, and vision..."
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none focus:border-indigo-500 placeholder-slate-700 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 disabled:opacity-50 disabled:scale-100 hover:scale-102 transition-all"
              >
                {saving ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Company Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Company;
