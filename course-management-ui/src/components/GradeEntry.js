import React, { useState, useEffect } from 'react';
import { gradeApi, studentApi, courseApi } from '../services/api';

const GradeEntry = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [gradeForm, setGradeForm] = useState({
    score: '',
    remarks: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseApi.getAll();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchEnrolledStudents = async (courseId) => {
    if (!courseId) {
      setEnrolledStudents([]);
      return;
    }

    setFetchingStudents(true);
    try {
      const response = await courseApi.getStudents(courseId);
      const studentsArray = Array.isArray(response.data) 
        ? response.data 
        : Array.from(response.data);
      setEnrolledStudents(studentsArray);
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
      setEnrolledStudents([]);
    } finally {
      setFetchingStudents(false);
    }
  };

  const fetchGradesByCourse = async (courseId) => {
    try {
      const response = await gradeApi.getByCourse(courseId);
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
      setGrades([]);
    }
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId);
    setSelectedStudent('');
    setGradeForm({ score: '', remarks: '' });
    
    if (courseId) {
      fetchEnrolledStudents(courseId);
      fetchGradesByCourse(courseId);
    } else {
      setEnrolledStudents([]);
      setGrades([]);
    }
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId);
    
    const existingGrade = grades.find(
      grade => grade.student.id.toString() === studentId.toString()
    );
    
    if (existingGrade) {
      if (window.confirm(
        `This student already has a grade (${existingGrade.score}% - ${existingGrade.letterGrade}) for this course. Do you want to update it?`
      )) {
        setGradeForm({
          score: existingGrade.score.toString(),
          remarks: existingGrade.remarks || ''
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedCourse || !gradeForm.score) {
      alert('Please fill all required fields');
      return;
    }

    if (gradeForm.score < 0 || gradeForm.score > 100) {
      alert('Score must be between 0 and 100');
      return;
    }

    setLoading(true);
    try {
      const gradeData = {
        studentId: parseInt(selectedStudent),
        courseId: parseInt(selectedCourse),
        score: parseFloat(gradeForm.score),
        remarks: gradeForm.remarks
      };

      await gradeApi.create(gradeData);
      
      setSelectedStudent('');
      setGradeForm({ score: '', remarks: '' });
      
      fetchGradesByCourse(selectedCourse);
      
      alert('Grade added/updated successfully!');
    } catch (error) {
      console.error('Error adding grade:', error);
      alert('Error adding grade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getLetterGrade = (score) => {
    if (score >= 85) return 'A+';
    else if (score >= 70) return 'A';
    else if (score >= 65) return 'A-';
    else if (score >= 60) return 'B+';
    else if (score >= 55) return 'B';
    else if (score >= 50) return 'B-';
    else if (score >= 45) return 'C+';
    else if (score >= 40) return 'C';
    else if (score >= 35) return 'C-';
    else if (score >= 30) return 'D+';
    else if (score >= 25) return 'D';
    else return 'E';
  };

  const getGradeColor = (score) => {
    if (score >= 70) return 'success';
    else if (score >= 60) return 'info';
    else if (score >= 50) return 'primary';
    else if (score >= 40) return 'warning';
    else if (score >= 25) return 'secondary';
    else return 'danger';
  };

  const getGPV = (score) => {
    if (score >= 85) return 4.00;
    else if (score >= 70) return 4.00;
    else if (score >= 65) return 3.70;
    else if (score >= 60) return 3.30;
    else if (score >= 55) return 3.00;
    else if (score >= 50) return 2.70;
    else if (score >= 45) return 2.30;
    else if (score >= 40) return 2.00;
    else if (score >= 35) return 1.70;
    else if (score >= 30) return 1.30;
    else if (score >= 25) return 1.00;
    else return 0.00;
  };

  const getStatus = (score) => {
    if (score >= 40) return 'PASS';
    else if (score >= 25) return 'COMPLETE';
    else return 'INCOMPLETE';
  };

  const getStatusColor = (score) => {
    if (score >= 40) return 'success';      // PASS
    else if (score >= 25) return 'warning'; // COMPLETE
    else return 'danger';                   // INCOMPLETE
  };

  const isStudentAlreadyGraded = (studentId) => {
    return grades.some(grade => grade.student.id.toString() === studentId.toString());
  };

  return (
    <div className="container mt-4">
      <h2>Grade Entry System</h2>
      
      {/* Grade Entry Form */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4>Add New Grade</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Course Selection */}
                <div className="mb-3">
                  <label className="form-label">Select Course *</label>
                  <select
                    className="form-control"
                    value={selectedCourse}
                    onChange={(e) => handleCourseSelect(e.target.value)}
                    required
                  >
                    <option value="">Choose Course First...</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.title} ({course.credits} credits)
                      </option>
                    ))}
                  </select>
                  <small className="text-muted">
                    Select a course to see enrolled students
                  </small>
                </div>

                {/* Student Selection */}
                <div className="mb-3">
                  <label className="form-label">Select Student *</label>
                  <select
                    className={`form-control ${!selectedCourse ? 'bg-light' : ''}`}
                    value={selectedStudent}
                    onChange={(e) => handleStudentSelect(e.target.value)}
                    disabled={!selectedCourse}
                    required
                  >
                    <option value="">
                      {!selectedCourse 
                        ? 'Select a course first' 
                        : fetchingStudents 
                          ? 'Loading students...' 
                          : enrolledStudents.length === 0 
                            ? 'No students enrolled in this course'
                            : 'Choose Student...'
                      }
                    </option>
                    {enrolledStudents.map(student => (
                      <option 
                        key={student.id} 
                        value={student.id}
                        className={isStudentAlreadyGraded(student.id) ? 'text-warning' : ''}
                      >
                        {student.studentId} - {student.firstName} {student.lastName}
                        {isStudentAlreadyGraded(student.id) ? ' (Already Graded)' : ''}
                      </option>
                    ))}
                  </select>
                  <small className="text-muted">
                    {selectedCourse && enrolledStudents.length > 0 
                      ? `${enrolledStudents.length} student(s) enrolled in this course`
                      : selectedCourse && enrolledStudents.length === 0
                        ? 'No students are enrolled in this course'
                        : 'Students will appear after selecting a course'
                    }
                  </small>
                </div>

                {/* Score Input */}
                <div className="mb-3">
                  <label className="form-label">Score (0-100) *</label>
                  <input
                    type="number"
                    className={`form-control ${!selectedStudent ? 'bg-light' : ''}`}
                    min="0"
                    max="100"
                    step="0.1"
                    value={gradeForm.score}
                    onChange={(e) => setGradeForm({...gradeForm, score: e.target.value})}
                    disabled={!selectedStudent}
                    required
                  />
                  <small className="text-muted">
                    {!selectedStudent ? 'Select a student first' : 'Enter score between 0 and 100'}
                  </small>
                </div>

                {/* Remarks */}
                <div className="mb-3">
                  <label className="form-label">Remarks</label>
                  <textarea
                    className={`form-control ${!selectedStudent ? 'bg-light' : ''}`}
                    rows="3"
                    value={gradeForm.remarks}
                    onChange={(e) => setGradeForm({...gradeForm, remarks: e.target.value})}
                    disabled={!selectedStudent}
                    placeholder={!selectedStudent ? 'Select a student first' : 'Optional remarks about the grade'}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading || !selectedCourse || !selectedStudent || !gradeForm.score}
                >
                  {loading ? 'Adding Grade...' : 'Add/Update Grade'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Grade Preview */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4>Grade Preview</h4>
            </div>
            <div className="card-body">
              {selectedCourse && (
                <div className="mb-3">
                  <h6>Selected Course:</h6>
                  <div className="alert alert-secondary">
                    <strong>{courses.find(c => c.id == selectedCourse)?.code}</strong> - 
                    {courses.find(c => c.id == selectedCourse)?.title}
                    <br/>
                    <small>
                      Credits: {courses.find(c => c.id == selectedCourse)?.credits} | 
                      Enrolled Students: {enrolledStudents.length}
                    </small>
                  </div>
                </div>
              )}

              {selectedStudent && (
                <div className="mb-3">
                  <h6>Selected Student:</h6>
                  <div className="alert alert-info">
                    {(() => {
                      const student = enrolledStudents.find(s => s.id == selectedStudent);
                      return student ? (
                        <>
                          <strong>{student.studentId}</strong> - {student.firstName} {student.lastName}
                          <br/>
                          <small>{student.email}</small>
                        </>
                      ) : 'Student not found';
                    })()}
                  </div>
                </div>
              )}

              {gradeForm.score && (
                <div className="alert alert-success">
                  <h6>Grade Calculation:</h6>
                  <p><strong>Score:</strong> {gradeForm.score}%</p>
                  <p><strong>Letter Grade:</strong> 
                    <span className={`badge bg-${getGradeColor(parseFloat(gradeForm.score))} ms-2`}>
                      {getLetterGrade(parseFloat(gradeForm.score))}
                    </span>
                  </p>
                  <p><strong>Grade Point Value:</strong> 
                    <span className="badge bg-info ms-2">
                      {getGPV(parseFloat(gradeForm.score)).toFixed(2)}
                    </span>
                  </p>
                  <p><strong>Status:</strong> 
                    <span className={`badge bg-${getStatusColor(parseFloat(gradeForm.score))} ms-2`}>
                      {getStatus(parseFloat(gradeForm.score))}
                    </span>
                  </p>
                </div>
              )}
              
              {/* Updated Grading Scale Reference */}
              <div className="mt-3">
                <h6>University Grading Scale:</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>Range</th>
                        <th>Grade</th>
                        <th>GPV</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>85-100</td><td><span className="badge bg-success">A+</span></td><td>4.00</td><td><span className="badge bg-success">PASS</span></td></tr>
                      <tr><td>70-84</td><td><span className="badge bg-success">A</span></td><td>4.00</td><td><span className="badge bg-success">PASS</span></td></tr>
                      <tr><td>65-69</td><td><span className="badge bg-info">A-</span></td><td>3.70</td><td><span className="badge bg-success">PASS</span></td></tr>
                      <tr><td>60-64</td><td><span className="badge bg-info">B+</span></td><td>3.30</td><td><span className="badge bg-success">PASS</span></td></tr>
                      <tr><td>55-59</td><td><span className="badge bg-primary">B</span></td><td>3.00</td><td><span className="badge bg-success">PASS</span></td></tr>
                      <tr><td>50-54</td><td><span className="badge bg-primary">B-</span></td><td>2.70</td><td><span className="badge bg-success">PASS</span></td></tr>
                      <tr><td>45-49</td><td><span className="badge bg-warning">C+</span></td><td>2.30</td><td><span className="badge bg-success">PASS</span></td></tr>
                      <tr><td>40-44</td><td><span className="badge bg-warning">C</span></td><td>2.00</td><td><span className="badge bg-success">PASS</span></td></tr>
                      <tr><td>35-39</td><td><span className="badge bg-secondary">C-</span></td><td>1.70</td><td><span className="badge bg-warning">COMPLETE</span></td></tr>
                      <tr><td>30-34</td><td><span className="badge bg-secondary">D+</span></td><td>1.30</td><td><span className="badge bg-warning">COMPLETE</span></td></tr>
                      <tr><td>25-29</td><td><span className="badge bg-secondary">D</span></td><td>1.00</td><td><span className="badge bg-warning">COMPLETE</span></td></tr>
                      <tr><td>0-24</td><td><span className="badge bg-danger">E</span></td><td>0.00</td><td><span className="badge bg-danger">INCOMPLETE</span></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grades Display */}
      {selectedCourse && (
        <div className="card">
          <div className="card-header">
            <h4>
              Grades for: {courses.find(c => c.id == selectedCourse)?.code} - 
              {courses.find(c => c.id == selectedCourse)?.title}
            </h4>
          </div>
          <div className="card-body">
            {grades.length === 0 ? (
              <div className="alert alert-info">No grades recorded for this course yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Student ID</th>
                      <th>Student Name</th>
                      <th>Score</th>
                      <th>Letter Grade</th>
                      <th>GPV</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map(grade => (
                      <tr key={grade.id}>
                        <td>{grade.student.studentId}</td>
                        <td>{grade.student.firstName} {grade.student.lastName}</td>
                        <td><strong>{grade.score}%</strong></td>
                        <td>
                          <span className={`badge bg-${getGradeColor(grade.score)}`}>
                            {grade.letterGrade}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-info">
                            {grade.gradePointValue ? grade.gradePointValue.toFixed(2) : getGPV(grade.score).toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${getStatusColor(grade.score)}`}>
                            {grade.status}
                          </span>
                        </td>
                        <td>{new Date(grade.gradeDate).toLocaleDateString()}</td>
                        <td>{grade.remarks || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeEntry;
