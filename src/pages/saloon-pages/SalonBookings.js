import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function SalonBookings() {
  const [bookings, setBookings] = useState([]);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'bookings'), where('salonId', '==', uid));
    const unsub = onSnapshot(q, snap => {
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [uid]);

  return (
    <div className="salon-dashboard-page">
      <h2>All Bookings</h2>
      {bookings.length ? bookings.map(b => (
        <div key={b.id} className="booking-item">
          <p><strong>{b.userName}</strong> on {new Date(b.date.seconds * 1000).toLocaleDateString()} @ {b.time}</p>
          <p>Status: {b.status}</p>
        </div>
      )) : <p>No bookings yet.</p>}
    </div>
  );
}
