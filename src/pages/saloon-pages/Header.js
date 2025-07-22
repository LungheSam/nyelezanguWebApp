// // src/components/Header.jsx
// import React from 'react';
// import '../../styles/Header.css';

// export default function SalonHeader() {
//   return (
//     <header className="saloon-header">
//       <h1>Nyele Zangu Dashboard</h1>
//     </header>
//   );
// }

// src/components/Header.jsx
import React from 'react';
import '../../styles/Header.css';

export default function Header({ onMenuClick }) {
  return (
    <header className="saloon-header">
      <button className="menu-button" onClick={onMenuClick}>☰</button>
      <h1>Dashboard</h1>
    </header>
  );
}
