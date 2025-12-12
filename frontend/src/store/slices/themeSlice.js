import { createSlice } from '@reduxjs/toolkit';

const THEME_STORAGE_KEY = 'theme';
const DEFAULT_THEME = 'lara-light-blue';

const getInitialTheme = () => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme || DEFAULT_THEME;
};

const initialThemeValue = getInitialTheme();

const initialState = {
  theme: initialThemeValue, 
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload.theme;
      localStorage.setItem(THEME_STORAGE_KEY, action.payload.theme);
    },
  },
});

export const getAvailableThemes = () => {

    const themes = [
        'lara-light-blue',
        'lara-light-indigo',
        'lara-light-purple',
        'lara-light-teal',
        'saga-blue',
        'saga-green',
        'saga-orange',
        'saga-purple',
        'fluent-light',
        'mira',
        'lara-dark-blue',
        'lara-dark-indigo',
        'lara-dark-purple',
        'lara-dark-teal',
        'arya-blue',
        'arya-green',
        'arya-orange',
        'arya-purple',
        'vela-blue',
        'viva-dark'
    ];

    return themes;
};

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;