import { useState } from 'react';
import logo from './assets/commitcue-logo.png.jpeg';
import Splash from './Splash';
import RoleSelect from './RoleSelect';
import Playground from './Playground';
import Tracker from './Tracker';
import ClassView from './ClassView';

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('playground');

  if (screen === 'splash') {
    return <Splash onDone={() => setScreen('role')} />;
  }

  if (screen === 'role') {
    return <RoleSelect onDone={(u) => { setUser(u); setScreen('main'); }} />;
  }

  return (
    <div className="app">
      <img src={logo} alt="CommitCue" style={{ width: 160, borderRadius: 12, marginBottom: 12 }} />
      <p className="muted">Hi {user.name} ({user.role})</p>
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