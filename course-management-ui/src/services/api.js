import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Course API calls
export const courseApi = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (course) => api.post('/courses', course),
  update: (id, course) => api.put(`/courses/${id}`, course),
  delete: (id) => api.delete(`/courses/${id}`),
  search: (title) => api.get(`/courses/search?title=${title}`),
  getStudents: (id) => api.get(`/courses/${id}/students`)
};

// Student API calls
export const studentApi = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (student) => api.post('/students', student),
  update: (id, student) => api.put(`/students/${id}`, student),
  delete: (id) => api.delete(`/students/${id}`),
  enroll: (studentId, courseId) => api.post(`/students/${studentId}/enroll/${courseId}`),
  unenroll: (studentId, courseId) => api.delete(`/students/${studentId}/unenroll/${courseId}`),
  getCourses: (id) => api.get(`/students/${id}/courses`)
};

// Grade API calls
export const gradeApi = {
  getAll: () => api.get('/grades'),
  getByStudent: (studentId) => api.get(`/grades/student/${studentId}`),
  getByCourse: (courseId) => api.get(`/grades/course/${courseId}`),
  getStudentGPA: (studentId) => api.get(`/grades/student/${studentId}/gpa`),
  create: (grade) => api.post('/grades', grade),
  update: (id, grade) => api.put(`/grades/${id}`, grade),
  delete: (id) => api.delete(`/grades/${id}`)
};

export default api;
