
import React, { useState } from 'react';
import axios from 'axios';

function Registrationform() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'employee', // default
    manager_id: '',   // only required if role = employee
  });

  const [responseMsg, setResponseMsg] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/register/', formData);
      setResponseMsg(res.data.message || 'Registration successful!');

    } catch (error) {
      setResponseMsg(error.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <div>
      <h1><center>FeedBack Management System</center></h1>
      <center>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required /><br />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br />
        
        <select name="role" onChange={handleChange}>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select><br />

        {formData.role === 'employee' && (
          <input name="manager_id" placeholder="Manager ID" onChange={handleChange} required />
        )}
        <br />

        <button type="submit">Register</button>
      </form>
      

      <p>{responseMsg}</p>
      </center>
    </div>
    
  );
}

export default Registrationform;