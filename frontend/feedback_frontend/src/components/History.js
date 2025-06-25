import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Get employee/user ID from localStorage
        const userId = localStorage.getItem('user_id');

        if (!userId) {
          console.error('No user ID found in localStorage');
          return;
        }

        const res = await axiosInstance.get(`/fbhistory/${userId}/`);
        setHistory(res.data);
      } catch (error) {
        console.error('Error fetching feedback history:', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Feedback History</h2>
      {history.length > 0 ? (
        <ul>
          {history.map((item) => (
            <li key={item.id}>
              <strong>Period:</strong> {item.performance_period} <br />
              <strong>Type:</strong> {item.feedback_type} <br />
              <strong>Strengths:</strong> {item.key_strengths} <br />
              <strong>Improvements:</strong> {item.areas_for_improvement} <br />
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>No feedback history found.</p>
      )}
    </div>
  );
}

export default History;
