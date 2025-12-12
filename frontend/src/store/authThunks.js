import { loginStart, loginSuccess, loginFailure, logout, 
    setUser, setToken, setAuthChecked } from './slices/authSlice';
import { authService } from '../services/authService';

export const login = (username, password) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await authService.login(username, password);
    const { token, user } = response.data.data;

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));

    dispatch(loginSuccess({ token, user }));
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    dispatch(loginFailure(message));
    return { success: false, message };
  }
};

export const register = (username, password) => async (dispatch) => {
  dispatch(loginStart()); 
  try {
    await authService.register(username, password);
    
    dispatch(loginFailure(null)); 
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    dispatch(loginFailure(message));
    return { success: false, message };
  }
};

export const handleLogout = () => async (dispatch) => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  }
  dispatch(logout());
};

export const initializeAuth = () => async (dispatch) => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');

  if (token && user) {
    try {
      dispatch(setToken(token));
      dispatch(setUser(JSON.parse(user)));
      
      const response = await authService.verifyToken(token);
      
      if (!response.data.success) {
          throw new Error("Token invalid");
      }

    } catch (error) {
      console.warn("Token expired or invalid", error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      dispatch(logout());
    } finally {
      dispatch(setAuthChecked(true));
    }
  } else {
    dispatch(setAuthChecked(true));
  }
};
