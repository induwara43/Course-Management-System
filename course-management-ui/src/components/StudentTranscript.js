import React, { useState, useEffect } from 'react';
import { gradeApi, studentApi } from '../services/api';

const StudentTranscript = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [grades, setGrades] = useState([]);
  const [gpa, setGpa] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentApi.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchStudentGrades = async (studentId) => {
    setLoading(true);
    try {
      const [gradesResponse, gpaResponse] = await Promise.all([
        gradeApi.getByStudent(studentId),
        gradeApi.getStudentGPA(studentId)
      ]);
      
      setGrades(gradesResponse.data);
      setGpa(gpaResponse.data);
    } catch (error) {
      console.error('Error fetching student grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId);
    if (studentId) {
      fetchStudentGrades(studentId);
    } else {
      setGrades([]);
      setGpa(0);
    }
  };

  const getGradeStats = () => {
    if (grades.length === 0) return { 
      total: 0, 
      passed: 0, 
      completed: 0,
      incomplete: 0, 
      totalCredits: 0, 
      creditsEarned: 0,
      creditsCompleted: 0,
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
    
    // Credits completed (PASS + COMPLETE)
    const creditsCompleted = grades
      .filter(g => g.status === 'PASS' || g.status === 'COMPLETE')
      .reduce((sum, g) => sum + g.course.credits, 0);
    
    // Quality Points (GPV × Credits for ALL courses including 0 GPV for incomplete)
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
      creditsCompleted,
      qualityPoints
    };
  };

  const getGradeColor = (score) => {
    if (score >= 70) return 'success';
    else if (score >= 60) return 'info';
    else if (score >= 50) return 'primary';
    else if (score >= 40) return 'warning';
    else if (score >= 25) return 'secondary';
    else return 'danger';
  };

  const getStatusColor = (status) => {
    if (status === 'PASS') return 'success';
    else if (status === 'COMPLETE') return 'warning';
    else return 'danger';
  };

  const getGPAClass = (gpa) => {
    if (gpa >= 3.7) return 'success';
    else if (gpa >= 3.0) return 'info';
    else if (gpa >= 2.0) return 'warning';
    else return 'danger';
  };

  const selectedStudentData = students.find(s => s.id == selectedStudent);
  const stats = getGradeStats();

  return (
    <div className="container mt-4">
      <h2>Student Academic Transcript</h2>
      
      {/* Student Selection */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5>Select Student</h5>
              <select
                className="form-control"
                value={selectedStudent}
                onChange={(e) => handleStudentSelect(e.target.value)}
              >
                <option value="">Choose Student...</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.studentId} - {student.firstName} {student.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {selectedStudentData && (
        <>
          {/* Official Transcript Header */}
          <div className="card mb-4">
            <div className="card-header bg-primary text-white text-center">
              <h3>OFFICIAL ACADEMIC TRANSCRIPT</h3>
              <p className="mb-0">University Course Management System</p>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>Student Information</h5>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><strong>Student ID:</strong></td>
                        <td>{selectedStudentData.studentId}</td>
                      </tr>
                      <tr>
                        <td><strong>Full Name:</strong></td>
                        <td>{selectedStudentData.firstName} {selectedStudentData.lastName}</td>
                      </tr>
                      <tr>
                        <td><strong>Email:</strong></td>
                        <td>{selectedStudentData.email}</td>
                      </tr>
                      <tr>
                        <td><strong>Phone:</strong></td>
                        <td>{selectedStudentData.phoneNumber || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="col-md-6">
                  <h5>Academic Summary</h5>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><strong>Total Courses:</strong></td>
                        <td>{stats.total}</td>
                      </tr>
                      <tr>
                        <td><strong>Passed:</strong></td>
                        <td><span className="text-success">{stats.passed}</span></td>
                      </tr>
                      <tr>
                        <td><strong>Completed:</strong></td>
                        <td><span className="text-warning">{stats.completed}</span></td>
                      </tr>
                      <tr>
                        <td><strong>Incomplete:</strong></td>
                        <td><span className="text-danger">{stats.incomplete}</span></td>
                      </tr>
                      <tr>
                        <td><strong>Credits Attempted:</strong></td>
                        <td><strong>{stats.totalCredits}</strong></td>
                      </tr>
                      <tr>
                        <td><strong>Credits Earned:</strong></td>
                        <td><span className="text-success"><strong>{stats.creditsEarned}</strong></span></td>
                      </tr>
                      <tr>
                        <td><strong>Total GPV:</strong></td>
                        <td><strong>{stats.qualityPoints.toFixed(2)}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* GPA Display with explanation */}
              <div className="row mt-3">
                <div className="col-12 text-center">
                  <div className="alert alert-info">
                    <h4>
                      <strong>Cumulative Grade Point Average (GPA): </strong>
                      <span className={`badge bg-${getGPAClass(gpa)} fs-4`}>
                        {gpa.toFixed(3)}
                      </span>
                    </h4>
                    <small className="text-muted">
                      GPA = {stats.qualityPoints.toFixed(2)} Total GPV ÷ {stats.totalCredits} Total Credits<br/>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Grades Table */}
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading transcript...</span>
              </div>
            </div>
          ) : grades.length === 0 ? (
            <div className="alert alert-info text-center">
              <h5>No Academic Records Found</h5>
              <p>This student has not been assigned any grades yet.</p>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <h5>Academic Record - Course Grades</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Course Code</th>
                        <th>Course Title</th>
                        <th>Credits</th>
                        {/* <th>Score (%)</th> */}
                        <th>Letter Grade</th>
                        <th>Grade Points</th>
                        <th>GPV</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map(grade => (
                        <tr key={grade.id}>
                          <td><strong>{grade.course.code}</strong></td>
                          <td>{grade.course.title}</td>
                          <td>
                            <span className="badge bg-secondary">{grade.course.credits}</span>
                          </td>
                          {/* <td>
                            <strong className={`text-${getGradeColor(grade.score)}`}>
                              {grade.score}%
                            </strong>
                          </td> */}
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
                            <strong>
                              {((grade.gradePointValue || 0) * grade.course.credits).toFixed(2)}
                            </strong>
                          </td>
                          <td>
                            <span className={`badge bg-${getStatusColor(grade.status)}`}>
                              {grade.status}
                            </span>
                          </td>
                          <td>{new Date(grade.gradeDate).toLocaleDateString()}</td>
                          <td>
                            <small className="text-muted">
                              {grade.remarks || 'No remarks'}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals Row */}
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <tbody>
                      <tr className="table-info">
                        <td><strong>TOTALS:</strong></td>
                        <td></td>
                        <td><strong>{stats.totalCredits} Credits Attempted</strong></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><strong>{stats.qualityPoints.toFixed(2)} Total GPV</strong></td>
                        <td><strong>GPA: {gpa.toFixed(3)}</strong></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Legend */}
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

                {/* Transcript Footer */}
                <div className="row mt-4">
                  <div className="col-12">
                    <hr/>
                    <div className="text-center text-muted">
                      <small>
                        <strong>End of Official Transcript</strong><br/>
                        Generated on: {new Date().toLocaleString()}<br/>
                        This transcript contains {grades.length} course records<br/>
                        Cumulative GPA: {gpa.toFixed(2)}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentTranscript;
