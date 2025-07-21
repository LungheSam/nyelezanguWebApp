import React, { useEffect, useState } from 'react';
import ClientHeader from './ClientHeader';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/SalonBooking.css';

function BookAppointment() {
  const { salonId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [salon, setSalon] = useState(null);
  const [service, setService] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getDoc(doc(db, 'salons', salonId)).then(snap => {
      const data = snap.data();
      if (data) {
        setSalon(data);
        setService(data.services[0]?.name || '');
      }
    });
  }, [salonId]);

  const handleBooking = async () => {
    setError('');
    if (!service || !selectedDate || !time) {
      setError('Please choose service, date, and time');
      return;
    }
    const start = new Date(selectedDate);
    start.setHours(time.split(':')[0], time.split(':')[1]);
    const end = new Date(start.getTime() + salon.services.find(s => s.name === service).duration * 60000);

    const q = query(
      collection(db, 'bookings'),
      where('salonId', '==', salonId),
      where('date', '>=', start),
      where('date', '<', end)
    );
    const existing = await getDocs(q);
    if (!existing.empty) {
      setError('That time slot is already booked.');
      return;
    }

    await addDoc(collection(db, 'bookings'), {
      userId: currentUser.uid,
      salonId,
      salonName: salon.name,
      service,
      date: start,
      time,
      status: 'pending',
      createdAt: serverTimestamp()
    });

    alert('✅ Booking confirmed!');
    navigate('/bookings');
  };

  if (!salon) return <p>Loading...</p>;

  return (
    <div className="book-container">
      <ClientHeader title={salon.name} />
      <div className="book-form">
        <h3>Book at {salon.name}</h3>

        {error && <div className="error">{error}</div>}

        <label>Service</label>
        <select value={service} onChange={e => setService(e.target.value)}>
          {salon.services.map((s, i) => (
            <option key={i} value={s.name}>
              {s.name} -- {s.price.toLocaleString()} UGX
            </option>
          ))}
        </select>

        <label>Date</label>
        <DatePicker
          selected={selectedDate}
          onChange={setSelectedDate}
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}
        />

        <label>Time</label>
        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
        />
        <h3>Booking Fee: <strong>3000 UGX</strong></h3>
        <button onClick={handleBooking}>Confirm Booking</button>
      </div>
    </div>
  );
}

export default BookAppointment;
