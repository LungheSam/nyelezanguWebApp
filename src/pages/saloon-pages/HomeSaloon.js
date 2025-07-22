// // src/pages/HomeSaloon.jsx
// import React from 'react';
// import SalonSidebar from './Sidebar';
// import SalonHeader from './Header';
// import { Outlet } from 'react-router-dom';
// import '../../styles/HomeSaloon.css';

// export default function HomeSaloon() {
//   return (
//     <div className="dashboard">
//       <SalonSidebar />
//       <div className="main-area">
//         <SalonHeader />
//         <div className="content">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }
// src/pages/HomeSaloon.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import '../../styles/HomeSaloon.css';

export default function HomeSaloon() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="dashboard">
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="main-area">
        <Header onMenuClick={() => setMenuOpen(true)} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
