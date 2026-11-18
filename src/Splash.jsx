import { useEffect } from 'react';
import logo from './assets/commitcue-logo.png.jpeg';

export default function Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0b0720' }}>
      <img src={logo} alt="CommitCue" style={{ width: 'min(90vw, 480px)' }} />
    </div>
  );
}