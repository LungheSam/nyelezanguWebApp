import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import ClientHeader from './ClientHeader';
import '../../styles/Profile.css';

export default function Profile() {
  const { currentUser } = useAuth();
  const [user, setUser] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (currentUser) {
        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          setUser({ name: data.name, email: data.email, phone: data.phone });
        }
      }
      setLoading(false);
    }
    fetchProfile();
  }, [currentUser]);

  const handleChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    await updateDoc(doc(db, 'users', currentUser.uid), {
      name: user.name,
      phone: user.phone,
    });
    setEditing(false);
    setSaving(false);
  };

  if (loading) return <div className="profile-page">Loading profile...</div>;

  return (
    <div className="profile-page">
      <ClientHeader title="My Profile" extracontent="View and update your profile info" />
      <Link to="/" className="error-button">
                Back to Home
      </Link>
      <div className="profile-card">
        <label>Name</label>
        <input
          name="name"
          value={user.name}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>Email</label>
        <input name="email" value={user.email} disabled />

        <label>Phone</label>
        <input
          name="phone"
          value={user.phone}
          onChange={handleChange}
          disabled={!editing}
        />

        {editing ? (
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        ) : (
          <button className="edit-btn" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
