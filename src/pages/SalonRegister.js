import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../styles/Register.css";

export default function SalonRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', country: '', password: '', confirmPassword: ''
  });
  const [services, setServices] = useState([
    { name: '', price: '', duration: '' },
  ]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => setLocation({ lat: coords.latitude, lng: coords.longitude }),
        () => console.warn('Geolocation permission denied')
      );
    }
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleServiceChange = (idx, field, value) => {
    const updated = [...services];
    updated[idx][field] = value;
    setServices(updated);
  };

  const addService = () => setServices([...services, { name: '', price: '', duration: '' }]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    for (const key in form) {
      if (!form[key]) {
        setError('All fields are required');
        setLoading(false);
        return;
      }
    }
    if (form.password.length < 6 || form.password !== form.confirmPassword) {
      setError('Password must be ≥6 chars and match');
      setLoading(false);
      return;
    }
    const validServices = services.every(s => s.name && s.price && s.duration);
    if (!validServices) {
      setError('Please complete all service fields');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...form,
        services,
        location,
      };

      const res = await fetch('https://nyelezanguserver2.onrender.com/auth/send-code-salon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log(data);
      if (data.success) {
        localStorage.setItem('salonRegistrationData', JSON.stringify({ ...payload }));
        navigate('/verify');
      } else {
        setError('Failed to send verification code');
      }
    } catch (err) {
      console.error(err);
      setError('Network/server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register Your Salon</h2>
      <form onSubmit={handleSubmit} className="form-group">
        {error && <p className="error-registration">{error}</p>}
        
        <input name="name" placeholder="Salon Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <input name="country" placeholder="Country" value={form.country} onChange={handleChange} />
        <input
          type="password" name="password"
          placeholder="Password" value={form.password}
          onChange={handleChange}
        />
        <input
          type="password" name="confirmPassword"
          placeholder="Confirm Password" value={form.confirmPassword}
          onChange={handleChange}
        />

        <h4>Services Offered</h4>
        {services.map((s, idx) => (
          <div key={idx} className="service-row">
            <input
              placeholder="Service Name" value={s.name}
              onChange={e => handleServiceChange(idx, 'name', e.target.value)}
            />
            <input
              placeholder="Price" value={s.price}
              onChange={e => handleServiceChange(idx, 'price', e.target.value)}
            />
            <input
              placeholder="Duration (min)" value={s.duration}
              onChange={e => handleServiceChange(idx, 'duration', e.target.value)}
            />
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addService}>
          + Add Another Service
        </button>

        <button type="submit" className="buy-button" disabled={loading}>
          {loading ? 'Sending Code…' : 'Send Verification Code'}
        </button>
      </form>

      <p>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
