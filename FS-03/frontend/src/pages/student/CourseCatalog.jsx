import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses, setSelectedCategory } from '../../features/courses/courseSlice';
import { CourseCard } from '../../components/course/CourseCard';
import { Search, Filter, Compass, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'All Category',
  'UI/UX Design',
  'Hardware & Robotics',
  'Web Development',
  'Cloud Architecture',
  'Product Management'
];

export const CourseCatalog = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { courses, pagination, selectedCategory, loading } = useSelector((state) => state.courses);

  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const params = {};
    if (selectedCategory && selectedCategory !== 'All Category') params.category = selectedCategory;
    if (searchVal) params.search = searchVal;

    dispatch(fetchCourses(params));
  }, [dispatch, selectedCategory, searchVal]);

  const handleCategoryClick = (cat) => {
    dispatch(setSelectedCategory(cat));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Top Marketplace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            Curated Learning Paths
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Explore Online Courses & Masterclasses
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Build production skills with real-world project assignments, video tutorials, and live instructor critique.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by topic or title..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Category Pills Filter (Mentori & Fillo reference screenshots) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="card-saas p-12 text-center space-y-3 bg-white border border-slate-200 rounded-2xl">
          <p className="text-base font-bold text-slate-800">No courses match your filter criteria.</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try searching for a different topic or select "All Category" to view all available courses.
          </p>
          <button
            onClick={() => {
              dispatch(setSelectedCategory('All Category'));
              setSearchVal('');
            }}
            className="btn-secondary text-xs mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};
