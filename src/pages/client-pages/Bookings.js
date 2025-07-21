import React, { useState, useEffect } from 'react';
import '../../styles/Bookings.css';
import ClientHeader from './ClientHeader';
import { Link } from 'react-router-dom';
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

  const pending = bookings.filter(b => b.status === 'pending');
  const approved = bookings.filter(b => b.status === 'approved');
  const disapproved = bookings.filter(b => b.status === 'disapproved');
  const reschedule = bookings.filter(b => b.status === 'reschedule');

  const renderCard = booking => {
    const dateStr = new Date(booking.date.seconds * 1000).toLocaleDateString();
    const timeStr = booking.time;
    return (
      <li key={booking.id} className={`booking-card ${booking.status}`}>
        <h3>{booking.salonName}</h3>
        <p>{dateStr} at {timeStr}</p>
        <p><strong>Status:</strong> {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</p>
        {booking.status === 'reschedule' && booking.proposedDate && (
          <p><em>Proposed new: {new Date(booking.proposedDate.seconds * 1000).toLocaleDateString()} at {booking.proposedTime}</em></p>
        )}
      </li>
    );
  };

  return (
    <div className="bookings-container">
      <ClientHeader />
      <Link to="/" className="error-button">
                Back to Home
      </Link>
      <h2>Your Bookings</h2>

      {approved.length > 0 && <>
        <h3 className="section-title">Approved</h3>
        <ul className="booking-list">{approved.map(renderCard)}</ul>
      </>}

      {reschedule.length > 0 && <>
        <h3 className="section-title">Reschedule Requested</h3>
        <ul className="booking-list">{reschedule.map(renderCard)}</ul>
      </>}

      {pending.length > 0 && <>
        <h3 className="section-title">Pending</h3>
        <ul className="booking-list">{pending.map(renderCard)}</ul>
      </>}

      {disapproved.length > 0 && <>
        <h3 className="section-title">Disapproved</h3>
        <ul className="booking-list">{disapproved.map(renderCard)}</ul>
      </>}

      {bookings.length === 0 && <p className="no-bookings">You have no bookings yet.</p>}
    </div>
  );
}

export default Bookings;
