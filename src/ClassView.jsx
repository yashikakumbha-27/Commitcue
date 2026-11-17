import { useState } from 'react';
import { fetchStats, analyse } from './Tracker';

export default function ClassView() {
  const [text, setText] = useState('');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    const links = text.split('\n').map(s => s.trim()).filter(Boolean);
    setLoading(true);
    setTeams([]);
    const out = [];
    for (const link of links) {
      const m = link.match(/github\.com\/([^/]+)\/([^/\s#?]+)/);
      if (!m) {
        out.push({ link, error: 'Invalid link' });
      } else {
        try {
          const data = await fetchStats(m[1], m[2].replace(/\.git$/, ''));
          if (!data.length) out.push({ link, error: 'No data found' });
          else {
            const { rows, flag } = analyse(data);
            const top = rows.reduce((a, b) => (b.share > a.share ? b : a));
            out.push({ link, name: m[1] + '/' + m[2], members: rows.length, top, flag });
          }
        } catch (e) {
          out.push({ link, error: e.message });
        }
      }
      setTeams([...out]);
    }
    setLoading(false);
  }

  return (
    <div className="card">
      <h2>Class View</h2>
      <p className="muted">Paste one public repo link per line to compare all teams at once.</p>
      <textarea
        rows="5"
        style={{ width: '100%', padding: 8, borderRadius: 6, background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155' }}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={'https://github.com/owner/repo1\nhttps://github.com/owner/repo2'}
      />
      <p><button className="go" onClick={load} disabled={loading}>{loading ? 'Analysing...' : 'Analyse all teams'}</button></p>
      {teams.length > 0 && (
        <table>
          <thead><tr><th>Team repo</th><th>Members</th><th>Top contributor</th><th>Verdict</th></tr></thead>
          <tbody>
            {teams.map((t, i) => (
              <tr key={i}>
                <td>{t.name || t.link}</td>
                {t.error
                  ? <td colSpan="3" className="err">{t.error}</td>
                  : <>
                      <td>{t.members}</td>
                      <td>{t.top.name} ({t.top.share}%)</td>
                      <td><span className={'flag ' + t.flag[0]}>{t.flag[1]}</span></td>
                    </>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}