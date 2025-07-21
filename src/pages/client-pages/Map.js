
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientHeader from './ClientHeader';
import { useAuth } from '../../contexts/AuthContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import "../../styles/Map.css";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function SalonMap() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [salons, setSalons] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');

  const mapRef = useRef();
  const mapDivRef = useRef();
  const markersRef = useRef([]);

  // Firestore real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'salons'), snapshot => {
      const list = snapshot.docs.map(doc => {
        const data = doc.data();
        const { latitude, longitude } = data.location;
        return { id: doc.id, ...data, latitude, longitude };
      });
      setSalons(list);
    });
    return unsubscribe;
  }, []);

  // Initialize Leaflet
  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = L.map(mapDivRef.current).setView([0.3476, 32.5825], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapRef.current);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        mapRef.current.setView([latitude, longitude], 13);
        L.marker([latitude, longitude]).addTo(mapRef.current)
          .bindPopup('🌟 Your Location');
      });
    }
  }, []);

  // Filter salons
  useEffect(() => {
    const f = query
      ? salons.filter(s => 
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.address.toLowerCase().includes(query.toLowerCase())
        )
      : salons;
    setFiltered(f);
  }, [query, salons]);

  // Add markers
  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    filtered.forEach(s => {
      const m = L.marker([s.latitude, s.longitude]).addTo(mapRef.current);
      m.bindPopup(`<b>${s.name}</b><br/>${s.address}<br/>
        <button className="pop-up-button" onclick="window.location.href='/salon/${s.id}'">
          View Profile
        </button>`);
      markersRef.current.push(m);
    });

    if (filtered.length > 1) {
      const bounds = L.latLngBounds(filtered.map(s => [s.latitude, s.longitude]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [filtered]);

  return (
    <div className="map-container">
      <ClientHeader extracontent='Closer to your location now...' />
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search by name or address..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <div ref={mapDivRef} className="map-view" />
      <div className="salon-list">
        {filtered.slice(0, 5).map(s => (
          <div key={s.id} className="salon-card" onClick={() => navigate(`/salon/${s.id}`)}>
            <h4>{s.name}</h4>
            <p>{s.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

