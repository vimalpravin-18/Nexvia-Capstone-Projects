import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser } from './features/auth/authSlice';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ScrollToTop } from './components/common/ScrollToTop';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { CourseCatalog } from './pages/student/CourseCatalog';
import { CoursePlayerPage } from './pages/student/CoursePlayerPage';
import { QuizPage } from './pages/student/QuizPage';
import { MyCertificatesPage } from './pages/student/MyCertificatesPage';
import { InstructorDashboard } from './pages/instructor/InstructorDashboard';
import { CourseBuilderPage } from './pages/instructor/CourseBuilderPage';
import { LiveClassroomPage } from './pages/live/LiveClassroomPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { VerifyCertificatePage } from './pages/public/VerifyCertificatePage';

export const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, [isAuthenticated, dispatch]);

  // Check if current route is an auth page or public verification
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isPublicVerification = location.pathname.startsWith('/verify-certificate');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <ScrollToTop />
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Persistent Sidebar (visible for logged-in users on non-auth pages) */}
        {isAuthenticated && !isAuthPage && !isPublicVerification && (
          <div className="hidden md:block">
            <Sidebar />
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Routes>
            {/* Landing / Root Route: Strictly requires login */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  user?.role === 'admin' ? (
                    <Navigate to="/admin/dashboard" replace />
                  ) : user?.role === 'instructor' ? (
                    <Navigate to="/instructor/dashboard" replace />
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Authenticated Student Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <CourseCatalog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id"
              element={
                <ProtectedRoute>
                  <CoursePlayerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn/:id"
              element={
                <ProtectedRoute>
                  <CoursePlayerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/:courseId"
              element={
                <ProtectedRoute>
                  <QuizPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificates"
              element={
                <ProtectedRoute>
                  <MyCertificatesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/live"
              element={
                <ProtectedRoute>
                  <LiveClassroomPage />
                </ProtectedRoute>
              }
            />

            {/* Authenticated Instructor Routes */}
            <Route
              path="/instructor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/new"
              element={
                <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                  <CourseBuilderPage />
                </ProtectedRoute>
              }
            />

            {/* Authenticated Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Public Auth & Third-Party Verification Routes */}
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
            />
            <Route
              path="/verify-certificate/:certNumber"
              element={<VerifyCertificatePage />}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
