import React, { useRef } from 'react';
import { Award, CheckCircle2, Download, Printer, X, ShieldCheck } from 'lucide-react';

export const CertificateModal = ({ certificate, onClose }) => {
  const certRef = useRef(null);

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-slate-800 text-sm">Official Certificate of Completion</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Canvas / Layout */}
        <div className="p-8 overflow-y-auto flex justify-center bg-slate-100/60">
          <div 
            ref={certRef}
            className="w-full max-w-2xl bg-white border-8 border-double border-amber-600/30 p-10 rounded-2xl shadow-xl relative text-center space-y-6"
            style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 0%, #fffdfa 100%)' }}
          >
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-500/60"></div>
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-500/60"></div>
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-500/60"></div>
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-500/60"></div>

            {/* Institution Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-white shadow-md mb-2">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-700">Nexvia Technologies Academy</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-serif">Certificate of Mastery</h2>
              <p className="text-xs text-slate-400">Awarded for Academic & Practical Excellence</p>
            </div>

            {/* Student & Course Statement */}
            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-500 uppercase tracking-widest">This is proudly presented to</p>
              <p className="text-3xl font-extrabold text-blue-900 underline decoration-amber-400 decoration-2 underline-offset-8 font-serif">
                {certificate.studentName || 'Diane Nguyen'}
              </p>
              <p className="text-xs text-slate-600 max-w-md mx-auto pt-2">
                for successfully completing all curriculum modules, quizzes, and technical assessments in
              </p>
              <h3 className="text-lg font-bold text-slate-900">
                {certificate.courseTitle || 'Design Thinking & System Engineering'}
              </h3>
            </div>

            {/* Signatures & Serial Number */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 items-end text-xs text-slate-600">
              <div className="text-left space-y-1">
                <p className="font-semibold text-slate-800">{certificate.instructorName || 'Jenny Wilson'}</p>
                <div className="w-24 h-0.5 bg-slate-400"></div>
                <p className="text-[10px] text-slate-400">Lead Course Instructor</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border-2 border-amber-500 flex items-center justify-center text-amber-600 mb-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-bold text-amber-700 tracking-widest uppercase">Verified Authentic</span>
              </div>

              <div className="text-right space-y-1">
                <p className="font-semibold text-slate-800">
                  {certificate.issuedDate ? new Date(certificate.issuedDate).toLocaleDateString() : 'November 16, 2026'}
                </p>
                <div className="w-24 h-0.5 bg-slate-400 ml-auto"></div>
                <p className="text-[10px] font-mono text-slate-400">
                  ID: {certificate.certificateNumber || 'NEX-CERT-2026-CHM-9821'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Controls */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
          <span className="text-xs font-mono text-slate-400">
            Serial: {certificate.certificateNumber}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-secondary text-xs py-2 px-3.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="btn-primary text-xs py-2 px-4"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
