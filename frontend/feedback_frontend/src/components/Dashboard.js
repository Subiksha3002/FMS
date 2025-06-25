import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi'; // Logout icon

function Dashboard() {
  const [userData, setUserData] = useState([]);
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get('/userview/');
        const data = res.data;

        if (Array.isArray(data)) {
          setUserData(data);      // Manager gets team list
          setIsManager(true);
        } else {
          setUserData([data]);    // Employee gets their own data
          setIsManager(false);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        if (err.response?.status === 401) {
          alert('Session expired. Please log in again.');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      {/* Logout icon top-right */}
      <div style={{ position: 'absolute', top: 20, right: 20, cursor: 'pointer' }} onClick={handleLogout} title="Logout">
        <FiLogOut size={24} color="red" />
      </div>

      <h2>Welcome {isManager ? 'Manager' : 'Employee'}</h2>

      {isManager ? (
        <>
          <h3>Your Team Members:</h3>
          {userData.length > 0 ? (
            <ul>
              {userData.map((member) => (
                <li key={member.id}>
                  <strong>{member.username}</strong> — {member.email}
                </li>
              ))}
            </ul>
          ) : (
            <p>No team members found.</p>
          )}
           <button
          onClick={() => navigate('/feedback')}
          style={{ marginTop: '20px', padding: '10px 20px' }}
        >
          Give Feedback
        </button>
         <button
              onClick={() => navigate('/feedback-history')}
              style={{ marginTop: '20px', padding: '10px 20px' }}
            >
              View Feedback History
                        </button>
                        <button
            onClick={() => navigate('/team-overview')}
            style={{ marginTop: '10px', padding: '10px 20px' }}
            >
            Team Overview
            </button>
          
      </> 
      ) : (
        <>
          {userData[0] ? (
            <>
              <h3>Your Profile:</h3>
              <p><strong>Username:</strong> {userData[0].username}</p>
              <p><strong>Email:</strong> {userData[0].email}</p>
              <p><strong>Role:</strong> {userData[0].role}</p>

              <button
              onClick={() => navigate('/feedback-history')}
              style={{ marginTop: '20px', padding: '10px 20px' }}
            >
              View Feedback History
            </button>

                        <button
            onClick={() => navigate('/feedback-received')}
            style={{ marginTop: '20px', padding: '10px 20px' }}
            >
            View Received Feedback
            </button>
                        <button
            onClick={() => navigate('/update-feedback')}
            style={{ marginTop: '20px', padding: '10px 20px' }}
            >
            Update Feedback
            </button>
                        <button
            onClick={() => navigate('/employee-timeline')}
            style={{ marginTop: '20px', padding: '10px 20px' }}
            >
            View Timeline
            </button>


          
            </>
          ) : (
            <p>No user data found.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
