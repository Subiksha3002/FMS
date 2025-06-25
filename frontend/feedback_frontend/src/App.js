// import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registrationform from './components/Registrationform';
import Loginform from './components/Loginform';
import Dashboard from './components/Dashboard'; 
import Logout from './components/logout';
import FeedbackForm from './components/FeedBackForm';
import History from './components/History';
import Feedbackget from './components/Feedbackget';
import UpdateFeedback from './components/UpdateFeedback';
import TeamOverview from './components/TeamOverview';
import EmployeeTimeline from './components/EmployeeTimeline';



// const isAuthenticated = !!localStorage.getItem('token');

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Registrationform />} />
        <Route path="/login" element={<Loginform />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Loginform />} />
        
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/feedback-history" element={<History />} />
        <Route path="/feedback-received" element={<Feedbackget/>}/>
        <Route path="/update-feedback" element={<UpdateFeedback />} />
        <Route path="/team-overview" element={<TeamOverview />} />
        <Route path="/employee-timeline" element={<EmployeeTimeline />} />

        


      </Routes>
    </Router>
  );
}

export default App;


