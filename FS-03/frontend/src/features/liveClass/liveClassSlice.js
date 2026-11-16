import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchLiveClasses = createAsyncThunk(
  'liveClass/fetchLiveClasses',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/api/live-classes?${query}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchRoomDetails = createAsyncThunk(
  'liveClass/fetchRoomDetails',
  async (roomCode, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/live-classes/room/${roomCode}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const liveClassSlice = createSlice({
  name: 'liveClass',
  initialState: {
    classes: [],
    activeSession: null,
    participants: [],
    messages: [],
    isVideoOn: true,
    isAudioOn: true,
    isHandRaised: false,
    isScreenSharing: false,
    loading: false,
    error: null
  },
  reducers: {
    setMediaState(state, action) {
      const { isVideoOn, isAudioOn, isHandRaised, isScreenSharing } = action.payload;
      if (isVideoOn !== undefined) state.isVideoOn = isVideoOn;
      if (isAudioOn !== undefined) state.isAudioOn = isAudioOn;
      if (isHandRaised !== undefined) state.isHandRaised = isHandRaised;
      if (isScreenSharing !== undefined) state.isScreenSharing = isScreenSharing;
    },
    setParticipants(state, action) {
      state.participants = action.payload;
    },
    addParticipant(state, action) {
      const exists = state.participants.some(p => p.socketId === action.payload.socketId);
      if (!exists) {
        state.participants.push(action.payload);
      }
    },
    removeParticipant(state, action) {
      state.participants = state.participants.filter(p => p.socketId !== action.payload.socketId);
    },
    updateParticipantMedia(state, action) {
      const p = state.participants.find(part => part.socketId === action.payload.socketId);
      if (p) {
        Object.assign(p, action.payload);
      }
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
    },
    leaveClassroom(state) {
      state.activeSession = null;
      state.participants = [];
      state.messages = [];
      state.isHandRaised = false;
      state.isScreenSharing = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveClasses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLiveClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchLiveClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRoomDetails.fulfilled, (state, action) => {
        state.activeSession = action.payload;
      });
  }
});

export const {
  setMediaState,
  setParticipants,
  addParticipant,
  removeParticipant,
  updateParticipantMedia,
  addMessage,
  clearMessages,
  leaveClassroom
} = liveClassSlice.actions;

export default liveClassSlice.reducer;
