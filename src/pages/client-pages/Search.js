import React, { useState, useEffect } from 'react';
import '../../styles/Search.css';
import ClientHeader from './ClientHeader';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';



export default function Search() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [salons, setSalons] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [country,setCountry]=useState('Uganda');



  // 📌 2. Real-time Firestore listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'salons'), snap => {
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setSalons(arr);
    });
    return unsub;
  }, []);

  // 🔍 3. Filter & sort salons
  useEffect(() => {
    let list = salons.filter(s => s.country === country);
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(t) ||
        s.address.toLowerCase().includes(t)
      );
    }
    list = list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    setFiltered(list.slice(0, 5));
  }, [country, searchTerm, salons]);

  return (
    <div className="main-container search-container">
      <ClientHeader extracontent='Trying to find a place to make yourself beautiful?' />

      <form className="search-form" onSubmit={e => e.preventDefault()}>
        <input
          className="search-form-input"
          type="text"
          placeholder="Search salons by name or address..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </form>

      <div className="results">
        {filtered.map(s => (
          <div key={s.id} className="salon-card">
            <h3>{s.name}</h3>
            <p>{s.address}</p>
            <p>Rating: {s.rating?.toFixed(1) || 'No rating'}</p>
            <div className="actions">
              <button onClick={() => navigate(`/salon/${s.id}`)}>View Profile</button>
              <button onClick={() => navigate(`/book/${s.id}`)}>Book Now</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p>No salons found in {country || 'your country'}.</p>}
      </div>
    </div>
  );
}

