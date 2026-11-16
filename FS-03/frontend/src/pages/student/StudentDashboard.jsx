import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyEnrollments } from '../../features/enrollments/enrollmentSlice';
import { fetchCourses } from '../../features/courses/courseSlice';
import { fetchLiveClasses } from '../../features/liveClass/liveClassSlice';
import { CertificateModal } from '../../components/certificate/CertificateModal';
import { 
  GraduationCap, 
  ArrowRight, 
  Clock, 
  BookOpen, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Award, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Video,
  FileText
} from 'lucide-react';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myEnrollments } = useSelector((state) => state.enrollments);
  const { courses } = useSelector((state) => state.courses);
  const { classes } = useSelector((state) => state.liveClass);

  const [activeCertificate, setActiveCertificate] = useState(null);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState('November 2026');

  useEffect(() => {
    dispatch(fetchMyEnrollments());
    dispatch(fetchCourses());
    dispatch(fetchLiveClasses());
  }, [dispatch]);

  // Sample static achievements matching Ace Academy reference mockup
  const achievements = [
    {
      id: 'cert_1',
      certificateNumber: 'NEX-CERT-2026-CHM-9821',
      studentName: user?.name || 'Diane Nguyen',
      courseTitle: 'Inorganic Chemistry & Lab Practice',
      instructorName: 'Prof. Linda Cruz',
      color: 'gold',
      badgeClass: 'bg-amber-50 border-amber-200 text-amber-900',
      btnClass: 'bg-amber-500 hover:bg-amber-600 text-white'
    },
    {
      id: 'cert_2',
      certificateNumber: 'NEX-CERT-2026-PHI-4412',
      studentName: user?.name || 'Diane Nguyen',
      courseTitle: 'Social Philosophy & Ethics',
      instructorName: 'Prof. Jonathan Reyes',
      color: 'purple',
      badgeClass: 'bg-purple-50 border-purple-200 text-purple-900',
      btnClass: 'bg-purple-600 hover:bg-purple-700 text-white'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 2-Column Main Dashboard Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (2 spans): Hero + My Courses + Achievements */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Welcome Hero Banner (Ace Academy style) */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/10">
            <div className="relative z-10 max-w-lg space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                November 16, Monday
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight pt-2">
                Welcome back, {user?.name?.split(' ')[0] || 'Diane'}!
              </h1>
              <p className="text-sm text-blue-100 font-medium">
                You've finished <strong className="text-white font-bold">85% of your weekly learning goal</strong>! Keep momentum going for your certificate.
              </p>
            </div>

            {/* 3D Decorative Graduation Cap */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden sm:block opacity-90 hover:scale-105 transition-transform">
              <div className="w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <GraduationCap className="w-16 h-16 text-white drop-shadow-md" />
              </div>
            </div>
          </div>

          {/* Section: My Courses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">My Courses</h2>
              <Link to="/courses" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Explore More
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {myEnrollments.length > 0 ? (
                myEnrollments.map((enr) => {
                  const course = enr.courseId;
                  if (!course) return null;
                  return (
                    <div
                      key={enr._id}
                      onClick={() => navigate(`/learn/${course._id}`)}
                      className="card-saas cursor-pointer p-4 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-blue-400 group"
                    >
                      <div>
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 mb-3">
                          <img
                            src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h3 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {course.instructorName || 'Prof. Linda Cruz'}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                          <span>Progress</span>
                          <span className="font-bold text-blue-600">{enr.progressPercentage || 85}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${enr.progressPercentage || 85}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Fallback sample courses matching reference cards */
                courses.slice(0, 3).map((course, idx) => (
                  <div
                    key={course._id || idx}
                    onClick={() => navigate(`/courses/${course.slug || course._id}`)}
                    className="card-saas cursor-pointer p-4 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-blue-400 group"
                  >
                    <div>
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 mb-3">
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {course.instructorName}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                      <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                        <span>Completed: {idx === 0 ? '85%' : idx === 1 ? '72%' : '45%'}</span>
                        <span className="text-blue-600 font-bold">Resume</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: idx === 0 ? '85%' : idx === 1 ? '72%' : '45%' }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section: Achievements (Ace Academy style) */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Achievements</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-5 rounded-2xl border flex items-center justify-between ${ach.badgeClass}`}
                >
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm text-slate-900">{ach.courseTitle}</h3>
                    <p className="text-xs text-slate-500">Verified Certificate</p>
                    <button
                      onClick={() => setActiveCertificate(ach)}
                      className={`mt-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${ach.btnClass}`}
                    >
                      View
                    </button>
                  </div>

                  <div className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-inner">
                    <Award className={`w-8 h-8 ${ach.color === 'gold' ? 'text-amber-500' : 'text-purple-600'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Rail: Mini Calendar Schedule & Upcoming Tasks */}
        <div className="space-y-6">
          
          {/* Mini Calendar Widget (Ace Academy reference screenshot) */}
          <div className="card-saas p-6 bg-white border border-slate-200 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">My Schedule</h3>
              <div className="flex items-center gap-1 text-slate-400">
                <button className="p-1 hover:text-slate-700">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-slate-700">December</span>
                <button className="p-1 hover:text-slate-700">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Days Matrix */}
            <div className="text-center text-xs">
              <div className="grid grid-cols-7 gap-1 font-semibold text-slate-400 pb-2">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-slate-700 font-medium">
                <span className="p-1.5 text-slate-300">30</span>
                <span className="p-1.5">1</span>
                <span className="p-1.5">2</span>
                <span className="p-1.5">3</span>
                <span className="p-1.5">4</span>
                <span className="p-1.5">5</span>
                <span className="p-1.5">6</span>
                <span className="p-1.5">7</span>
                <span className="p-1.5">8</span>
                <span className="p-1.5">9</span>
                <span className="p-1.5">10</span>
                <span className="p-1.5 bg-blue-600 text-white rounded-full font-bold shadow-md shadow-blue-500/30">11</span>
                <span className="p-1.5">12</span>
                <span className="p-1.5">13</span>
                <span className="p-1.5">14</span>
                <span className="p-1.5">15</span>
                <span className="p-1.5 bg-blue-100 text-blue-700 rounded-full font-bold">16</span>
                <span className="p-1.5">17</span>
                <span className="p-1.5">18</span>
                <span className="p-1.5 bg-blue-100 text-blue-700 rounded-full font-bold">19</span>
                <span className="p-1.5">20</span>
                <span className="p-1.5">21</span>
                <span className="p-1.5">22</span>
                <span className="p-1.5">23</span>
                <span className="p-1.5">24</span>
                <span className="p-1.5">25</span>
                <span className="p-1.5">26</span>
                <span className="p-1.5">27</span>
                <span className="p-1.5">28</span>
                <span className="p-1.5">29</span>
                <span className="p-1.5">30</span>
                <span className="p-1.5">31</span>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks (Ace Academy reference screenshot) */}
          <div className="card-saas p-6 bg-white border border-slate-200 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Upcoming Tasks</h3>
              <span className="text-xs text-blue-600 font-semibold cursor-pointer">See All</span>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today</p>

              {/* Task 1 */}
              <div 
                onClick={() => navigate('/live')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between cursor-pointer transition-colors border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Live Design Critique</h4>
                    <p className="text-[10px] text-slate-400">Design Thinking • 3:00 PM</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Task 2 */}
              <div className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between cursor-pointer transition-colors border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Drone Airspace Essay</h4>
                    <p className="text-[10px] text-slate-400">Hardware & Robotics</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2">This Week</p>

              {/* Task 3 */}
              <div 
                onClick={() => {
                  const firstCourse = courses[0];
                  if (firstCourse) navigate(`/quiz/${firstCourse._id}`);
                }}
                className="p-3 bg-blue-50/70 hover:bg-blue-100/70 rounded-2xl flex items-center justify-between cursor-pointer transition-colors border border-blue-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Design Thinking Quiz</h4>
                    <p className="text-[10px] text-blue-600 font-medium">Required for Certificate</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {activeCertificate && (
        <CertificateModal
          certificate={activeCertificate}
          onClose={() => setActiveCertificate(null)}
        />
      )}
    </div>
  );
};
