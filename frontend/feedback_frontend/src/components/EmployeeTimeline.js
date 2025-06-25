import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

function EmployeeTimeline() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await axiosInstance.get('/fb_timeline/');
        setTimeline(res.data.timeline || []);
      } catch (error) {
        console.error('Error fetching timeline:', error);
        setErrorMsg('Failed to load timeline.');
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  if (loading) return <p>Loading timeline...</p>;
  if (errorMsg) return <p style={{ color: 'red' }}>{errorMsg}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Feedback Timeline</h2>
      {timeline.length === 0 ? (
        <p>No feedback data available.</p>
      ) : (
        <ul>
          {timeline.map((item, index) => (
            <li key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <p><strong>Date:</strong> {item.date}</p>
              <p><strong>Period:</strong> {item.period}</p>
              <p><strong>Type:</strong> {item.type}</p>
              <p><strong>Strengths:</strong> {item.strengths}</p>
              <p><strong>Improvements:</strong> {item.improvements}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EmployeeTimeline;
