export default function Dashboard({ user, onOpen, onLogout }) {
  const cards = [
    { id: 'playground', title: 'Git Playground', desc: 'Type Git commands and watch the commit graph update live.', roles: ['student'] },
    { id: 'tracker', title: 'Team Tracker', desc: 'Paste a GitHub repo to see who contributed what.', roles: ['student', 'teacher'] },
    { id: 'class', title: 'Class View', desc: 'Compare several team repos with one verdict each.', roles: ['teacher'] },
  ].filter((c) => c.roles.includes(user.role));

  return (
    <div style={{ minHeight: '100vh', background: '#0b0720', color: 'white', padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h2 style={{ margin: 0 }}>Hi {user.name} 👋 <span style={{ fontSize: 14, color: '#a99cf5' }}>({user.role})</span></h2>
        <button onClick={onLogout} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #2a2450', background: 'transparent', color: 'white', cursor: 'pointer' }}>
          Switch role
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        {cards.map((c) => (
          <div
            key={c.id}
            onClick={() => onOpen(c.id)}
            style={{ padding: 24, borderRadius: 16, background: '#15103a', border: '1px solid #2a2450', cursor: 'pointer' }}
          >
            <h3 style={{ marginTop: 0 }}>{c.title}</h3>
            <p style={{ color: '#a99cf5', marginBottom: 0 }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}