import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourseDetails } from '../../features/courses/courseSlice';
import { fetchMyEnrollments, completeLesson, enrollCourse } from '../../features/enrollments/enrollmentSlice';
import { VideoPlayer } from '../../components/course/VideoPlayer';
import { CurriculumAccordion } from '../../components/course/CurriculumAccordion';
import { CertificateModal } from '../../components/certificate/CertificateModal';
import { TestCheckoutModal } from '../../components/course/TestCheckoutModal';
import { 
  ChevronRight, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  Bot, 
  Award, 
  BookOpen, 
  Clock, 
  Star, 
  Check, 
  Lock,
  Zap,
  Play,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CoursePlayerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { activeCourse, curriculum, loading: courseLoading } = useSelector((state) => state.courses);
  const { myEnrollments, lastCompletedCertificate } = useSelector((state) => state.enrollments);
  const { user } = useSelector((state) => state.auth);

  const [activeLesson, setActiveLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'requirements' | 'transcript' | 'instructor'
  const [showCertModal, setShowCertModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchCourseDetails(id));
      dispatch(fetchMyEnrollments());
    }
  }, [id, dispatch]);

  // Set default active lesson on curriculum load
  useEffect(() => {
    if (curriculum && curriculum.length > 0 && !activeLesson) {
      const firstSection = curriculum[0];
      if (firstSection.lessons && firstSection.lessons.length > 0) {
        setActiveLesson(firstSection.lessons[0]);
      }
    }
  }, [curriculum, activeLesson]);

  // Handle Confetti when a certificate is earned
  useEffect(() => {
    if (lastCompletedCertificate) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      setShowCertModal(true);
    }
  }, [lastCompletedCertificate]);

  const currentEnrollment = myEnrollments.find(e => 
    (e.courseId?._id === id || e.courseId === id || e.courseId?.slug === id || activeCourse?._id === e.courseId?._id)
  );

  // Instructors and Admins have master access, students must be enrolled
  const isEnrolled = !!currentEnrollment || user?.role === 'admin' || user?.role === 'instructor';

  const completedLessonIds = currentEnrollment?.completedLessons?.map(l => l.toString()) || [];
  const progressPercentage = currentEnrollment?.progressPercentage || 0;

  const handleLessonEnded = () => {
    if (isEnrolled && activeCourse && activeLesson) {
      dispatch(completeLesson({
        courseId: activeCourse._id,
        lessonId: activeLesson._id
      }));
    }
  };

  const handleStartQuiz = () => {
    if (!isEnrolled) {
      setShowCheckoutModal(true);
      return;
    }
    if (activeCourse) {
      navigate(`/quiz/${activeCourse._id}`);
    }
  };

  const handleSelectLesson = (lesson) => {
    setActiveLesson(lesson);
  };

  const handleConfirmPurchase = async (courseId) => {
    await dispatch(enrollCourse(courseId)).unwrap();
    await dispatch(fetchMyEnrollments());
  };

  const isCurrentLessonLocked = !isEnrolled && activeLesson && !activeLesson.isFreePreview;

  if (courseLoading || !activeCourse) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const coursePrice = activeCourse.discountPrice !== null && activeCourse.discountPrice !== undefined
    ? activeCourse.discountPrice
    : (activeCourse.price || 49.99);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Breadcrumbs & Header Bar */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Link to="/courses" className="hover:text-blue-600">Courses</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{activeCourse.category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-700 font-semibold truncate max-w-xs">{activeCourse.title}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {activeCourse.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                {activeCourse.totalLessons || 6} Lessons
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {activeCourse.totalDurationMinutes || 120} mins
              </span>
              <span className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                {activeCourse.rating || 4.8} ({activeCourse.ratingsCount || 244} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEnrolled ? (
              <span className="badge-pill bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                Enrolled & Active
              </span>
            ) : (
              <button 
                onClick={() => setShowCheckoutModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-300" />
                Buy Course — ${coursePrice.toFixed(2)} (Test Mode)
              </button>
            )}

            <button 
              onClick={() => alert(`Course link copied: ${window.location.href}`)}
              className="btn-secondary text-xs py-2 px-3"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Main Video & Curriculum Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (2 spans): Video Player + AI/Transcript Banner + Tabs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Video Player OR Locked Preview Banner */}
          {isCurrentLessonLocked ? (
            <div className="relative w-full aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10 animate-pulse">
                <Lock className="w-8 h-8 stroke-[2.2]" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                  Premium Curriculum Lesson
                </span>
                <h3 className="text-lg font-black text-white">
                  {activeLesson?.title || 'Lesson Locked'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  This video lesson is reserved for enrolled students. Buy the course in test mode to immediately unlock full HD playback, quizzes, source materials, and your certificate.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-yellow-300" />
                  Enroll Now — ${coursePrice.toFixed(2)} (Test Mode)
                </button>

                {/* Option to watch free preview lesson */}
                {curriculum?.[0]?.lessons?.[0] && (
                  <button
                    onClick={() => handleSelectLesson(curriculum[0].lessons[0])}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-600 transition-colors flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-300" />
                    Watch Lesson 1 Free Preview
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <VideoPlayer
                videoUrl={activeLesson?.videoUrl || activeLesson?.cloudFrontUrl}
                title={activeLesson?.title || activeCourse.title}
                onEnded={handleLessonEnded}
              />
              {!isEnrolled && (
                <div className="p-2.5 bg-amber-50 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs text-amber-800">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    You are previewing this lesson for free.
                  </span>
                  <button
                    onClick={() => setShowCheckoutModal(true)}
                    className="font-bold text-blue-700 hover:underline flex items-center gap-1"
                  >
                    Buy Full Course (${coursePrice.toFixed(2)}) &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

          {/* AI Assistant Banner */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  AI Learning Assistant
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">Active</span>
                </p>
                <p className="text-[11px] text-slate-300">
                  Ready to answer questions about {activeLesson?.title || 'this lesson'}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-1 h-3 bg-blue-400 animate-pulse"></span>
              <span className="w-1 h-5 bg-blue-400 animate-pulse delay-75"></span>
              <span className="w-1 h-2 bg-blue-400 animate-pulse delay-150"></span>
              <span className="w-1 h-4 bg-blue-400 animate-pulse delay-100"></span>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="card-saas bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
            <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('requirements')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'requirements'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Requirements
              </button>
              <button
                onClick={() => setActiveTab('transcript')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'transcript'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Transcript Notes
              </button>
              <button
                onClick={() => setActiveTab('instructor')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'instructor'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Instructor
              </button>
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6 text-slate-700">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-base">About This Course</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {activeCourse.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm">Key Learning Objectives</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {(activeCourse.whatYouWillLearn || []).map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="text-slate-700 font-medium">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Requirements */}
            {activeTab === 'requirements' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Prerequisites</h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {(activeCourse.requirements || []).map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tab: Transcript Notes */}
            {activeTab === 'transcript' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Video Transcript Timestamps</h3>
                <div className="space-y-2">
                  {(activeLesson?.transcriptNotes || [
                    { timestamp: '01:20', text: 'Core overview of key terminology and objectives.' },
                    { timestamp: '04:15', text: 'Architectural breakdown and design trade-offs.' },
                    { timestamp: '08:40', text: 'Hands-on practical walkthrough.' }
                  ]).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <span className="font-mono text-blue-600 font-bold shrink-0">{item.timestamp}</span>
                      <span className="text-slate-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Instructor */}
            {activeTab === 'instructor' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
                    alt={activeCourse.instructorName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{activeCourse.instructorName || 'Jenny Wilson'}</h4>
                    <p className="text-xs text-slate-500">Senior Product Designer & Tech Lead</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>⭐ 4.9 Rating</span>
                      <span>👥 1,420 Students</span>
                      <span>📚 4 Courses</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ex-Google Design Lead with 10+ years designing enterprise digital products and teaching over 40,000 students worldwide.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Curriculum Accordion */}
        <div className="space-y-6">
          <CurriculumAccordion
            curriculum={curriculum}
            activeLessonId={activeLesson?._id}
            completedLessonIds={completedLessonIds}
            onSelectLesson={handleSelectLesson}
            onStartQuiz={handleStartQuiz}
            progressPercentage={progressPercentage}
            isEnrolled={isEnrolled}
            onOpenCheckout={() => setShowCheckoutModal(true)}
          />
        </div>
      </div>

      {/* Test Mode Checkout Modal */}
      <TestCheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        course={activeCourse}
        user={user}
        onConfirmPurchase={handleConfirmPurchase}
      />

      {/* Certificate Modal */}
      {showCertModal && (
        <CertificateModal
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
          certificate={lastCompletedCertificate}
        />
      )}
    </div>
  );
};
