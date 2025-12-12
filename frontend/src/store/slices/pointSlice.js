import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pointService } from '../../services/pointService';

export const fetchPoints = createAsyncThunk(
  'points/fetchPoints',
  async (_, { rejectWithValue }) => {
    try {
      const response = await pointService.getPoints();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch points');
    }
  }
);

export const addPoint = createAsyncThunk(
  'points/addPoint',
  async (pointData, { rejectWithValue }) => {
    try {
      const response = await pointService.addPoint(pointData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add point');
    }
  }
);

const pointSlice = createSlice({
  name: 'points',
  initialState: {
    points: [],
    loading: false,
    error: null,
    currentR: 1,
    pagination: {
      first: 0, 
      rows: 5   
    }
  },
  reducers: {
    setCurrentR: (state, action) => {
      state.currentR = action.payload;
    },

    setPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload
      };
    },
    clearPointsError: (state) => {
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPoints.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPoints.fulfilled, (state, action) => {
        state.loading = false;
        state.points = action.payload;
      })
      .addCase(fetchPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addPoint.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPoint.fulfilled, (state, action) => {
        state.loading = false;
        state.points = [action.payload, ...state.points];
        state.pagination.first = 0;
      })
      .addCase(addPoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentR, setPagination, clearPointsError } = pointSlice.actions;
export default pointSlice.reducer;