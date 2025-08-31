import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import Navigation from './components/Navigation';
import LoginScreen from './components/LoginScreen';
import StudentPortal from './components/StudentPortal';
import AdminDashboard from './components/AdminDashboard';
import CourseList from './components/CourseList';
import StudentList from './components/StudentList';
import CourseForm from './components/CourseForm';
import StudentForm from './components/StudentForm';
import CourseEnrollments from './components/CourseEnrollments';
import GradeEntry from './components/GradeEntry';
import StudentTranscript from './components/StudentTranscript';
import ProtectedRoute from './components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginScreen />} />
            <Route path="/student/portal" element={<StudentPortal />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/courses" element={
              <ProtectedRoute requiredRole="admin">
                <CourseList />
              </ProtectedRoute>
            } />
            
            <Route path="/courses/new" element={
              <ProtectedRoute requiredRole="admin">
                <CourseForm />
              </ProtectedRoute>
            } />
            
            <Route path="/courses/edit/:id" element={
              <ProtectedRoute requiredRole="admin">
                <CourseForm />
              </ProtectedRoute>
            } />
            
            <Route path="/courses/:id/enrollments" element={
              <ProtectedRoute requiredRole="admin">
                <CourseEnrollments />
              </ProtectedRoute>
            } />
            
            <Route path="/students" element={
              <ProtectedRoute requiredRole="admin">
                <StudentList />
              </ProtectedRoute>
            } />
            
            <Route path="/students/new" element={
              <ProtectedRoute requiredRole="admin">
                <StudentForm />
              </ProtectedRoute>
            } />
            
            <Route path="/students/edit/:id" element={
              <ProtectedRoute requiredRole="admin">
                <StudentForm />
              </ProtectedRoute>
            } />
            
            <Route path="/grades/entry" element={
              <ProtectedRoute requiredRole="admin">
                <GradeEntry />
              </ProtectedRoute>
            } />
            
            <Route path="/grades/transcript" element={
              <ProtectedRoute requiredRole="admin">
                <StudentTranscript />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
