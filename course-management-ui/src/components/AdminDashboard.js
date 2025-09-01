import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseApi, studentApi } from '../services/api';

const getGradeColor = (score) => {
  if (score >= 40) return 'success';
  if (score >= 25) return 'warning';
  return 'danger';
};

const getStatusColor = (status) => {
  if (status === 'PASS') return 'success';
  if (status === 'COMPLETE') return 'warning';
  return 'danger';
};


const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0
  });
  const [recentGrades, setRecentGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, studentsRes, gradesRes] = await Promise.all([
        courseApi.getAll(),
        studentApi.getAll(),
        import('../services/api').then(api => api.gradeApi.getAll())
      ]);

      setStats({
        totalCourses: coursesRes.data.length,
        totalStudents: studentsRes.data.length
      });

      
      const sortedGrades = gradesRes.data
        .sort((a, b) => new Date(b.gradeDate) - new Date(a.gradeDate))
        .slice(0, 5);
      
      setRecentGrades(sortedGrades);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-tachometer-alt me-2"></i>Admin Dashboard</h2>
      </div>

      
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{stats.totalCourses}</h4>
                  <p className="mb-0">Total Courses</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-book fa-2x"></i>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <Link to="/courses" className="text-white text-decoration-none">
                <small><i className="fas fa-arrow-right me-1"></i>Manage Courses</small>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{stats.totalStudents}</h4>
                  <p className="mb-0">Total Students</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-users fa-2x"></i>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <Link to="/students" className="text-white text-decoration-none">
                <small><i className="fas fa-arrow-right me-1"></i>Manage Students</small>
              </Link>
            </div>
          </div>
        </div>
      </div>

      
      <div className="row mb-4">
        <div className="col-12">
          <h5>Quick Actions</h5>
          <div className="row">
            <div className="col-lg-3 col-md-6 mb-2">
              <Link to="/courses/new" className="btn btn-outline-primary w-100">
                <i className="fas fa-plus me-1"></i>Add Course
              </Link>
            </div>
            <div className="col-lg-3 col-md-6 mb-2">
              <Link to="/students/new" className="btn btn-outline-success w-100">
                <i className="fas fa-user-plus me-1"></i>Add Student
              </Link>
            </div>
            <div className="col-lg-3 col-md-6 mb-2">
              <Link to="/grades/entry" className="btn btn-outline-info w-100">
                <i className="fas fa-edit me-1"></i>Enter Grades
              </Link>
            </div>
            <div className="col-lg-3 col-md-6 mb-2">
              <Link to="/grades/transcript" className="btn btn-outline-warning w-100">
                <i className="fas fa-file-alt me-1"></i>View Transcript
              </Link>
            </div>
          </div>
        </div>
      </div>

  
      <div className="row">
        <div className="col-12">
          <h5>Recent Grade Entries</h5>
          {recentGrades.length === 0 ? (
            <p className="text-muted">No recent grade entries found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Score</th>
                    <th>Grade</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentGrades.map(grade => (
                    <tr key={grade.id}>
                      <td>
                        {grade.student.firstName} {grade.student.lastName}
                        <br/>
                        <small className="text-muted">{grade.student.studentId}</small>
                      </td>
                      <td>
                        <strong>{grade.course.code}</strong>
                        <br/>
                        <small className="text-muted">{grade.course.title}</small>
                      </td>
                      <td><strong>{grade.score}%</strong></td>
                      <td>
  <span className={`badge bg-${getGradeColor(grade.score)}`}>
    {grade.letterGrade}
  </span>
</td>
<td>
  <span className={`badge bg-${getStatusColor(grade.status)}`}>
    {grade.status}
  </span>
</td>

                      <td>{new Date(grade.gradeDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
