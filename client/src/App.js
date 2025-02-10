import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login/Login';
import Home from './components/Home';
import ProtectedRoute from './ProtectedRoute';
import SalesPhone from './components/SalesPhones/SalesPhone';
import Navbar from './components/Shared/Navbar'; 
import Footer from './components/Shared/Footer';
import WhitePhone from './components/WhitePhones/WhitePhones';
import WhatsApp from './components/Whatsapp/Whatsapp';

const App = () => {
  return (
    <>
      <BrowserRouter> 
        <Navbar />
        <AuthProvider> 
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Sales-Phones"
              element={
                <ProtectedRoute>
                  <SalesPhone />
                </ProtectedRoute>
              }
            />
            <Route
              path="/White-Phones"
              element={
                <ProtectedRoute>
                  <WhitePhone />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Whatsapp"
              element={
                <ProtectedRoute>
                  <WhatsApp />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Footer /> 
    </>
  );
};

export default App;