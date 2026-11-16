import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  PlayCircle, 
  Lock, 
  Sparkles,
  Award,
  ArrowRight
} from 'lucide-react';

export const CurriculumAccordion = ({ 
  curriculum = [], 
  activeLessonId, 
  completedLessonIds = [], 
  onSelectLesson,
  onStartQuiz,
  progressPercentage = 0,
  isEnrolled = true,
  onOpenCheckout
}) => {
  const [openSections, setOpenSections] = useState({ 0: true, 1: true });

  const toggleSection = (idx) => {
    setOpenSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="card-saas bg-white border border-slate-200 rounded-2xl p-5 space-y-6">
      
      {/* Study Progress Section (DronePilot style) */}
      <div className="space-y-2 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span>{isEnrolled ? 'Your study progress' : 'Course Access Status'}</span>
          {isEnrolled ? (
            <span className="text-blue-600 font-extrabold">{progressPercentage}%</span>
          ) : (
            <span className="text-amber-600 font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" /> Preview Mode
            </span>
          )}
        </div>

        {isEnrolled ? (
          <>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {progressPercentage === 100 
                ? '🎉 Outstanding! Course 100% completed.' 
                : "Keep going! You're on track to earn your verified certificate."}
            </p>

            {/* Start Quiz Action CTA (DronePilot reference image) */}
            {onStartQuiz && (
              <button
                onClick={onStartQuiz}
                className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-500/20 transition-all hover:scale-[1.01]"
              >
                <Award className="w-4 h-4" />
                Start Course Quiz
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        ) : (
          <div className="space-y-3 pt-1">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Enroll now to unlock the complete video curriculum, interactive quizzes, and earn your verified certificate.
            </p>
            <button
              onClick={onOpenCheckout}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Unlock Full Course (Test Mode)
            </button>
          </div>
        )}
      </div>

      {/* Course Overview / Accordion Content */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Course Modules</h4>

        {curriculum.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No modules loaded yet.</p>
        ) : (
          curriculum.map((section, sIdx) => {
            const isOpen = openSections[sIdx] ?? true;

            return (
              <div key={section._id || sIdx} className="border border-slate-100 rounded-xl overflow-hidden">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(sIdx)}
                  className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-left hover:bg-slate-100/70 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-800">
                    {section.title || `Stage ${sIdx + 1}`}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {/* Lessons List */}
                {isOpen && (
                  <div className="divide-y divide-slate-100 bg-white">
                    {(section.lessons || []).map((lesson, lIdx) => {
                      const isCompleted = completedLessonIds.includes(lesson._id);
                      const isActive = activeLessonId === lesson._id;
                      const isLocked = !isEnrolled && !lesson.isFreePreview;

                      return (
                        <button
                          key={lesson._id || lIdx}
                          onClick={() => {
                            onSelectLesson(lesson);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors ${
                            isActive
                              ? 'bg-blue-50/80 text-blue-700 font-semibold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : isLocked ? (
                              <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            ) : isActive ? (
                              <PlayCircle className="w-4 h-4 text-blue-600 shrink-0 animate-pulse" />
                            ) : (
                              <PlayCircle className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span className="text-xs truncate">{lesson.title}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isLocked ? (
                              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200/80 px-1.5 py-0.5 rounded font-medium">
                                Locked
                              </span>
                            ) : lesson.isFreePreview && !isEnrolled ? (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                                Free Preview
                              </span>
                            ) : null}

                            <span className="text-[11px] font-mono text-slate-400">
                              {lesson.durationFormatted || '10:00'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
