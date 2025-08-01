import { createRoot } from 'react-dom/client'
import RootApp from './App.tsx'
import './index.css'

// Mount the app
createRoot(document.getElementById("root")!).render(<RootApp />);

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("✅ Service Worker registered:", registration);
      })
      .catch((error) => {
        console.log("❌ Service Worker registration failed:", error);
      });
  });
}
