// src/components/Navbar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={styles.nav}>
      <h3 style={styles.logo}>Feedback System</h3>
      <div style={styles.profileWrapper}>
        <div onClick={() => setOpen(!open)} style={styles.avatar}>👤</div>
        {open && (
          <div style={styles.dropdown}>
            <button onClick={handleLogout} style={styles.LogoutBtn}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 20px',
    backgroundColor: '#f3f3f3',
    alignItems: 'center'
  },
  logo: {
    margin: 0
  },
  profileWrapper: {
    position: 'relative',
  },
  avatar: {
    cursor: 'pointer',
    fontSize: '1.4rem',
  },
  dropdown: {
    position: 'absolute',
    top: '120%',
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '10px',
  },
  LogoutBtn: {
    backgroundColor: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#333'
  }
};

export default Logout;
