import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';


function FeedbackForm() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee_name: '',
    performance_period: '',
    feedback_type: '',
    key_strengths: '',
    areas_for_improvement: '',
  });
  const [message, setMessage] = useState('');

  // Fetch employees
  useEffect(() => {
    axiosInstance.get('userview/')
      .then(res => {
        if (Array.isArray(res.data)) {
          setEmployees(res.data);
        }
      })
      .catch(err => {
        console.error('Failed to load employees:', err);
      });
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);  // Debug print

    try {
      const res = await axiosInstance.post('/givefb/', formData);
      setMessage(res.data.message || 'Feedback submitted successfully!');
    } catch (err) {
      console.error('Feedback error:', err);
      if (err.response?.data) {
        console.error('Backend says:', err.response.data);
        setMessage(`Error: ${JSON.stringify(err.response.data)}`);
      } else {
        setMessage('Failed to submit feedback.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Submit Feedback</h2>

      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Employee:</label>
        <select name="employee_name" value={formData.employee_name} onChange={handleChange} required>
          <option value="">-- Select Employee --</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.username}>{emp.username}</option>
          ))}
        </select><br /><br />

        <label>Performance Period:</label>
        <input type="text" name="performance_period" value={formData.performance_period} onChange={handleChange} placeholder="e.g., Q2 2025" required /><br /><br />

        <label>Feedback Type:</label>
        <select name="feedback_type" value={formData.feedback_type} onChange={handleChange} required>
          <option value="">-- Select Type --</option>
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
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
}

export default FeedbackForm;
