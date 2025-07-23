// src/pages/saloon-pages/SalonDashboard.jsx
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import "../../styles/SalonDashboardPage.css";
import {
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

export default function SalonDashboard() {
  const uid = auth.currentUser?.uid;

  const [totalBookings, setTotalBookings] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [infoText] = useState(
    '💡 Did you know? Nyele Zangu helps salons reach more clients and streamline bookings!'
  );

  useEffect(() => {
    if (!uid) return;

    async function fetchStats() {
      const bookingsRef = collection(db, 'bookings');
      // Total bookings
      const totalSnap = await getDocs(query(bookingsRef, where('salonId', '==', uid)));
      setTotalBookings(totalSnap.size);

      // Pending approvals
      const pendingSnap = await getDocs(
        query(bookingsRef, 
              where('salonId', '==', uid), 
              where('status', '==', 'pending'))
      );
      setPendingCount(pendingSnap.size);
    }

    fetchStats();
  }, [uid]);

  return (
    <div className="salon-dashboard-page">
      <h2>Salon Dashboard</h2>
      <div className="dashboard-cards">
        <div className="salon-pages-card booking-card">
          <h3>Total Bookings</h3>
          <p>{totalBookings}</p>
        </div>

        <div className="salon-pages-card pending-card">
          <h3>Pending Approvals</h3>
          <p>{pendingCount}</p>
        </div>

        <div className="salon-pages-card info-card">
          <h3>Did You Know?</h3>
          <p>{infoText}</p>
        </div>
      </div>
    </div>
  );
}
