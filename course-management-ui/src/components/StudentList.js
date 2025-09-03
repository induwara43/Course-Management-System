import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../services/api';
import EnrollmentModal from './EnrollmentModal';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredStudents(
        students.filter(s =>
          s.studentId.toLowerCase().includes(lower) ||
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getAll();
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (err) {
      setError('Error fetching students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentApi.delete(id);
        fetchStudents();
      } catch (err) {
        setError('Error deleting student');
        console.error(err);
      }
    }
  };

  const handleEnrollmentClick = (student) => {
    setSelectedStudent(student);
    setShowEnrollmentModal(true);
  };

  if (loading) return <div className="text-center mt-4">Loading students...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>All Students</h2>
        <Link to="/students/new" className="btn btn-primary">
          Add New Student
        </Link>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by student ID or name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredStudents.length === 0 ? (
        <div className="alert alert-info">
          No students found{searchTerm && ` for "${searchTerm}"`}.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td><strong>{student.studentId}</strong></td>
                  <td>{student.firstName} {student.lastName}</td>
                  <td>{student.email}</td>
                  <td>{student.phoneNumber || 'N/A'}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link 
                        to={`/students/edit/${student.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleEnrollmentClick(student)}
                      >
                        Enrollments
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EnrollmentModal
        show={showEnrollmentModal}
        onHide={() => setShowEnrollmentModal(false)}
        student={selectedStudent}
        onEnrollmentUpdate={fetchStudents}
      />
    </div>
  );
};

export default StudentList;
