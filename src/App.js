import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/LoginPage';
import SignupPage from './Components/SignupPage';
import RiskScoreBoard from './Components/RiskScoreBoard';
import './App.css'; // Optional: You can add global styles here

const App = () => {
  return (
    <Router>
      <div className="App">
        <h1>Cashfree Payments</h1>
        <Routes>
          <Route path="/login" element={<Login />} /> {/* Use element prop for rendering components */}
          {/* You can add more routes here for other components/pages */}
          <Route path="/sign-up" element={<SignupPage />} />rt
          <Route path="/Risk-dashboard" element={<RiskScoreBoard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
