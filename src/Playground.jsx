import { useState } from 'react';
import { initialState, run } from './engine';
import CommitGraph from './CommitGraph';

export default function Playground() {
  const [state, setState] = useState(initialState);
  const [input, setInput] = useState('');
  const [log, setLog] = useState([]);

  function submit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const res = run(state, input);
    setState(res.state);
    setLog([{ cmd: input, explain: res.explain, error: res.error }, ...log]);
    setInput('');
  }

  return (
    <div className="card">
      <h2>Git Playground</h2>
      <p className="muted">Try: init, commit -m "first", branch feature, checkout feature, commit -m "work", checkout main, merge feature</p>
      <form onSubmit={submit}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder='git commit -m "message"' />{' '}
        <button className="go" type="submit">Run</button>{' '}
        <button type="button" onClick={() => { setState(initialState); setLog([]); }}>Reset</button>
      </form>
      <CommitGraph state={state} />
      {log.map((l, i) => (
        <p key={i} className={l.error ? 'err' : ''}><b>$ {l.cmd}</b><br />{l.explain}</p>
      ))}
    </div>
  );
}