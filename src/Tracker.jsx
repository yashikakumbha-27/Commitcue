import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export async function fetchStats(owner, repo) {
  for (let i = 0; i < 6; i++) {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/stats/contributors`);
    if (res.status === 202) { await new Promise(r => setTimeout(r, 2000)); continue; } // GitHub is still computing
    if (res.status === 404) throw new Error('Repo not found (it must be public).');
    if (res.status === 403) throw new Error('GitHub rate limit reached. Try again later.');
    if (res.status === 204) return [];
    if (!res.ok) throw new Error('GitHub error ' + res.status);
        const json = await res.json();
    return json.filter(c => c.author); // skip deleted accounts
  }
  throw new Error('GitHub is still preparing stats. Try again in a minute.');
}

export function analyse(data) {
  const rows = data.map(c => ({
    name: c.author.login,
    commits: c.total,
    added: c.weeks.reduce((s, w) => s + w.a, 0),
    deleted: c.weeks.reduce((s, w) => s + w.d, 0),
  }));
  const totalCommits = rows.reduce((s, r) => s + r.commits, 0) || 1;
  const totalLines = rows.reduce((s, r) => s + r.added + r.deleted, 0) || 1;
  rows.forEach(r => {
    r.lines = r.added + r.deleted;
    r.share = Math.round((0.5 * r.commits / totalCommits + 0.5 * r.lines / totalLines) * 100);
  });
  const shares = rows.map(r => r.share);
  let flag = ['green', 'Balanced contribution'];
  if (rows.length < 2) flag = ['yellow', 'Only one contributor found'];
  else if (Math.max(...shares) > 50) flag = ['red', 'One person is carrying the project'];
  else if (Math.min(...shares) < 100 / rows.length / 2) flag = ['yellow', 'Uneven participation'];
  return { rows, flag };
}

export default function Tracker() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    setError(''); setResult(null);
    const m = url.match(/github\.com\/([^/]+)\/([^/\s#?]+)/);
    if (!m) return setError('Paste a link like https://github.com/owner/repo');
    setLoading(true);
    try {
      const data = await fetchStats(m[1], m[2].replace(/\.git$/, ''));
      if (!data.length) setError('No contribution data found for this repo.');
      else setResult(analyse(data));
    } catch (e) { setError(e.message); }
    setLoading(false);
  }

  return (
    <div className="card">
      <h2>Team Contribution Tracker</h2>
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://github.com/owner/repo" />{' '}
      <button className="go" onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Analyse'}</button>
      {error && <p className="err">{error}</p>}
      {result && (
        <>
          <p><span className={'flag ' + result.flag[0]}>{result.flag[1]}</span></p>
          <table>
            <thead><tr><th>Member</th><th>Commits</th><th>Lines added</th><th>Lines deleted</th><th>Share</th></tr></thead>
            <tbody>{result.rows.map(r => (
              <tr key={r.name}><td>{r.name}</td><td>{r.commits}</td><td>{r.added}</td><td>{r.deleted}</td><td>{r.share}%</td></tr>
            ))}</tbody>
          </table>
          <div style={{ height: 300, marginTop: 20 }}>
            <ResponsiveContainer>
              <BarChart data={result.rows}>
                <XAxis dataKey="name" /><YAxis domain={[0, 100]} /><Tooltip /><Legend />
                <Bar dataKey="share" name="Share (%)" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
