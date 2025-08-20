import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavbarComponent from './components/Navbar';
import Footer from './components/Footer';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';
import BlogForm from './components/BlogForm';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuthorDashboard from './components/AuthorDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <NavbarComponent />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<BlogList />} />
              <Route path="/posts/:id" element={<BlogDetail />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Author & Admin Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute roles={['AUTHOR', 'ADMIN']}>
                    <AuthorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/posts/new" 
                element={
                  <ProtectedRoute roles={['AUTHOR', 'ADMIN']}>
                    <BlogForm mode="create" />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/posts/:id/edit" 
                element={
                  <ProtectedRoute roles={['AUTHOR', 'ADMIN']}>
                    <BlogForm mode="edit" />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Admin Route */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;