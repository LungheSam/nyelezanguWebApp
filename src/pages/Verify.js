// src/pages/Verify.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Verify() {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [registrationData, setRegistrationData] = useState(null);
  const [isSalon, setIsSalon] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const clientData = JSON.parse(localStorage.getItem('registrationData'));
    const salonData = JSON.parse(localStorage.getItem('salonRegistrationData'));

    if (clientData) {
      setRegistrationData(clientData);
      setIsSalon(false);
    } else if (salonData) {
      setRegistrationData(salonData);
      setIsSalon(true);
    } else {
      alert('No registration data found. Please register again.');
      navigate('/register-new');
    }
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isSalon
      ? '/auth/verify-code-salon'
      : '/auth/verify-code';

    try {
      const response = await fetch(`https://nyelezanguserver2.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registrationData.email, code }),
      });
      const data = await response.json();

      if (data.success) {
        alert('✅ Registration complete!');
        // Clean up storage
        if (isSalon) localStorage.removeItem('salonRegistrationData');
        else localStorage.removeItem('registrationData');

        // Navigate based on user type
        navigate(isSalon ? '/login' : '/home-client');
      } else {
        alert('❌ ' + (data.message || 'Verification failed'));
      }
    } catch (err) {
      console.error(err);
      alert('❌ Server error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <h2 className="form-title">Enter Verification Code</h2>
      <form onSubmit={handleVerify} className="form-group">
        <input
          type="text"
          placeholder="Enter code from Email/SMS"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit" className="buy-button" disabled={loading}>
          {loading ? 'Verifying…' : 'Verify & Finish Registration'}
        </button>
      </form>
    </div>
  );
}

export default Verify;
