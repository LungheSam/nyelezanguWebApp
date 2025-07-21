import React, { useEffect, useState } from 'react';
import ClientHeader from './ClientHeader';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import '../../styles/SalonBooking.css';

function SalonProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);

  useEffect(() => {
    getDoc(doc(db, 'salons', id)).then(snap => {
      if (snap.exists()) setSalon(snap.data());
    });
  }, [id]);

  if (!salon) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <ClientHeader title={salon.name} />
      <div className="salon-details">
        <p><h3>Address:</h3> {salon.address}</p>
        <p><h3>Rating:</h3> {salon.rating?.toFixed(1) || 'N/A'}</p>
        <h3>Services</h3>
        <ul>
          {salon.services.map((svc, idx) => (
            <li key={idx}>
              {svc.name} -- {svc.price.toLocaleString()} UGX ({svc.duration} min)
            </li>
          ))}
        </ul>
        <h3>Gallery Photos</h3>
        <button onClick={() => navigate(`/book/${id}`)}>Book Appointment</button>
      </div>
    </div>
  );
}

export default SalonProfile;
