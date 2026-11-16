import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Star, Clock, BookOpen, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export const CourseCard = ({ course }) => {
  const { myEnrollments } = useSelector((state) => state.enrollments);
  const { user } = useSelector((state) => state.auth);

  const isEnrolled = myEnrollments.some(e => 
    e.courseId?._id === course._id || 
    e.courseId === course._id || 
    e.courseId?.slug === course.slug ||
    e.courseId?._id === course.slug
  );

  const isDiscounted = course.discountPrice !== null && course.discountPrice < course.price;
  const displayPrice = isDiscounted ? course.discountPrice : (course.price || 49.99);

  return (
    <div className="card-saas group flex flex-col overflow-hidden bg-white border border-slate-200 rounded-2xl hover:border-blue-400 hover:shadow-xl transition-all duration-300">
      {/* Thumbnail with Category & Enrollment Badge */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="badge-pill bg-white/95 backdrop-blur-md text-blue-600 border border-blue-100 shadow-sm font-bold text-[10px]">
            {course.category}
          </span>
          {isEnrolled && (
            <span className="badge-pill bg-emerald-600 text-white shadow-md text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-white" />
              Enrolled
            </span>
          )}
        </div>
        {course.level && (
          <div className="absolute top-3 right-3">
            <span className="badge-pill bg-slate-900/80 backdrop-blur-md text-white text-[10px]">
              {course.level}
            </span>
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {course.subtitle || course.description}
          </p>

          <p className="text-xs font-medium text-slate-500 mt-2">
            By <span className="text-slate-800 font-semibold">{course.instructorName || 'Jenny Wilson'}</span>
          </p>
        </div>

        {/* Rating and Lessons Stats */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
            <span>{course.rating || 4.8}</span>
            <span className="text-slate-400 font-normal">({course.ratingsCount || 244})</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              {course.totalLessons || 6} Lessons
            </span>
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {isEnrolled ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Active Access
              </span>
            ) : isDiscounted ? (
              <>
                <span className="text-lg font-extrabold text-slate-900">${course.discountPrice}</span>
                <span className="text-xs text-slate-400 line-through">${course.price}</span>
              </>
            ) : (
              <span className="text-lg font-extrabold text-slate-900">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </span>
            )}
          </div>

          <Link
            to={`/courses/${course.slug || course._id}`}
            className={`text-xs py-2 px-3.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isEnrolled
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            {isEnrolled ? (
              <>
                Resume Course
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Enroll — ${displayPrice}
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};
