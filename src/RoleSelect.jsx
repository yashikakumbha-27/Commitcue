import { useState } from 'react';

export default function RoleSelect({ onDone }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!name.trim()) return setError('Please enter your name');
    if (!role) return setError('Please choose Student or Teacher');
    onDone({ name: name.trim(), role });
  };

  const card = (value, label) => ({
    padding: '16px 28px',
    borderRadius: 12,
    border: role === value ? '2px solid #7c6cf0' : '2px solid #2a2450',
    background: role === value ? '#2a2060' : '#15103a',
    color: 'white',
    fontSize: 18,
    cursor: 'pointer',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0b0720', color: 'white' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Welcome to CommitCue</h2>
        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          style={{ padding: 12, borderRadius: 8, border: '1px solid #2a2450', background: '#15103a', color: 'white', width: 240, marginBottom: 20 }}
        />
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 20 }}>
          <button style={card('student')} onClick={() => { setRole('student'); setError(''); }}>I'm a Student</button>
          <button style={card('teacher')} onClick={() => { setRole('teacher'); setError(''); }}>I'm a Teacher</button>
        </div>
        {error && <p style={{ color: '#ff8a8a' }}>{error}</p>}
        <button onClick={submit} style={{ padding: '12px 32px', borderRadius: 8, border: 'none', background: '#22c55e', color: 'white', fontSize: 16, cursor: 'pointer' }}>
          Continue
        </button>
      </div>
    </div>
  );
}