import { useState } from 'react';
import Splash from './Splash';
import RoleSelect from './RoleSelect';
import Dashboard from './Dashboard';
import Playground from './Playground';
import Tracker from './Tracker';
import ClassView from './ClassView';

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [user, setUser] = useState(null);
  const [feature, setFeature] = useState('');

  if (screen === 'splash') {
    return <Splash onDone={() => setScreen('role')} />;
  }

  if (screen === 'role') {
    return <RoleSelect onDone={(u) => { setUser(u); setScreen('dashboard'); }} />;
  }

  if (screen === 'dashboard') {
    return (
      <Dashboard
        user={user}
        onOpen={(id) => { setFeature(id); setScreen('feature'); }}
        onLogout={() => { setUser(null); setScreen('role'); }}
      />
    );
  }

  return (
    <div className="app">
      <button onClick={() => setScreen('dashboard')}>← Back to dashboard</button>
      {feature === 'playground' && <Playground />}
      {feature === 'tracker' && <Tracker />}
      {feature === 'class' && <ClassView />}
    </div>
  );
}