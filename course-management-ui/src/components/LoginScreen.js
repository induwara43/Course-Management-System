import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const LoginScreen = () => {
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!loginForm.username || !loginForm.password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = loginAdmin(loginForm.username, loginForm.password);
      
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left Side - Admin Login */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-primary">
          <div className="card shadow-lg" style={{width: '400px'}}>
            <div className="card-header bg-dark text-white text-center">
              <h3><i className="fas fa-user-shield"></i> Admin Login</h3>
              <p className="mb-0">Course Management System</p>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    <i className="fas fa-user"></i> Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={loginForm.username}
                    onChange={handleChange}
                    placeholder="Enter admin username"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <i className="fas fa-lock"></i> Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleChange}
                    placeholder="Enter admin password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt"></i> Login as Admin
                    </>
                  )}
                </button>
              </form>

              <div className="mt-3 text-center">
                <small className="text-muted">
                  <strong>Demo Credentials:</strong><br/>
                  Username: admin<br/>
                  Password: admin123
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Student Portal */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
          <div className="card shadow-lg" style={{width: '400px'}}>
            <div className="card-header bg-success text-white text-center">
              <h3><i className="fas fa-graduation-cap"></i> Student Portal</h3>
              <p className="mb-0">View Your Academic Records</p>
            </div>
            <div className="card-body text-center">
              <div className="mb-4">
                <i className="fas fa-file-alt fa-4x text-success mb-3"></i>
                <h5>Access Your Transcript</h5>
                <p className="text-muted">
                  View your grades, GPA, and academic progress.
                  Enter your Student ID to get started.
                </p>
              </div>

              <button
                className="btn btn-success btn-lg w-100"
                onClick={() => navigate('/student/portal')}
              >
                <i className="fas fa-arrow-right"></i> Enter Student Portal
              </button>

              <div className="mt-4">
                <small className="text-muted">
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="position-fixed bottom-0 start-0 end-0 bg-dark text-white text-center py-2">
        <small>
          <i className="fas fa-university"></i> University Course Management System - 
          Academic Year 2025
        </small>
      </div>
    </div>
  );
};

export default LoginScreen;
