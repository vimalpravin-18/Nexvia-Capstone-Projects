import React, { useEffect } from 'react';
import { LogOut, X, AlertTriangle } from 'lucide-react';

export const LogoutConfirmModal = ({ isOpen, onClose, onConfirm, isLoggingOut }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-sm w-full p-6 text-center space-y-5 animate-scale-up relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
      >
        {/* Top subtle decorative strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-inner mt-2">
          <LogOut className="w-7 h-7 stroke-[2.2]" />
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 id="logout-title" className="text-lg font-extrabold text-slate-900 tracking-tight">
            Confirm Sign Out
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed px-2">
            Are you sure you want to end your session? You will need to sign in again to access your learning dashboard, live classes, and courses.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 shadow-md shadow-rose-600/25 transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            {isLoggingOut ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
