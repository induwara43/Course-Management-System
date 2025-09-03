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

  const getGPAClass = (gpa) => {
    if (gpa >= 3.7) return 'success';
    else if (gpa >= 3.0) return 'info';
    else if (gpa >= 2.0) return 'warning';
    else return 'danger';
  };

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
    
    const totalCredits = grades.reduce((sum, g) => sum + g.course.credits, 0);
    const creditsEarned = grades
      .filter(g => g.status === 'PASS')
      .reduce((sum, g) => sum + g.course.credits, 0);
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

  const handlePrint = () => {
    const printContent = document.getElementById('printable-content');
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const stats = getGradeStats();

  return (
    <div className="d-flex flex-column min-vh-100" style={{backgroundColor: '#f8f9fa'}}>
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

      <div className="flex-grow-1 d-flex flex-column">
        <div className="container py-4">
          <div className={`row justify-content-center ${!student ? 'min-vh-50 align-items-center' : 'mb-4'}`}>
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

          {student && (
            <>
              <div id="printable-content" className="d-none">
                <div className="p-4">
                  <div className="text-center mb-4">
                    <h2>University Course Management System</h2>
                    <h3>Academic Transcript</h3>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-header bg-dark text-white">
                          <h5 className="mb-0">Student Information</h5>
                        </div>
                        <div className="card-body">
                          <p><strong>Student ID:</strong> {student.studentId}</p>
                          <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
                          <p><strong>Email:</strong> {student.email}</p>
                          <p><strong>Date Generated:</strong> {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-header bg-dark text-white">
                          <h5 className="mb-0">Academic Summary</h5>
                        </div>
                        <div className="card-body">
                          <table className="table table-sm">
                            <tbody>
                              <tr>
                                <td><strong>Total Courses:</strong></td>
                                <td>{stats.total}</td>
                              </tr>
                              <tr>
                                <td><strong>Courses Passed:</strong></td>
                                <td>{stats.passed}</td>
                              </tr>
                              <tr>
                                <td><strong>Courses Completed:</strong></td>
                                <td>{stats.completed}</td>
                              </tr>
                              <tr>
                                <td><strong>Courses Incomplete:</strong></td>
                                <td>{stats.incomplete}</td>
                              </tr>
                              <tr>
                                <td><strong>Credits Attempted:</strong></td>
                                <td>{stats.totalCredits}</td>
                              </tr>
                              <tr>
                                <td><strong>Credits Earned:</strong></td>
                                <td>{stats.creditsEarned}</td>
                              </tr>
                              <tr>
                                <td><strong>Total GPV:</strong></td>
                                <td>{stats.qualityPoints.toFixed(2)}</td>
                              </tr>
                              <tr>
                                <td><strong>GPA:</strong></td>
                                <td>{gpa.toFixed(2)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header bg-dark text-white">
                      <h5 className="mb-0">Course Grades</h5>
                    </div>
                    <div className="card-body p-0">
                      <table className="table table-bordered mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Course Code</th>
                            <th>Course Title</th>
                            <th>Credits</th>
                            <th>Grade</th>
                            <th>GPV</th>
                            <th>Status</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grades.map(grade => (
                            <tr key={grade.id}>
                              <td>{grade.course.code}</td>
                              <td>{grade.course.title}</td>
                              <td>{grade.course.credits}</td>
                              <td>{grade.letterGrade}</td>
                              <td>{grade.gradePointValue ? grade.gradePointValue.toFixed(2) : '0.00'}</td>
                              <td>{grade.status}</td>
                              <td>{new Date(grade.gradeDate).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center text-muted">
                    <p>Official Transcript - University Course Management System</p>
                    <p>This document is generated electronically and requires no signature.</p>
                  </div>
                </div>
              </div>

              <div className="card shadow-lg mb-4 border-0">
                <div className="card-header bg-success text-white">
                  <h4 className="mb-0">
                    <i className="fas fa-user-graduate me-2"></i>
                    Student Information & Academic Summary
                  </h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h5 className="mb-3">
                        <i className="fas fa-id-card me-2"></i>Personal Information
                      </h5>
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td className="fw-bold">Student ID:</td>
                            <td>{student.studentId}</td>
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
                      <h5 className="mb-3">
                        <i className="fas fa-chart-bar me-2"></i>Academic Summary
                      </h5>
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td className="fw-bold">Total Courses:</td>
                            <td>{stats.total}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Courses Passed:</td>
                            <td>{stats.passed}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Courses Completed:</td>
                            <td>{stats.completed}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Courses Incomplete:</td>
                            <td>{stats.incomplete}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Credits Attempted:</td>
                            <td>{stats.totalCredits}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Credits Earned:</td>
                            <td>
                              {stats.creditsEarned}
                              <span className="text-muted">/{stats.totalCredits}</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Total GPV:</td>
                            <td>{stats.qualityPoints.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">GPA:</td>
                            <td>
                              <span className="fw-bold">
                                {gpa.toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      
                    </div>
                  </div>
                </div>
              </div>
              
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
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-dark">
                          <tr>
                            <th>Course Code</th>
                            <th>Course Title</th>
                            <th>Credits</th>
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
                              <td>{grade.course.credits}</td>
                              <td>{grade.letterGrade}</td>
                              <td>
                                {grade.gradePointValue ? grade.gradePointValue.toFixed(2) : '0.00'}
                              </td>
                              <td>
                                <span className={`badge ${grade.status === 'PASS' ? 'bg-success' : 
                                                grade.status === 'COMPLETE' ? 'bg-warning' : 'bg-danger'}`}>
                                  <i className={`fas ${grade.status === 'PASS' ? 'fa-check' : 
                                              grade.status === 'COMPLETE' ? 'fa-exclamation' : 'fa-times'} me-1`}></i>
                                  {grade.status}
                                </span>
                              </td>
                              <td>{new Date(grade.gradeDate).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-3 bg-light border-top">
                      <div className="text-center">
                        <button 
                          className="btn btn-outline-success"
                          onClick={handlePrint}
                        >
                          <i className="fas fa-print me-2"></i>
                          Print Transcript
                        </button>
                      </div>
                    </div>
                    
                  </div>
                  
                </div>
                
                
              )}
              <div className="row mt-4">
      <div className="col-12">
        <h6>Grading Scale & GPA Calculation:</h6>
        <div className="row">
          <div className="col-md-6">
            <small>
              <span className="badge bg-success me-1">PASS</span> C and above (40+ marks)<br/>
              <span className="badge bg-warning me-1">COMPLETE</span> D+/D/C- (25-39 marks)<br/>
              <span className="badge bg-danger me-1">INCOMPLETE</span> E (0-24 marks)<br/>
            </small>
          </div>
          <div className="col-md-6">
            <small>
              <strong>GPA Calculation:</strong><br/>
              Total GPV = GPV × Credits For GPA<br/>
              Final GPA = Total GPV ÷ Total Credits Attempted<br/>
            </small>
          </div>
        </div>
      </div>
    </div>
            </>
          )}
        </div>
      </div>
    
 
      <footer className="bg-dark text-white text-center py-3 mt-auto">
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