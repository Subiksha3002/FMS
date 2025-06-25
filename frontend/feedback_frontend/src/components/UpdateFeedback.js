// src/components/UpdateFeedback.js
import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

function UpdateFeedback() {
  const [employeeId, setEmployeeId] = useState('');
  const [feedbackId, setFeedbackId] = useState('');
  const [formData, setFormData] = useState({
    performance_period: '',
    feedback_type: '',
    key_strengths: '',
    areas_for_improvement: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId || !feedbackId) {
      setMessage('Employee ID and Feedback ID are required.');
      return;
    }

    try {
      await axiosInstance.put(`/fbupdate/${employeeId}/`, {
        ...formData,
        feedback_id: feedbackId
      });
      setMessage('Feedback updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      setMessage('Failed to update feedback.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2>Update Feedback</h2>
      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Employee ID:</label>
        <input
          type="number"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        /><br /><br />

        <label>Feedback ID:</label>
        <input
          type="number"
          value={feedbackId}
          onChange={(e) => setFeedbackId(e.target.value)}
          required
        /><br /><br />

        <label>Performance Period:</label>
        <input
          type="text"
          name="performance_period"
          value={formData.performance_period}
          onChange={handleChange}
        /><br /><br />

        <label>Feedback Type:</label>
        <select
          name="feedback_type"
          value={formData.feedback_type}
          onChange={handleChange}
        >
          <option value="">--Select--</option>
          <option value="positive">Positive</option>
          <option value="constructive">Constructive Feedback</option>
          <option value="recognition">Recognition</option>
          <option value="development">Development Feedback</option>
        </select><br /><br />

        <label>Key Strengths:</label>
        <select name="key_strengths" value={formData.key_strengths} onChange={handleChange} required>
        <option value="">-- Select Strength --</option>
        <option value="communication">Communication</option>
        <option value="teamwork">Teamwork</option>
        <option value="leadership">Leadership</option>
        <option value="problem_solving">Problem Solving</option>
        </select>
        <br></br>
        <br></br>

        <label>Areas for Improvement:</label>
        <select name="areas_for_improvement" value={formData.areas_for_improvement} onChange={handleChange} required>
        <option value="">-- Select Area --</option>
        <option value="communication">Communication Skills</option>
        <option value="teamwork">Teamwork and Collaboration</option>
        <option value="technical_skills">Technical Skills</option>
        <option value="time_management">Time Management</option>
        <option value="initiative">Initiative</option>
        </select><br /><br />
        
        <button type="submit">Update Feedback</button>
      </form>
    </div>
  );
}

export default UpdateFeedback;
