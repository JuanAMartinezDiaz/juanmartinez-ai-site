import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

async function start() {
  const path = location.pathname.replace(/\/$/, '') || '/';
  const homepage = (path === '/' || path === '/index.html') && new URLSearchParams(location.search).get('view') !== 'decision-xray';
  const [{ default: Page }] = homepage
    ? await Promise.all([import('./Homepage.jsx'), import('./homepage.css')])
    : await Promise.all([import('./App.jsx'), import('./index.css')]);
  createRoot(document.getElementById('root')).render(<StrictMode><Page /></StrictMode>);
}
start();
