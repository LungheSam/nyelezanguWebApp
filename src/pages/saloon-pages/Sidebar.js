// // src/components/Sidebar.jsx
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { signOut } from 'firebase/auth';
// import { auth } from '../../firebase';
// import '../../styles/Sidebar.css';

// export default function SalonSidebar() {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await signOut(auth);
//     navigate('/login');
//   };

//   return (
//     <nav className="sidebar">
//       <div className="sidebar-header">
//         <h2>Nyele Zangu</h2>
//       </div>
//       <ul className="sidebar-menu">
//         <li><Link to="/salon-profile">✏️ Edit Profile</Link></li>
//         <li><Link to="/salon-bookings">📅 Bookings</Link></li>
//         <li><Link to="/salon-approvals">✅ Approvals</Link></li>
//         <li><Link to="/salon-services">💼 Services</Link></li>
//         <li><button onClick={handleLogout} className="saloon-logout-btn">Logout</button></li>
//       </ul>
//     </nav>
//   );
// }
// src/components/Sidebar.jsx
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
          <h2>Nyele Zangu</h2>
        </div>
        <ul className="sidebar-menu">
          <li><Link to="/salon-profile" onClick={onClose}>✏️ Edit Profile</Link></li>
          <li><Link to="/salon-bookings" onClick={onClose}>📅 Bookings</Link></li>
          <li><Link to="/salon-approvals" onClick={onClose}>✅ Approvals</Link></li>
          <li><Link to="/salon-services" onClick={onClose}>💼 Services</Link></li>
          <li>
            <button onClick={handleLogout} className="saloon-logout-btn">🔒 Logout</button>
          </li>
        </ul>
      </nav>
    </>
  );
}
