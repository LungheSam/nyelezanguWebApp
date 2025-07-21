import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ErrorPage.css';
import { useAuth } from '../contexts/AuthContext';

function NotFound() {
  const { currentUser, userData } = useAuth();
  const [toLink, setToLink] = useState("/login");

  useEffect(() => {
    if (!currentUser) {
      setToLink("/login");
      return;
    }

    if (userData?.type === "client") {
      setToLink("/home-client");
    } else if (userData?.type === "saloon") {
      setToLink("/home-saloon");
    } else {
      setToLink("/login");
    }
  }, [currentUser, userData]);

  return (
    <div className="error-page">
      <h1 className="error-code">404</h1>
      <h2 className="error-title">Page Not Found</h2>
      <p className="error-message">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link to={toLink} className="error-button">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
