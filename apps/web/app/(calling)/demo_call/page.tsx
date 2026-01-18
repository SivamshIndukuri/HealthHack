'use client';
import { useState } from 'react';

export default function CallPage() {
  const [to, setTo] = useState('');
  const [status, setStatus] = useState('');

  const handleCall = async () => {
    const res = await fetch('/api/call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to }),
    });
    const data = await res.json();
    setStatus(JSON.stringify(data));
  };

  return (
    <div className="p-6">
      <input
        type="text"
        placeholder="Enter phone number"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <button onClick={handleCall} className="bg-purple-600 text-white px-4 py-2 rounded">
        Call
      </button>
      <p>Status: {status}</p>
    </div>
  );
}
