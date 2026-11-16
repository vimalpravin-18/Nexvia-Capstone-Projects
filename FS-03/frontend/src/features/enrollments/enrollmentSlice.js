import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchMyEnrollments = createAsyncThunk(
  'enrollments/fetchMyEnrollments',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/enrollments/my-courses');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const enrollCourse = createAsyncThunk(
  'enrollments/enrollCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/enrollments/enroll/${courseId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const completeLesson = createAsyncThunk(
  'enrollments/completeLesson',
  async ({ courseId, lessonId }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/enrollments/${courseId}/lessons/${lessonId}/complete`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState: {
    myEnrollments: [],
    loading: false,
    error: null,
    lastCompletedCertificate: null
  },
  reducers: {
    clearCertificateModal(state) {
      state.lastCompletedCertificate = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyEnrollments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.myEnrollments = action.payload;
      })
      .addCase(fetchMyEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(enrollCourse.fulfilled, (state, action) => {
        state.myEnrollments.unshift(action.payload);
      })
      .addCase(completeLesson.fulfilled, (state, action) => {
        const { enrollment, certificate } = action.payload;
        const idx = state.myEnrollments.findIndex(e => e._id === enrollment._id);
        if (idx !== -1) {
          state.myEnrollments[idx] = { ...state.myEnrollments[idx], ...enrollment };
        }
        if (certificate) {
          state.lastCompletedCertificate = certificate;
        }
      });
  }
});

export const { clearCertificateModal } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
