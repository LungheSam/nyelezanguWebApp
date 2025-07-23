import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function SalonServices() {
  const uid = auth.currentUser?.uid;
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!uid) return;
    getDoc(doc(db, 'salons', uid)).then(snap => {
      if (snap.exists()) setServices(snap.data().services || []);
    });
  }, [uid]);

  const changeService = (i, field, value) => {
    const arr = [...services];
    arr[i][field] = value;
    setServices(arr);
  };

  const addService = () => setServices([...services, { name: '', price: '', duration: '' }]);
  const save = async () => {
    await updateDoc(doc(db, 'salons', uid), { services });
    alert('Services updated!');
  };

  return (
    <div className="salon-dashboard-page">
      <h2>Manage Services</h2>
      {services.map((s, idx) => (
        <div className="service-row" key={idx}>
          <input placeholder="Name" value={s.name} onChange={e => changeService(idx, 'name', e.target.value)} />
          <input placeholder="Price" type="number" value={s.price} onChange={e => changeService(idx, 'price', e.target.value)} />
          <input placeholder="Duration (min)" type="number" value={s.duration} onChange={e => changeService(idx, 'duration', e.target.value)} />
        </div>
      ))}
      <button onClick={addService}>+ Add Service</button>
      <button onClick={save}>Save Services</button>
    </div>
  );
}
