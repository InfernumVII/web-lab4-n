import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import pointReducer from './slices/pointSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    points: pointReducer,
  },
});

export default store;
