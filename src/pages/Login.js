// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase'; // db is Firestore
import { doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userType = userData.type;

        alert('✅ Login successful!');

        if (userType === "client") {
          navigate("/home-client");
        } else if (userType === "saloon") {
          navigate("/home-saloon");
        } else {
          navigate("/"); // default fallback
        }
      } else {
        alert("❌ User data not found.");
      }

    } catch (error) {
      alert('❌ Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className='login-contents'>
        <h2 className="form-title">Welcome Back!</h2>
        <form onSubmit={handleLogin} className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type='submit' className="buy-button" disabled={loading}>
              {loading ? 'Logging In…' : 'Login'}
            </button>
        </form>
        <p> 
            Don't have an account? <Link to="/register-new">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
