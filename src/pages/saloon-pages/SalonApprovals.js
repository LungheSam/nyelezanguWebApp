import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

export default function SalonApprovals() {
  const [pending, setPending] = useState([]);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(db, 'bookings'),
      where('salonId', '==', uid),
      where('status', '==', 'pending')
    );
    return onSnapshot(q, snap => setPending(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [uid]);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, 'bookings', id), { status });
  };

  return (
    <div className="salon-dashboard-page">
      <h2>Pending Approvals</h2>
      {pending.length ? pending.map(r => (
        <div key={r.id} className="booking-item">
          <p><strong>{r.userName}</strong> on {new Date(r.date.seconds * 1000).toLocaleDateString()} @ {r.time}</p>
          <button onClick={() => updateStatus(r.id, 'approved')}>Approve</button>
          <button onClick={() => updateStatus(r.id, 'declined')}>Decline</button>
        </div>
      )) : <p>No pending requests.</p>}
    </div>
  );
}
