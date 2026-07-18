import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Briefcase, ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';

const PostJob = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('editId');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary: '',
    location: '',
    experience: '',
    employmentType: 'Full-time',
    category: 'Software Engineering',
    vacancies: 1,
    deadline: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const categories = ['Software Engineering', 'Data Science / AI', 'Design', 'Marketing', 'Sales', 'Product Management', 'Human Resources'];
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];

  useEffect(() => {
    if (editId) {
      const fetchJobDetails = async () => {
        setFetching(true);
        try {
          const res = await api.get(`/jobs/${editId}`);
          const job = res.data;
          setFormData({
            title: job.title || '',
            description: job.description || '',
            salary: job.salary || '',
            location: job.location || '',
            experience: job.experience || '',
            employmentType: job.employmentType || 'Full-time',
            category: job.category || 'Software Engineering',
            vacancies: job.vacancies || 1,
            deadline: job.deadline || '',
          });
        } catch (err) {
          setMsg({ type: 'error', text: 'Failed to fetch job details for editing.' });
        } finally {
          setFetching(false);
        }
      };
      fetchJobDetails();
    }
  }, [editId]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      if (editId) {
        await api.put(`/jobs/${editId}`, formData);
        setMsg({ type: 'success', text: 'Job posting updated successfully.' });
      } else {
        await api.post('/jobs', formData);
        setMsg({ type: 'success', text: 'New job posted successfully.' });
        // Reset form if creating new
        setFormData({
          title: '',
          description: '',
          salary: '',
          location: '',
          experience: '',
          employmentType: 'Full-time',
          category: 'Software Engineering',
          vacancies: 1,
          deadline: '',
        });
      }
      setTimeout(() => navigate('/recruiter/dashboard'), 1500);
    } catch (err) {
      setMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit job posting. Ensure details are correct and your account is verified.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Link to="/recruiter/dashboard" className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>

      <div>
        <h1 className="text-3xl font-extrabold text-white">
          {editId ? 'Edit Job Posting' : 'Post a New Job'}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {editId ? 'Update your listing details.' : 'Fill in the form to publish your job listing.'}
        </p>
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

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/30 p-8 backdrop-blur-md space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Backend Architect"
              className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none focus:border-indigo-500 placeholder-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300 outline-none focus:border-indigo-500"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">
                Employment Type
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300 outline-none focus:border-indigo-500"
              >
                {employmentTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Remote or San Francisco, CA"
                className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none focus:border-indigo-500 placeholder-slate-700"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">
                Salary details *
              </label>
              <input
                type="text"
                name="salary"
                required
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. $120k - $150k"
                className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none focus:border-indigo-500 placeholder-slate-700"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">
                Experience level *
              </label>
              <input
                type="text"
                name="experience"
                required
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 3-5 years"
                className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none focus:border-indigo-500 placeholder-slate-700"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">
                Number of Vacancies *
              </label>
              <input
                type="number"
                name="vacancies"
                required
                min={1}
                value={formData.vacancies}
                onChange={handleChange}
                className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">
                Application Deadline *
              </label>
              <input
                type="date"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">
              Job Description *
            </label>
            <textarea
              name="description"
              required
              rows={8}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detail job tasks, candidate requirements, tech stack, benefits, and company values..."
              className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none focus:border-indigo-500 placeholder-slate-700 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 disabled:opacity-50 disabled:scale-100 hover:scale-102 transition-all"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <Briefcase size={16} />
                <span>{editId ? 'Update Listing' : 'Publish Job Listing'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
