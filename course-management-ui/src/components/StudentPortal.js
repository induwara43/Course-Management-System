import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { studentApi, gradeApi } from '../services/api';

const StudentPortal = () => {
  const [studentId, setStudentId] = useState('');
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [gpa, setGpa] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!studentId.trim()) {
      setError('Please enter your Student ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const studentsResponse = await studentApi.getAll();
      const foundStudent = studentsResponse.data.find(
        s => s.studentId.toLowerCase() === studentId.trim().toLowerCase()
      );

      if (!foundStudent) {
        setError(`No student found with ID: ${studentId}. Please check your Student ID and try again.`);
        setStudent(null);
        setGrades([]);
        setGpa(0);
        return;
      }

      const [gradesResponse, gpaResponse] = await Promise.all([
        gradeApi.getByStudent(foundStudent.id),
        gradeApi.getStudentGPA(foundStudent.id)
      ]);

      setStudent(foundStudent);
      setGrades(gradesResponse.data);
      setGpa(gpaResponse.data);
      setError('');

    } catch (err) {
      console.error('Error searching student:', err);
      setError('Error searching for student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStudentId('');
    setStudent(null);
    setGrades([]);
    setGpa(0);
    setError('');
  };

  const getGradeColor = (score) => {
    if (score >= 70) return 'success';
    else if (score >= 60) return 'info';
    else if (score >= 50) return 'primary';
    else if (score >= 40) return 'warning';
    else if (score >= 25) return 'secondary';
    else return 'danger';
  };

  const getGPAClass = (gpa) => {
    if (gpa >= 3.7) return 'success';
    else if (gpa >= 3.0) return 'info';
    else if (gpa >= 2.0) return 'warning';
    else return 'danger';
  };

  // In StudentPortal.js, update the getGradeStats function:

// Update the getGradeStats function in StudentPortal.js

const getGradeStats = () => {
  if (grades.length === 0) return { 
    total: 0, 
    passed: 0, 
    completed: 0, 
    incomplete: 0, 
    totalCredits: 0, 
    creditsEarned: 0,
    qualityPoints: 0
  };
  
  const passed = grades.filter(g => g.status === 'PASS').length;
  const completed = grades.filter(g => g.status === 'COMPLETE').length;
  const incomplete = grades.filter(g => g.status === 'INCOMPLETE').length;
  
  // ALL credits attempted (including incomplete)
  const totalCredits = grades.reduce((sum, g) => sum + g.course.credits, 0);
  
  // Credits earned (PASS only)
  const creditsEarned = grades
    .filter(g => g.status === 'PASS')
    .reduce((sum, g) => sum + g.course.credits, 0);
  
  // Quality Points (ALL courses including incomplete with 0 GPV)
  const qualityPoints = grades.reduce((sum, g) => {
    const gpv = g.gradePointValue || 0;
    return sum + (gpv * g.course.credits);
  }, 0);
  
  return { 
    total: grades.length, 
    passed, 
    completed, 
    incomplete, 
    totalCredits, 
    creditsEarned,
    qualityPoints
  };
};


// And update the status display function:
const getStatusColor = (status) => {
  if (status === 'PASS') return 'success';
  else if (status === 'COMPLETE') return 'warning';
  else return 'danger';
};


  const stats = getGradeStats();

  return (
    <div className="min-vh-100" style={{backgroundColor: '#f8f9fa'}}>
      {/* Single Header Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow">
        <div className="container">
          <span className="navbar-brand">
            <i className="fas fa-graduation-cap me-2"></i>
            Student Academic Portal
          </span>
          <div className="navbar-nav ms-auto">
            <Link to="/" className="btn btn-outline-light">
              <i className="fas fa-arrow-left me-1"></i>
              Back to Login
            </Link>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {/* Student ID Search */}
        <div className="row justify-content-center mb-4">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-success text-white text-center py-3">
                <h4 className="mb-0">
                  <i className="fas fa-search me-2"></i>
                  Enter Your Student ID
                </h4>
                <small className="opacity-75">Access your academic records instantly</small>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSearch}>
                  <div className="mb-3">
                    <label htmlFor="studentId" className="form-label fw-bold">Student ID</label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-id-badge text-success"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="studentId"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="Enter your Student ID (e.g., STU001)"
                        required
                      />
                    </div>
                    <div className="form-text">
                      <i className="fas fa-info-circle me-1"></i>
                      Your Student ID can be found on your student card or enrollment documents
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Searching...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-search me-2"></i>
                          View My Academic Results
                        </>
                      )}
                    </button>
                    
                    {student && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleReset}
                      >
                        <i className="fas fa-redo me-1"></i>
                        Search Different Student ID
                      </button>
                    )}
                  </div>
                </form>

                {error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Student Results Display */}
        {student && (
          <>
            {/* Student Info Card */}
            <div className="card shadow-lg mb-4 border-0">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">
                  <i className="fas fa-user-graduate me-2"></i>
                  Student Information & Academic Summary
                </h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="text-primary mb-3">
                      <i className="fas fa-id-card me-2"></i>Personal Information
                    </h5>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td className="fw-bold">Student ID:</td>
                          <td>
                            <span className="badge bg-primary fs-6">{student.studentId}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Full Name:</td>
                          <td>{student.firstName} {student.lastName}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Email:</td>
                          <td>
                            <a href={`mailto:${student.email}`} className="text-decoration-none">
                              {student.email}
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Phone:</td>
                          <td>{student.phoneNumber || 'Not provided'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="col-md-6">
                    <h5 className="text-success mb-3">
                      <i className="fas fa-chart-bar me-2"></i>Academic Summary
                    </h5>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td className="fw-bold">Total Courses:</td>
                          <td>
                            <span className="badge bg-info fs-6">{stats.total}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Courses Passed:</td>
                          <td>
                            <span className="badge bg-success fs-6">{stats.passed}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Courses Failed:</td>
                          <td>
                            <span className="badge bg-danger fs-6">{stats.failed}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Credits Earned:</td>
                          <td>
                            <span className="text-success fw-bold">{stats.creditsEarned}</span>
                            <span className="text-muted">/{stats.totalCredits}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* GPA Display */}
                <div className="row mt-4">
                  <div className="col-12 text-center">
                    <div className="p-4 bg-light rounded-3">
                      <h3 className="mb-3">
                        <i className="fas fa-trophy me-2 text-warning"></i>
                        Your Current GPA
                      </h3>
                      <h1 className={`display-4 fw-bold text-${getGPAClass(gpa)}`}>
                        {gpa.toFixed(2)}
                      </h1>
                      <p className="text-muted mb-0">
                        Grade Point Average (on a 4.0 scale)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grades Table */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading transcript...</span>
                </div>
                <p className="mt-2 text-muted">Loading your academic records...</p>
              </div>
            ) : grades.length === 0 ? (
              <div className="alert alert-info text-center py-4">
                <i className="fas fa-info-circle fa-2x text-info mb-3"></i>
                <h5>No Academic Records Found</h5>
                <p className="mb-0">You don't have any grades recorded yet. Please contact your academic advisor for more information.</p>
              </div>
            ) : (
              <div className="card shadow-lg border-0">
                <div className="card-header bg-warning text-dark">
                  <h4 className="mb-0">
                    <i className="fas fa-certificate me-2"></i>
                    Your Academic Results
                  </h4>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-dark">
                        <tr>
                          <th className="py-3">Course Code</th>
                          <th>Course Title</th>
                          <th>Credits</th>
                          <th>Score</th>
                          <th>Grade</th>
                          <th>GPV</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grades.map(grade => (
                          <tr key={grade.id}>
                            <td className="fw-bold">{grade.course.code}</td>
                            <td>{grade.course.title}</td>
                            <td>
                              <span className="badge bg-secondary">{grade.course.credits}</span>
                            </td>
                            <td>
                              <strong className={`text-${getGradeColor(grade.score)}`}>
                                {grade.score}%
                              </strong>
                            </td>
                            <td>
                              <span className={`badge bg-${getGradeColor(grade.score)}`}>
                                {grade.letterGrade}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-info">
                                {grade.gradePointValue ? grade.gradePointValue.toFixed(2) : '0.00'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${grade.status === 'PASS' ? 'bg-success' : 'bg-danger'}`}>
                                <i className={`fas ${grade.status === 'PASS' ? 'fa-check' : 'fa-times'} me-1`}></i>
                                {grade.status}
                              </span>
                            </td>
                            <td>{new Date(grade.gradeDate).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Print Button */}
                  <div className="p-3 bg-light border-top">
                    <div className="text-center">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => window.print()}
                      >
                        <i className="fas fa-print me-2"></i>
                        Print Official Transcript
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <div className="container">
          <small>
            <i className="fas fa-university me-2"></i>
            University Course Management System - Academic Year 2025
          </small>
        </div>
      </footer>
    </div>
  );
};

export default StudentPortal;
