import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../../services/api';
import { 
  Plus, 
  BookOpen, 
  DollarSign, 
  Users, 
  Star, 
  Video, 
  Calendar, 
  CheckCircle2, 
  MoreVertical, 
  ArrowRight,
  Sparkles,
  Clock
} from 'lucide-react';

export const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [showLiveModal, setShowLiveModal] = useState(false);

  // Live class form state
  const [liveTitle, setLiveTitle] = useState('');
  const [liveDescription, setLiveDescription] = useState('');
  const [liveStartTime, setLiveStartTime] = useState('');
  const [liveDuration, setLiveDuration] = useState('60');
  const [creatingLive, setCreatingLive] = useState(false);

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/courses/instructor/my-courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Error fetching instructor courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorCourses();
  }, []);

  const handleScheduleLiveClass = async (e) => {
    e.preventDefault();
    if (!liveTitle || !liveStartTime) {
      alert('Please fill in title and start time.');
      return;
    }
    setCreatingLive(true);
    try {
      const start = new Date(liveStartTime);
      const end = new Date(start.getTime() + (parseInt(liveDuration, 10) * 60 * 1000));

      const res = await api.post('/api/live-classes', {
        title: liveTitle,
        description: liveDescription,
        scheduledStartTime: start.toISOString(),
        scheduledEndTime: end.toISOString()
      });

      alert(`Live class "${res.data.title}" scheduled successfully with room code ${res.data.roomCode}!`);
      setShowLiveModal(false);
      setLiveTitle('');
      setLiveDescription('');
    } catch (err) {
      alert('Error scheduling class: ' + err.message);
    } finally {
      setCreatingLive(false);
    }
  };

  const categories = ['All Category', 'UI/UX Design', 'Hardware & Robotics', 'Web Development', 'Branding'];

  const filteredCourses = selectedCategory === 'All Category'
    ? courses
    : courses.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Top Free Trial / Active Plan Banner (Mentori reference image) */}
      <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span>You have full access to the <strong>Nexvia Instructor Studio Enterprise Tier</strong>.</span>
        </div>
        <span className="badge-pill bg-blue-600 text-white font-bold text-[10px]">
          Verified Instructor
        </span>
      </div>

      {/* Metrics Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-saas p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Revenue</p>
            <p className="text-2xl font-black text-slate-900 mt-1">$8,450.00</p>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">↑ 14% this month</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="card-saas p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Enrolled Students</p>
            <p className="text-2xl font-black text-slate-900 mt-1">1,420</p>
            <p className="text-[11px] text-blue-600 font-bold mt-1">Active learners</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="card-saas p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Authored Courses</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{courses.length || 4}</p>
            <p className="text-[11px] text-slate-400 mt-1">All stages active</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="card-saas p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Instructor Rating</p>
            <p className="text-2xl font-black text-slate-900 mt-1">4.9 / 5.0</p>
            <p className="text-[11px] text-amber-600 font-bold mt-1">310 Reviews</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Star className="w-6 h-6 fill-amber-400 stroke-none" />
          </div>
        </div>
      </div>

      {/* Course Manager Title & Action Buttons (Mentori screenshot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Courses Studio</h1>
          <p className="text-xs text-slate-500 mt-0.5">Create, manage, and broadcast courses in your academy.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLiveModal(true)}
            className="btn-secondary text-xs py-2.5 px-4"
          >
            <Video className="w-4 h-4 text-rose-500" />
            Schedule Live Class
          </button>

          <Link
            to="/instructor/courses/new"
            className="btn-primary text-xs py-2.5 px-4 bg-slate-900 hover:bg-slate-800 shadow-md"
          >
            <Plus className="w-4 h-4" />
            New Course
          </Link>
        </div>
      </div>

      {/* Category Filter Pills (Mentori screenshot) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Manager Cards Grid (Mentori reference image) */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="card-saas p-12 text-center space-y-3 bg-white border border-slate-200 rounded-2xl">
          <p className="text-base font-bold text-slate-800">No courses in this category yet.</p>
          <Link to="/instructor/courses/new" className="btn-primary text-xs mt-2">
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="card-saas p-5 bg-white border border-slate-200 rounded-3xl flex flex-col justify-between space-y-4 hover:border-blue-400 group"
            >
              <div>
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 mb-3 relative">
                  <img
                    src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="badge-pill bg-white/95 backdrop-blur-md text-blue-600 text-[10px] font-bold">
                      {course.category}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
              </div>

              {/* Metadata Row matching Mentori Card (Creation Date, Sales, Status) */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Created</p>
                  <p className="font-medium text-slate-700 mt-0.5">
                    {course.createdAt ? new Date(course.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Jan 16'}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Sales</p>
                  <p className="font-bold text-slate-900 mt-0.5">
                    ${course.price ? (course.price * 25).toFixed(0) : '1,250'}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Status</p>
                  <span className="badge-pill bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] mt-0.5">
                    Published
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  to={`/courses/${course.slug || course._id}`}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View Preview
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to={`/learn/${course._id}`}
                  className="btn-secondary text-[11px] py-1.5 px-3"
                >
                  Curriculum Editor
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Live Class Modal */}
      {showLiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-slate-900 text-sm">Schedule Interactive Live Class</h3>
              </div>
              <button onClick={() => setShowLiveModal(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
            </div>

            <form onSubmit={handleScheduleLiveClass} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Critique & Prototype Review"
                  value={liveTitle}
                  onChange={(e) => setLiveTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Agenda</label>
                <textarea
                  rows={2}
                  placeholder="What will students learn in this live stream?"
                  value={liveDescription}
                  onChange={(e) => setLiveDescription(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={liveStartTime}
                    onChange={(e) => setLiveStartTime(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Mins)</label>
                  <select
                    value={liveDuration}
                    onChange={(e) => setLiveDuration(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="30">30 mins</option>
                    <option value="60">60 mins</option>
                    <option value="90">90 mins</option>
                    <option value="120">120 mins</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLiveModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingLive}
                  className="btn-primary text-xs bg-rose-600 hover:bg-rose-700"
                >
                  {creatingLive ? 'Scheduling...' : 'Schedule Live Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
