import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { courseApi } from '../services/api';

const CourseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For editing existing course
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    credits: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load course data if editing
  useEffect(() => {
    if (isEdit) {
      fetchCourse();
    }
  }, [id, isEdit]);

  const fetchCourse = async () => {
    try {
      const response = await courseApi.getById(id);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'code') {
      newValue = value.toUpperCase();
    }
   
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Course code is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }

    if (!formData.credits || formData.credits < 1 || formData.credits > 6) {
      newErrors.credits = 'Credits must be between 1 and 6';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await courseApi.update(id, formData);
      } else {
        await courseApi.create(formData);
      }
      
      // Navigate back to courses list
      navigate('/courses');
    } catch (error) {
      console.error('Error saving course:', error);
      setErrors({ submit: 'Error saving course. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>{isEdit ? 'Edit Course' : 'Add New Course'}</h3>
            </div>
            <div className="card-body">
              {errors.submit && (
                <div className="alert alert-danger">{errors.submit}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="code" className="form-label">Course Code *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="e.g., CS101"
                  />
                  {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Course Title *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Introduction to Computer Science"
                  />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Course description (optional)"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="credits" className="form-label">Credits *</label>
                  <select
                    className={`form-control ${errors.credits ? 'is-invalid' : ''}`}
                    id="credits"
                    name="credits"
                    value={formData.credits}
                    onChange={handleChange}
                  >
                    <option value="">Select Credits</option>
                    <option value="1">1 Credit</option>
                    <option value="2">2 Credits</option>
                    <option value="3">3 Credits</option>
                    <option value="4">4 Credits</option>
                    <option value="5">5 Credits</option>
                    <option value="6">6 Credits</option>
                  </select>
                  {errors.credits && <div className="invalid-feedback">{errors.credits}</div>}
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/courses')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (isEdit ? 'Update Course' : 'Create Course')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
