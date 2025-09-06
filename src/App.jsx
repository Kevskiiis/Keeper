import React, {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/App.css';

// Modules:
import axios from 'axios';

// Authentication:
import { AuthProvider } from './authentication/AuthContext.jsx';

// Pages:
import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import AccountPage from './pages/AccountPage.jsx';

function App () {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-in" element={<AuthPage />} />
            <Route path="/user/account" element={<AccountPage/>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
export default App; 