import { useState } from 'react';
import Playground from './Playground';
import Tracker from './Tracker';

export default function App() {
  const [tab, setTab] = useState('playground');
  return (
    <div className="app">
      <h1>CommitCue</h1>
      <p className="muted">Learn Git visually, track team contributions</p>
      <nav>
        <button className={tab === 'playground' ? 'on' : ''} onClick={() => setTab('playground')}>Playground</button>
        <button className={tab === 'tracker' ? 'on' : ''} onClick={() => setTab('tracker')}>Team Tracker</button>
      </nav>
      {tab === 'playground' ? <Playground /> : <Tracker />}
    </div>
  );
}