import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { LogoutConfirmModal } from './LogoutConfirmModal';
import { 
  GraduationCap, 
  Search, 
  Bell, 
  Video, 
  User, 
  LogOut, 
  ChevronDown, 
  ShieldCheck,
  BookOpen,
  Award
} from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const handleOpenLogout = () => {
    setDropdownOpen(false);
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">Nexvia</span>
              <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                LMS • FS-03
              </span>
            </div>
          </Link>

          {/* Global Search Bar (Only shown for authenticated users) */}
          {isAuthenticated ? (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses, skills, or live classes..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </form>
          ) : (
            <div className="flex-1" />
          )}

          {/* Right Navigation & User Menu */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <Link
                to="/live"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-full hover:bg-rose-100 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <Video className="w-3.5 h-3.5" />
                Live Classroom
              </Link>
            )}

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div className="hidden lg:block text-left text-xs">
                    <p className="font-bold text-slate-800 leading-tight">{user.name}</p>
                    <p className="text-slate-500 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      {user.role === 'student' && (
                        <>
                          <Link
                            to="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            Student Dashboard
                          </Link>
                          <Link
                            to="/certificates"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Award className="w-4 h-4 text-amber-500" />
                            My Certificates
                          </Link>
                        </>
                      )}

                      {user.role === 'instructor' && (
                        <Link
                          to="/instructor/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          Instructor Studio
                        </Link>
                      )}

                      {user.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <ShieldCheck className="w-4 h-4 text-indigo-600" />
                          Admin Command Center
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleOpenLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-xs px-3.5 py-1.5">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-xs px-3.5 py-1.5">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Professional Logout Confirmation Dialog */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};
