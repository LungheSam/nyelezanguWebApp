import React, { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { db, auth } from '../../firebase';
import ClientHeader from './ClientHeader';
import '../../styles/HomeClient.css';
import { signOut } from 'firebase/auth';



function HomeClient() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser) {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            setUserData(null);
          }
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (loading) return <div className="home-client-container">Loading...</div>;

  return (
    <div className="home-client-container">
      <ClientHeader title='Welcome to Nyele Zangu 💇🏽‍♀️' extracontent={`Hi ${userData.name || 'there'}, find trusted salons near you and book instantly.`} />

      <section className="client-actions">
        <Link to="/search" className="action-card">
          <h2>🔍 Find Salons</h2>
          <p>Search salons by location, name, or service type.</p>
        </Link>

        <Link to="/map" className="action-card">
          <h2>📍 Salons Near Me</h2>
          <p>Use your location to find salons on the map.</p>
        </Link>

        <Link to="/bookings" className="action-card">
          <h2>📅 My Bookings</h2>
          <p>View and manage your upcoming appointments.</p>
        </Link>

        {/* ✅ Logout Button */}
        <button className="action-card logout-button" onClick={handleLogout}>
          Logout
        </button>
      </section>

      <footer className="client-footer">
        <p>&copy; {new Date().getFullYear()} Nyele Zangu • Empowering Beauty</p>
      </footer>
    </div>
  );
}

export default HomeClient;
