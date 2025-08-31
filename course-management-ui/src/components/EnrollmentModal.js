import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { courseApi, studentApi } from '../services/api';

const EnrollmentModal = ({ show, onHide, student, onEnrollmentUpdate }) => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await courseApi.getAll();
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  }, []);

  const fetchStudentCourses = useCallback(async () => {
    if (!student?.id) return;
    
    try {
      const response = await studentApi.getCourses(student.id);
      setEnrolledCourses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching student courses:', error);
      setEnrolledCourses([]);
    }
  }, [student?.id]);

  useEffect(() => {
    if (show && student) {
      fetchCourses();
      fetchStudentCourses();
    }
  }, [show, student, fetchCourses, fetchStudentCourses]);

  const handleEnroll = async (courseId) => {
    setLoading(true);
    try {
      await studentApi.enroll(student.id, courseId);
      await fetchStudentCourses(); // Refresh enrolled courses
      if (onEnrollmentUpdate) {
        onEnrollmentUpdate(); // Notify parent component
      }
    } catch (error) {
      console.error('Error enrolling student:', error);
      alert('Error enrolling in course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (courseId) => {
    setLoading(true);
    try {
      await studentApi.unenroll(student.id, courseId);
      await fetchStudentCourses(); // Refresh enrolled courses
      if (onEnrollmentUpdate) {
        onEnrollmentUpdate(); // Notify parent component
      }
    } catch (error) {
      console.error('Error unenrolling student:', error);
      alert('Error unenrolling from course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(course => course.id === courseId);
  };

  const getTotalCredits = () => {
    return enrolledCourses.reduce((total, course) => total + (course.credits || 0), 0);
  };

  if (!student) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Manage Enrollments - {student.firstName} {student.lastName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <h5>Current Enrollment Summary</h5>
          <div className="alert alert-info">
            <strong>Enrolled Courses:</strong> {enrolledCourses.length} | 
            <strong> Total Credits:</strong> {getTotalCredits()}
          </div>
        </div>

        <h5>Available Courses</h5>
        {courses.length === 0 ? (
          <div className="alert alert-warning">No courses available.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Title</th>
                  <th>Credits</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id}>
                    <td><strong>{course.code}</strong></td>
                    <td>{course.title}</td>
                    <td>
                      <span className="badge bg-secondary">{course.credits}</span>
                    </td>
                    <td>
                      {isEnrolled(course.id) ? (
                        <span className="badge bg-success">Enrolled</span>
                      ) : (
                        <span className="badge bg-light text-dark">Available</span>
                      )}
                    </td>
                    <td>
                      {isEnrolled(course.id) ? (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleUnenroll(course.id)}
                          disabled={loading}
                        >
                          {loading ? 'Processing...' : 'Unenroll'}
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEnroll(course.id)}
                          disabled={loading}
                        >
                          {loading ? 'Processing...' : 'Enroll'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {enrolledCourses.length > 0 && (
          <div className="mt-4">
            <h5>Currently Enrolled Courses</h5>
            <div className="list-group">
              {enrolledCourses.map(course => (
                <div key={course.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{course.code}</strong> - {course.title}
                    <br />
                    <small className="text-muted">{course.description || 'No description'}</small>
                  </div>
                  <span className="badge bg-primary rounded-pill">
                    {course.credits || 0} credits
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EnrollmentModal;
