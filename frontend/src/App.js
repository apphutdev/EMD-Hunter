import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import KeywordResearch from "./pages/KeywordResearch";
import SERPAnalysis from "./pages/SERPAnalysis";
import SavedOpportunities from "./pages/SavedOpportunities";
import "./App.css";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-neon w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-primary/20"></div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#0A0A0B',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#EDEDED',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/research" 
              element={
                <ProtectedRoute>
                  <KeywordResearch />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/serp/:keyword?" 
              element={
                <ProtectedRoute>
                  <SERPAnalysis />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/opportunities" 
              element={
                <ProtectedRoute>
                  <SavedOpportunities />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
