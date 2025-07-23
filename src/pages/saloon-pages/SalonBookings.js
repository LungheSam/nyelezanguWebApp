// import React, { useEffect, useState } from 'react';
// import { auth, db } from '../../firebase';
// import { collection, query, where, onSnapshot } from 'firebase/firestore';

// export default function SalonBookings() {
//   const [bookings, setBookings] = useState([]);
//   const uid = auth.currentUser?.uid;

//   useEffect(() => {
//     if (!uid) return;
//     const q = query(collection(db, 'bookings'), where('salonId', '==', uid));
//     const unsub = onSnapshot(q, snap => {
//       setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//       console.log(snap.docs);
//     });
//     return unsub;
//   }, [uid]);

//   return (
//     <div className="salon-dashboard-page">
//       <h2>All Bookings</h2>
//       {bookings.length ? bookings.map(b => (
//         <div key={b.id} className="booking-item">
//           <p><strong>{b.userName}</strong> on {new Date(b.date.seconds * 1000).toLocaleDateString()} @ {b.time}</p>
//           <p>Status: {b.status}</p>
//         </div>
//       )) : <p>No bookings yet.</p>}
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';

export default function SalonBookings() {
  const [bookings, setBookings] = useState([]);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

    const q = query(collection(db, 'bookings'), where('salonId', '==', uid));
    const unsub = onSnapshot(q, snap => {
      const bookingsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // For each booking, fetch user details based on the userId
      Promise.all(bookingsData.map(async (booking) => {
        const userRef = doc(db, 'users', booking.userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          return {
            ...booking,
            user: userSnap.data() // Add user details to booking
          };
        }
        return booking; // Return booking as-is if user not found
      }))
      .then(updatedBookings => setBookings(updatedBookings));
    });

    return unsub;
  }, [uid]);

  return (
    <div className="salon-dashboard-page">
      <h2>All Bookings</h2>
      {bookings.length ? bookings.map(b => (
        <div key={b.id} className={b.status=="pending"?"booking-item":"booking-item booking-item-responded"}>
          <p><strong>{b.user?.name || 'Unknown Client'}</strong> on {new Date(b.date.seconds * 1000).toLocaleDateString()} @ {b.time}</p>
          <p>Status: {b.status}</p>
          <p>Requested Service: <strong>{b.service}</strong></p>
          {b.user && (
            <div>
              <p>Email: {b.user.email}</p>
              <p>Phone: {b.user.phone}</p>
            </div>
          )}
        </div>
      )) : <p>No bookings yet.</p>}
    </div>
  );
}
