import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ErrorPage.css';

function Unauthorized() {
  return (
    <div className="error-page">
      <h1 className="error-code">403</h1>
      <h2 className="error-title">Access Denied</h2>
      <p className="error-message">
        You don't have permission to access this page.
      </p>
      <Link to="/login" className="error-button">Back to Home</Link>
    </div>
  );
}

export default Unauthorized;
