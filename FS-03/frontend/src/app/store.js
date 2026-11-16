import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import courseReducer from '../features/courses/courseSlice';
import enrollmentReducer from '../features/enrollments/enrollmentSlice';
import liveClassReducer from '../features/liveClass/liveClassSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    enrollments: enrollmentReducer,
    liveClass: liveClassReducer
  }
});
