// src/pages/Verify.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Verify() {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [registrationData, setRegistrationData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    
    const data = JSON.parse(localStorage.getItem('registrationData'));
    if (!data) {
      alert('No registration data found. Please register again.');
      navigate('/register-new');
    } else {
      setRegistrationData(data);
    }
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://nyelezanguserver2.onrender.com/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...registrationData,
          code,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Registration complete! You are now logged in.');
        localStorage.removeItem('registrationData');
        navigate('/home-client');
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      alert('❌ Server error: ' + error.message);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <h2 className='form-title'>Enter Verification Code</h2>
      <form onSubmit={handleVerify} className="form-group">
        <input
          type="text"
          placeholder="Enter code from Email/SMS"
          value={code}
          onChange={e => setCode(e.target.value)}
          required
        />
        <button type='submit' className="buy-button" disabled={loading}>
        {loading ? 'Verifiying…' : 'Verify & Finish Registration'}
        </button>
      </form>
    </div>
  );
}

export default Verify;
