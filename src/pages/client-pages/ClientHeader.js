import React from 'react';
import '../../styles/ClientHeader.css';

function ClientHeader({ title="Nyele Zangu 💇🏽‍♀️",extracontent="" }) {
  return (
    <header className="client-header">
      <h1>{title}</h1>
      <p>{extracontent || ' '}</p>
    </header>
  );
}

export default ClientHeader;
