import React, { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    setEntries(stored);
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {entries.map((e, i) => (
          <li key={i}>{e.address} - ELO {e.elo} - wins {e.wins}</li>
        ))}
      </ul>
    </div>
  );
}
