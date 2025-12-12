import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { initializeAuth } from './store/authThunks';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage'; 
import ProtectedRoute from './components/ProtectedRoute';
import { ProgressSpinner } from 'primereact/progressspinner'; 

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isAuthChecked } = useSelector((state) => state.auth); 
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    const themeLink = document.getElementById('theme-link');
    if (themeLink) {
        const newHref = `/themes/${theme}/theme.css`;
        if (!themeLink.href.includes(newHref)) {
            themeLink.href = newHref;
        }
    }
  }, [theme]);

  if (!isAuthChecked) {
      return (
          <div className="flex align-items-center justify-content-center h-screen surface-ground">
              <ProgressSpinner />
          </div>
      );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
            !isAuthenticated ? <LoginPage /> : <Navigate to="/main" />
        } />
        
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to={isAuthenticated ? "/main" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;