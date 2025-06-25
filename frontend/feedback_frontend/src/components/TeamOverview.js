import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

function TeamOverview() {
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [sentimentTrends, setSentimentTrends] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axiosInstance.get('/team-overview/'); 
        setFeedbackCount(res.data.feedback_count);
        setSentimentTrends(res.data.sentiment_trends);
      } catch (error) {
        console.error('Error fetching team overview:', error);
        setErrorMsg('Failed to load team overview.');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) return <p>Loading team overview...</p>;
  if (errorMsg) return <p style={{ color: 'red' }}>{errorMsg}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Team Feedback Overview</h2>
      <p><strong>Total Feedback Submitted:</strong> {feedbackCount}</p>

      <h3>Sentiment Trends</h3>
      <ul>
        {sentimentTrends.map((trend, index) => (
          <li key={index}>
            <strong>{trend.feedback_type}</strong>: {trend.count}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamOverview;
