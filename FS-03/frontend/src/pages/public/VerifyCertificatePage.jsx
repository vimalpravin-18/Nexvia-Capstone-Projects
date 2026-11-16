import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Award, ShieldCheck, CheckCircle2, XCircle, ArrowLeft, Calendar, User, BookOpen } from 'lucide-react';

export const VerifyCertificatePage = () => {
  const { certNumber } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/certificates/verify/${certNumber}`);
        setCert(res.data);
      } catch (err) {
        setError(err.message || 'Certificate not found or verification failed.');
      } finally {
        setLoading(false);
      }
    };

    if (certNumber) verify();
  }, [certNumber]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center mx-auto shadow-md">
          <Award className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Nexvia Official Credential Verification</h1>
        <p className="text-xs text-slate-500">Public academic record registry powered by Nexvia Technologies.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : cert ? (
        <div className="card-saas p-8 bg-white border-2 border-emerald-500/40 rounded-3xl shadow-xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Verified Authentic & Valid
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Credential Recipient</p>
            <h2 className="text-2xl font-black text-slate-900">{cert.studentName}</h2>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Course Title:</span>
              <span className="font-bold text-slate-800">{cert.courseTitle}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Issuing Instructor:</span>
              <span className="font-bold text-slate-800">{cert.instructorName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Issue Date:</span>
              <span className="font-bold text-slate-800">
                {cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString() : 'November 16, 2026'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
              <span className="text-slate-400 font-medium">Certificate Serial:</span>
              <span className="font-mono font-bold text-blue-600">{cert.certificateNumber}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="card-saas p-8 bg-white border border-rose-200 rounded-3xl shadow-xl text-center space-y-3">
          <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Certificate Verification Failed</h2>
          <p className="text-xs text-slate-500">{error}</p>
        </div>
      )}
    </div>
  );
};
