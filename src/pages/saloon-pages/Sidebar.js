
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import '../../styles/Sidebar.css';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose}></div>
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className='sidebar-header-logo'>
            <img src='NZ.png' alt='Logo'/>
          </div>
          <h2>Nyele Zangu</h2>
        </div>
        <ul className="sidebar-menu">
          <li><Link to="/home-saloon" onClick={onClose}> Home</Link></li>
          <li><Link to="/salon-profile" onClick={onClose}> Our Profile</Link></li>
          <li><Link to="/salon-bookings" onClick={onClose}> Our Bookings</Link></li>
          <li><Link to="/salon-approvals" onClick={onClose}> Our Approvals</Link></li>
          <li><Link to="/salon-services" onClick={onClose}> Our Services</Link></li>
          <li>
            <button onClick={handleLogout} className="saloon-logout-btn"> Logout</button>
          </li>
        </ul>
      </nav>
    </>
  );
}
