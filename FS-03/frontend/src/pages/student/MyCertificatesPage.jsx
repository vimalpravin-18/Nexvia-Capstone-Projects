import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { CertificateModal } from '../../components/certificate/CertificateModal';
import { Award, ShieldCheck, ExternalLink, Calendar, BookOpen } from 'lucide-react';

export const MyCertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/certificates/my-certificates');
        setCertificates(res.data);
      } catch (err) {
        console.error('Error fetching certificates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCerts();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
          <Award className="w-4 h-4" />
          Accredited Credentials
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          My Verified Certificates
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Industry-recognized certificates of completion issued by Nexvia Technologies Academy with immutable verification serials.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : certificates.length === 0 ? (
        <div className="card-saas p-12 text-center space-y-3 bg-white border border-slate-200 rounded-2xl">
          <Award className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Certificates Earned Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Complete all video lessons in your enrolled courses to automatically unlock your official certificates.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="card-saas p-6 bg-white border border-slate-200 rounded-3xl flex flex-col justify-between space-y-4 hover:border-amber-400 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shadow-inner">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="badge-pill bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Verified
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-amber-700 transition-colors">
                    {cert.courseTitle}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Awarded to <strong className="text-slate-700">{cert.studentName}</strong>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="text-[11px] font-mono text-slate-400">
                  Serial: {cert.certificateNumber}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="btn-primary text-xs py-2 px-4 bg-amber-500 hover:bg-amber-600"
                  >
                    View Certificate
                  </button>

                  <a
                    href={`/verify-certificate/${cert.certificateNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Public Verify
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
};
