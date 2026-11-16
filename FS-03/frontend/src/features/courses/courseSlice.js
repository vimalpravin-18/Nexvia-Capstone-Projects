import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/api/courses?${query}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCourseDetails = createAsyncThunk(
  'courses/fetchCourseDetails',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/courses/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    activeCourse: null,
    curriculum: [],
    pagination: { page: 1, limit: 12, total: 0, pages: 1 },
    selectedCategory: 'All Category',
    searchQuery: '',
    loading: false,
    error: null
  },
  reducers: {
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    clearActiveCourse(state) {
      state.activeCourse = null;
      state.curriculum = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCourseDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.activeCourse = action.payload.course;
        state.curriculum = action.payload.curriculum;
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedCategory, setSearchQuery, clearActiveCourse } = courseSlice.actions;
export default courseSlice.reducer;
