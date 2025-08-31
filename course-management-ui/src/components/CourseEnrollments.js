import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseApi } from '../services/api';

const CourseEnrollments = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
      fetchEnrolledStudents();
    }
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const response = await courseApi.getById(id);
      setCourse(response.data);
    } catch (error) {
      setError('Error fetching course details');
      console.error(error);
    }
  };

  const fetchEnrolledStudents = async () => {
    try {
      setLoading(true);
      const response = await courseApi.getStudents(id);
      setStudents(Array.from(response.data)); // Convert Set to Array
    } catch (error) {
      setError('Error fetching enrolled students');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/courses">Courses</Link>
              </li>
              <li className="breadcrumb-item active">
                {course?.code} Enrollments
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {course && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h3>{course.code} - {course.title}</h3>
                <p className="text-muted">{course.description}</p>
                <div className="row">
                  <div className="col-md-6">
                    <strong>Credits:</strong> {course.credits}
                  </div>
                  <div className="col-md-6">
                    <strong>Enrolled Students:</strong> {students.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-12">
          <h4>Enrolled Students</h4>
          
          {students.length === 0 ? (
            <div className="alert alert-info">
              No students are currently enrolled in this course.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td><strong>{student.studentId}</strong></td>
                      <td>{student.firstName} {student.lastName}</td>
                      <td>{student.email}</td>
                      <td>{student.phoneNumber || 'N/A'}</td>
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

export default CourseEnrollments;
