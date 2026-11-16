const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#06b6d4'];

export default function CommitGraph({ state }) {
  const commits = Object.values(state.commits);
  if (!commits.length) return <p className="muted">No commits yet. Try: init, then commit -m "first"</p>;

  const lanes = [...new Set(commits.map(c => c.branch))];
  const pos = {};
  commits.forEach((c, i) => { pos[c.id] = { x: 60 + i * 90, y: 50 + lanes.indexOf(c.branch) * 80 }; });

  const labels = {};
  Object.entries(state.branches).forEach(([b, id]) => { labels[id] = [...(labels[id] || []), b]; });

  return (
    <div className="graph">
      <svg width={120 + commits.length * 90} height={110 + lanes.length * 80}>
        {commits.flatMap(c => c.parents.map(p => (
          <line key={c.id + p} x1={pos[p].x} y1={pos[p].y} x2={pos[c.id].x} y2={pos[c.id].y} stroke="#64748b" strokeWidth="3" />
        )))}
        {commits.map(c => {
          const { x, y } = pos[c.id];
          return (
            <g key={c.id} className="node">
              <circle cx={x} cy={y} r="16" fill={COLORS[lanes.indexOf(c.branch) % COLORS.length]} />
              <text x={x} y={y + 4} textAnchor="middle" fill="#fff" fontSize="12">{c.id}</text>
              <text x={x} y={y + 36} textAnchor="middle" fill="#94a3b8" fontSize="11">{c.message}</text>
              {(labels[c.id] || []).map((b, i) => (
                <text key={b} x={x} y={y - 26 - i * 14} textAnchor="middle" fontSize="12" fontWeight="bold"
                  fill={b === state.head ? '#facc15' : '#e2e8f0'}>{b === state.head ? '▶ ' + b : b}</text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}