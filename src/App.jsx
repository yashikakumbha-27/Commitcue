import { useState } from 'react';
import logo from './assets/commitcue-logo.png.jpeg';
import Playground from './Playground';
import Tracker from './Tracker';
import ClassView from './ClassView';

export default function App() {
  const [tab, setTab] = useState('playground');
  return (
    <div className="app">
      <img src={logo} alt="CommitCue" style={{ width: 'min(90vw, 420px)' }} />
      <nav>
        <button className={tab === 'playground' ? 'on' : ''} onClick={() => setTab('playground')}>Playground</button>
        <button className={tab === 'tracker' ? 'on' : ''} onClick={() => setTab('tracker')}>Team Tracker</button>
        <button className={tab === 'class' ? 'on' : ''} onClick={() => setTab('class')}>Class View</button>
      </nav>
      {tab === 'playground' && <Playground />}
      {tab === 'tracker' && <Tracker />}
      {tab === 'class' && <ClassView />}
    </div>
  );
}