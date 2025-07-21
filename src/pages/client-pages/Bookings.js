import React, { useState, useEffect } from 'react';
import '../../styles/Bookings.css';
import ClientHeader from './ClientHeader';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

function Bookings() {
  const { currentUser, userData } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'bookings'), where('userId', '==', currentUser.uid));
    const unsub = onSnapshot(q, snapshot => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, [currentUser]);

  return (
    <div className="bookings-container">
      <ClientHeader />
      <h2>Your Bookings</h2>
      {bookings.length ? (
        <ul className="booking-list">
          {bookings.map(b => (
            <li key={b.id}>
              <h3>{b.salonName}</h3>
              <p>{new Date(b.date).toLocaleDateString()} at {b.time}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-bookings">You have no upcoming bookings.</p>
      )}
    </div>
  );
}

export default Bookings;
