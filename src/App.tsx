import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import EvaluationForm from './pages/EvaluationForm.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Navbar from './components/Navbar.tsx';
import TestPage from './pages/TestPage.tsx';
import './App.css';

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, loading } = useAuth();
  if (loading) return <p>Loading...</p>; // Or a spinner component
  return token ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test" element={<TestPage />} />
        <Route 
          path="/evaluation" 
          element={
            <ProtectedRoute>
              <EvaluationForm />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Redirect to /evaluation if logged in, otherwise to /login */}
        <Route path="*" element={<Navigate to="/login" />} /> 
      </Routes>
    </>
  );
}

function AuthProviderWithRouter() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProviderWithRouter />
    </Router>
  );
}

export default App; 