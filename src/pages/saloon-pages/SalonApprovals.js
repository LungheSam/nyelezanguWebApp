
// import React, { useEffect, useState } from 'react';
// import { auth, db } from '../../firebase';
// import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

// export default function SalonApprovals() {
//   const [pending, setPending] = useState([]);
//   const uid = auth.currentUser?.uid;

//   // Fetch the pending bookings from Firestore
//   useEffect(() => {
//     if (!uid) return;
//     const q = query(
//       collection(db, 'bookings'),
//       where('salonId', '==', uid),
//       where('status', '==', 'pending')
//     );
//     return onSnapshot(q, snap => setPending(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
//   }, [uid]);

//   // Update the booking status in Firestore and send a response
//   const updateStatus = async (id, status, userId) => {
//     try {
//       // Update the status of the booking in Firestore
//       await updateDoc(doc(db, 'bookings', id), { status });

//       // Send a request to the API to notify the user
//       await sendBookingResponse(userId, status);
//     } catch (error) {
//       console.error('Error updating booking status:', error);
//     }
//   };

//   // Function to send request to API after status update
//   const sendBookingResponse = async (userId, status) => {
//     try {
//       const response = await fetch('/api/book-response', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId,
//           status,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to send notification');
//       }
//       console.log('Successfully sent SMS and Email');
//     } catch (error) {
//       console.error('Error sending response:', error);
//     }
//   };

//   return (
//     <div className="salon-dashboard-page">
//       <h2>Pending Approvals</h2>
//       {pending.length ? pending.map(r => (
//         <div key={r.id} className="booking-item">
//           <p><strong>{r.userName}</strong> on {new Date(r.date.seconds * 1000).toLocaleDateString()} @ {r.time}</p>
//           <button onClick={() => updateStatus(r.id, 'approved', r.userId)}>Approve</button>
//           <button onClick={() => updateStatus(r.id, 'declined', r.userId)}>Decline</button>
//         </div>
//       )) : <p>No pending requests.</p>}
//       {console.log(pending)}
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, query, where, onSnapshot, getDoc, doc, updateDoc } from 'firebase/firestore';

export default function SalonApprovals() {
  const [pending, setPending] = useState([]);
  const uid = auth.currentUser?.uid;

  // Fetch the pending bookings from Firestore
  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, 'bookings'),
      where('salonId', '==', uid),
      where('status', '==', 'pending')
    );

    return onSnapshot(q, snap => {
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
      .then(updatedBookings => setPending(updatedBookings));
    });
  }, [uid]);

  // Update the booking status in Firestore and send a response
  const updateStatus = async (id, status, userId, email, phone, name,salonName) => {
    try {
      // Update the status of the booking in Firestore
      await updateDoc(doc(db, 'bookings', id), { status });

      // Send a request to the API to notify the user
      await sendBookingResponse(userId, status, email, phone, name, salonName);
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  // Function to send request to API after status update
  const sendBookingResponse = async (userId, status, email, phone, name, salonName) => {
    try {
      const response = await fetch('https://nyelezanguserver2.onrender.com/api/book-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          status,
          name,
          email,   // Send email of the client
          phone,   // Send phone number of the client
          salonName
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
      console.log('Successfully sent SMS and Email');
    } catch (error) {
      console.error('Error sending response:', error);
    }
  };

  return (
    <div className="salon-dashboard-page">
      <h2>Pending Approvals</h2>
      {pending.length ? pending.map(r => (
        <div key={r.id} className="booking-item">
          <p><strong>{r.user?.name || 'Unknown Client'}</strong> on {new Date(r.date.seconds * 1000).toLocaleDateString()} @ {r.time}</p>
          
          
          
          
          {/* Optionally, Display Additional Information if Needed */}
          <p>Status: {r.status}</p>
          <p>Requested Service: <strong>{r.service}</strong></p>
          {r.user && (
            <div>
              <p>Email: {r.user.email}</p>
              <p>Phone: {r.user.phone}</p>
            </div>
          )}
          <div className='services-buttons'>
              <button onClick={() => updateStatus(r.id, 'approved', r.userId, r.user?.email, r.user?.phone,r.user?.name,r.salonName)}>Approve</button>
              <button onClick={() => updateStatus(r.id, 'declined', r.userId, r.user?.email, r.user?.phone,r.user?.name,r.salonName)}>Decline</button>
          </div>
          
        </div>
      )) : <p>No pending requests.</p>}
    </div>
  );
}

