import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { LogoutConfirmModal } from './LogoutConfirmModal';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Award, 
  Video, 
  Settings, 
  LogOut, 
  PlusCircle, 
  DollarSign, 
  ShieldAlert, 
  Users, 
  FolderCheck,
  Compass
} from 'lucide-react';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleOpenLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <>
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
        {/* Navigation List */}
        <div className="flex-1 p-4 space-y-6">
          
          {/* Main Menu Header */}
          <div>
            <p className="px-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
            <nav className="space-y-1">
              
              {/* Role: Student Links */}
              {user?.role === 'student' && (
                <>
                  <NavLink to="/dashboard" className={linkClass}>
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </NavLink>
                  <NavLink to="/courses" className={linkClass}>
                    <Compass className="w-4 h-4" />
                    Browse Courses
                  </NavLink>
                  <NavLink to="/live" className={linkClass}>
                    <Video className="w-4 h-4 text-rose-500" />
                    Live Classes
                  </NavLink>
                  <NavLink to="/certificates" className={linkClass}>
                    <Award className="w-4 h-4 text-amber-500" />
                    My Certificates
                  </NavLink>
                </>
              )}

              {/* Role: Instructor Links */}
              {user?.role === 'instructor' && (
                <>
                  <NavLink to="/instructor/dashboard" className={linkClass}>
                    <LayoutDashboard className="w-4 h-4" />
                    Instructor Studio
                  </NavLink>
                  <NavLink to="/courses" className={linkClass}>
                    <Compass className="w-4 h-4" />
                    Course Catalog
                  </NavLink>
                  <NavLink to="/instructor/courses/new" className={linkClass}>
                    <PlusCircle className="w-4 h-4 text-emerald-500" />
                    Create Course
                  </NavLink>
                  <NavLink to="/live" className={linkClass}>
                    <Video className="w-4 h-4 text-rose-500" />
                    Start Live Room
                  </NavLink>
                </>
              )}

              {/* Role: Admin Links */}
              {user?.role === 'admin' && (
                <>
                  <NavLink to="/admin/dashboard" className={linkClass}>
                    <ShieldAlert className="w-4 h-4 text-indigo-500" />
                    Admin Command
                  </NavLink>
                  <NavLink to="/courses" className={linkClass}>
                    <Compass className="w-4 h-4" />
                    Catalog Management
                  </NavLink>
                  <NavLink to="/live" className={linkClass}>
                    <Video className="w-4 h-4 text-rose-500" />
                    Live Class Monitor
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          {/* Quick Settings & Help */}
          <div className="pt-4 border-t border-slate-100">
            <p className="px-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Account</p>
            <div className="space-y-1">
              <button
                onClick={handleOpenLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* User Mini Profile Card at Bottom */}
        {user && (
          <div className="p-4 border-t border-slate-200 bg-slate-50/50 m-3 rounded-2xl border">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-[11px] text-slate-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};
