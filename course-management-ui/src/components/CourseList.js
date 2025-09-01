import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../services/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredCourses(
        courses.filter(c =>
          c.code.toLowerCase().includes(lower) ||
          c.title.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchTerm, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseApi.getAll();
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (err) {
      setError('Error fetching courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseApi.delete(id);
        fetchCourses();
      } catch (err) {
        setError('Error deleting course');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="text-center mt-4">Loading courses...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>All Courses</h2>
        <Link to="/courses/new" className="btn btn-primary">
          Add New Course
        </Link>
      </div>

      
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by course code or title..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredCourses.length === 0 ? (
        <div className="alert alert-info">
          No courses found{searchTerm && ` for "${searchTerm}"`}.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Course Code</th>
                <th>Title</th>
                <th>Description</th>
                <th>Credits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map(course => (
                <tr key={course.id}>
                  <td><strong>{course.code}</strong></td>
                  <td>{course.title}</td>
                  <td>{course.description || 'No description'}</td>
                  <td>
                    <span className="badge bg-secondary">{course.credits}</span>
                  </td>
                  <td>
                    <Link
                      to={`/courses/edit/${course.id}`}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/courses/${course.id}/enrollments`}
                      className="btn btn-sm btn-outline-info me-2"
                    >
                      Enrollments
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(course.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseList;
