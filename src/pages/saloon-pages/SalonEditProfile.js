import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import "../../styles/SalonDashboardPage.css";

export default function SalonEditProfile() {
  const [form, setForm] = useState({ name: '', address: '', country: '', phone: '' });
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    getDoc(doc(db, 'salons', uid)).then(snap => {
      if (snap.exists()) setForm(snap.data());
    });
  }, [uid]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    await updateDoc(doc(db, 'salons', uid), { ...form });
    alert('Profile updated!');
  };

  return (
    <div className="salon-dashboard-page">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        {['name', 'address', 'country', 'phone'].map(field => (
          <div key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input name={field} value={form[field]} onChange={handleChange} required />
          </div>
        ))}
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
