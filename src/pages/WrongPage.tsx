import React from 'react';
import { Link } from 'react-router-dom';
import "./styles/wrongpage.css" 

function WrongPage() {
  return (
    <div className="container-wrong">
      <div className="error-container">
        <h1 className="error-title">404</h1>
        <p className="error-message">Oops! Page Not Found</p>
        <p className="error-description">We can't find the page you're looking for.</p>
        <Link to="/" className="home-link">Go to Homepage</Link>
      </div>
    </div>
  );
}

export default WrongPage;
