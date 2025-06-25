import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

function Feedbackget() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchReceivedFeedback = async () => {
      try {
        const res = await axiosInstance.get('/fbreceived/');
        setFeedbacks(res.data);
      } catch (error) {
        console.error('Error fetching received feedback:', error);
        setErrorMsg('Failed to load feedback history.');
      } finally {
        setLoading(false);
      }
    };

    fetchReceivedFeedback();
  }, []);

  if (loading) return <p>Loading feedback...</p>;
  if (errorMsg) return <p style={{ color: 'red' }}>{errorMsg}</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Feedback You Received</h2>

      {feedbacks.length === 0 ? (
        <p>No feedback found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {feedbacks.map((fb, index) => (
            <li key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <p><strong>Date:</strong> {fb.feedback_date || 'N/A'}</p>
              <p><strong>Period:</strong> {fb.performance_period || 'N/A'}</p>
              <p><strong>Type:</strong> {fb.feedback_type || 'N/A'}</p>
              <p><strong>Strengths:</strong> {fb.key_strengths || 'N/A'}</p>
              <p><strong>Improvements:</strong> {fb.areas_for_improvement || 'N/A'}</p>
              <p><strong>Manager:</strong> {typeof fb.manager === 'object' ? fb.manager?.username : fb.manager || 'N/A'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Feedbackget;
