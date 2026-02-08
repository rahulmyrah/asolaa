import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AppOverview from './pages/AppOverview';
import KeywordResearch from './pages/KeywordResearch';
import Reviews from './pages/Reviews';
import Settings from './pages/Settings';
import ASOGenerator from './pages/ASOGenerator';
import Competitors from './pages/Competitors';
import MarketTrends from './pages/MarketTrends';
import Login from './pages/Login';
import AuthGuard from './components/AuthGuard';
import { useAppStore } from './store/appStore';
import { subscribeToAuthChanges } from './services/auth';
import './styles/main.css';
import './styles/sidebar.css';

function AuthListener() {
  const { setUser, setAuthLoading, fetchUserApps } = useAppStore();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setUser(user);
      if (user) {
        fetchUserApps(user.uid);
      }
    });
    return () => unsubscribe();
  }, [setUser, fetchUserApps]);

  return null;
}

function MainLayout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthListener />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <AuthGuard>
            <MainLayout><Dashboard /></MainLayout>
          </AuthGuard>
        } />
        <Route path="/dashboard" element={
          <AuthGuard>
            <MainLayout><Dashboard /></MainLayout>
          </AuthGuard>
        } />
        <Route path="/market-trends" element={
          <AuthGuard>
            <MainLayout><MarketTrends /></MainLayout>
          </AuthGuard>
        } />
        <Route path="/keyword-research" element={
          <AuthGuard>
            <MainLayout><KeywordResearch /></MainLayout>
          </AuthGuard>
        } />
        <Route path="/reviews" element={
          <AuthGuard>
            <MainLayout><Reviews /></MainLayout>
          </AuthGuard>
        } />
        <Route path="/settings" element={
          <AuthGuard>
            <MainLayout><Settings /></MainLayout>
          </AuthGuard>
        } />
        <Route path="/aso-generator" element={
          <AuthGuard>
            <MainLayout><ASOGenerator /></MainLayout>
          </AuthGuard>
        } />
        <Route path="/competitors" element={
          <AuthGuard>
            <MainLayout><Competitors /></MainLayout>
          </AuthGuard>
        } />

        {/* Placeholder Routes - All Protected */}
        <Route path="*" element={
          <AuthGuard>
            <MainLayout><Dashboard /></MainLayout>
          </AuthGuard>
        } />
      </Routes>
    </Router>
  );
}

export default App;

