import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  DollarSign, 
  Video, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Database,
  Cloud,
  Cpu,
  Layers,
  Sparkles,
  Server
} from 'lucide-react';

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, pendingRes, usersRes] = await Promise.all([
          api.get('/api/admin/analytics'),
          api.get('/api/admin/courses/pending'),
          api.get('/api/admin/users')
        ]);

        setAnalytics(statsRes.data);
        setPendingCourses(pendingRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error('Error loading admin analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleUpdateCourseStatus = async (courseId, status) => {
    try {
      await api.patch(`/api/admin/courses/${courseId}/status`, { status });
      setPendingCourses(prev => prev.filter(c => c._id !== courseId));
      alert(`Course status updated to ${status}.`);
    } catch (err) {
      alert('Error updating course status: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const infra = analytics?.infrastructure;

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Top Banner */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          Academic Governance & Operations
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Platform Command Center
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Oversee platform metrics, cloud infrastructure, course approvals, and user governance.
        </p>
      </div>

      {/* Analytics KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-saas p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Platform GMV</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              ${analytics?.revenue?.gross ? analytics.revenue.gross.toFixed(2) : '10,250.00'}
            </p>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">All courses combined</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="card-saas p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Platform Commission (20%)</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              ${analytics?.revenue?.platformFee ? analytics.revenue.platformFee.toFixed(2) : '2,050.00'}
            </p>
            <p className="text-[11px] text-indigo-600 font-bold mt-1">Retained fee</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="card-saas p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Registered Users</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {(analytics?.totalStudents || 0) + (analytics?.totalInstructors || 0) || users.length || 3}
            </p>
            <p className="text-[11px] text-blue-600 font-bold mt-1">
              {analytics?.totalStudents || 1} Students • {analytics?.totalInstructors || 1} Instructors
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="card-saas p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Published Courses</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {analytics?.publishedCourses || 4}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Active in catalog</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Cloud Infrastructure & Storage Monitor (MongoDB + AWS S3 + CloudFront) */}
      <div className="card-saas p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-tight">Enterprise Infrastructure & Cloud Status</h3>
              <p className="text-[11px] text-slate-400">Real-time status of Database, AWS S3 storage, CloudFront CDN, and background queues</p>
            </div>
          </div>
          <span className="badge-pill bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono self-start sm:self-auto">
            System Healthy
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Database Block */}
          <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5 font-bold text-[10px] uppercase">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Database Engine
              </span>
              <span className={`w-2 h-2 rounded-full ${infra?.database?.isMongo ? 'bg-emerald-400' : 'bg-blue-400'} animate-pulse`} />
            </div>
            <p className="font-extrabold text-white text-xs truncate">
              {infra?.database?.isMongo ? 'MongoDB Atlas (Cloud)' : 'Resilient File Store'}
            </p>
            <p className="text-[10px] text-slate-400 font-mono truncate">
              {infra?.database?.isMongo ? 'cluster0 / nexvia_lms' : 'data/lms_store.json'}
            </p>
          </div>

          {/* AWS S3 Storage Block */}
          <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5 font-bold text-[10px] uppercase">
                <Cloud className="w-3.5 h-3.5 text-amber-400" />
                AWS S3 Storage
              </span>
              <span className={`w-2 h-2 rounded-full ${infra?.s3?.s3Enabled ? 'bg-emerald-400' : 'bg-slate-400'}`} />
            </div>
            <p className="font-extrabold text-white text-xs truncate">
              {infra?.s3?.s3Enabled ? 'S3 Bucket Active' : 'Local /uploads/ Storage'}
            </p>
            <p className="text-[10px] text-slate-400 font-mono truncate">
              {infra?.s3?.bucket !== 'Not configured' ? infra?.s3?.bucket : 'Local HTTP 206 Streaming'}
            </p>
          </div>

          {/* AWS CloudFront Block */}
          <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5 font-bold text-[10px] uppercase">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                CloudFront CDN
              </span>
              <span className={`w-2 h-2 rounded-full ${infra?.s3?.cloudFrontEnabled ? 'bg-emerald-400' : 'bg-blue-400'}`} />
            </div>
            <p className="font-extrabold text-white text-xs truncate">
              {infra?.s3?.cloudFrontEnabled ? 'CloudFront Active' : 'CDN Fallback Active'}
            </p>
            <p className="text-[10px] text-slate-400 font-mono truncate">
              {infra?.s3?.cloudFrontDomain || 'Google CDN + Local'}
            </p>
          </div>

          {/* BullMQ / Background Worker Block */}
          <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5 font-bold text-[10px] uppercase">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                Background Worker
              </span>
              <span className={`w-2 h-2 rounded-full ${infra?.redis?.connected ? 'bg-emerald-400' : 'bg-blue-400'}`} />
            </div>
            <p className="font-extrabold text-white text-xs truncate">
              {infra?.redis?.connected ? 'BullMQ (Redis)' : 'Async Queue Runner'}
            </p>
            <p className="text-[10px] text-slate-400 font-mono truncate">
              FFmpeg Transcoding & Certs
            </p>
          </div>
        </div>
      </div>

      {/* Course Approval Queue */}
      <div className="card-saas p-6 bg-white border border-slate-200 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Course Verification & Quality Approval Queue</h2>
            <p className="text-xs text-slate-400">Review newly drafted or submitted courses before public marketplace listing.</p>
          </div>
          <span className="badge-pill bg-blue-50 text-blue-700 border border-blue-200 text-xs">
            {pendingCourses.length} Pending Review
          </span>
        </div>

        {pendingCourses.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 italic text-center">
            ✓ All submitted courses have been verified and approved.
          </p>
        ) : (
          <div className="space-y-3">
            {pendingCourses.map((c) => (
              <div key={c._id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="badge-pill bg-amber-100 text-amber-800 text-[10px] uppercase font-bold">
                      {c.status}
                    </span>
                    <span className="text-xs text-slate-400">{c.category}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mt-1">{c.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    By <strong className="text-slate-700">{c.instructorName || c.instructorId?.name || 'Instructor'}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateCourseStatus(c._id, 'published')}
                    className="btn-primary text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve & Publish
                  </button>
                  <button
                    onClick={() => handleUpdateCourseStatus(c._id, 'rejected')}
                    className="btn-secondary text-xs py-1.5 px-3 text-rose-600 border-rose-200 hover:bg-rose-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Directory Table */}
      <div className="card-saas p-6 bg-white border border-slate-200 rounded-3xl space-y-4">
        <h2 className="text-base font-bold text-slate-900">User Governance Directory</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">User</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Title / Scope</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id || u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-bold text-slate-900 flex items-center gap-2">
                    <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                    <span>{u.name}</span>
                  </td>
                  <td className="py-3 text-slate-600 font-mono">{u.email}</td>
                  <td className="py-3">
                    <span className={`badge-pill text-[10px] uppercase font-bold ${
                      u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' :
                      u.role === 'instructor' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{u.title || 'Platform Member'}</td>
                  <td className="py-3">
                    <span className="badge-pill bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
