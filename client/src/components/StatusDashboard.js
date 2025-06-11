// client/src/components/StatusDashboard.js
import React from 'react';

function StatusDashboard({ results }) {
  return (
    <div>
      <h2>Email Status</h2>
      {results.length === 0 ? (
        <p>No emails sent yet.</p>
      ) : (
        <ul>
          {results.map((r, index) => (
            <li key={index}>
              {r.company} - <strong>{r.status}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StatusDashboard;
