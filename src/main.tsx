/// <reference types="vite-plugin-pwa/client" />

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// ✅ Register the service worker
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    // Optional: show a prompt to the user
    console.log('New content available, please refresh.');
  },
  onOfflineReady() {
    console.log('App is ready to work offline');
  },
});

createRoot(document.getElementById("root")!).render(<App />);
