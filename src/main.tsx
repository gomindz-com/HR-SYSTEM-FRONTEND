import { createRoot } from "react-dom/client";
import RootApp from "./App.tsx";
import "./index.css";

// Mount the app
createRoot(document.getElementById("root")!).render(<RootApp />);

// Service worker registration disabled to prevent caching issues
// If you need PWA features in the future, uncomment and configure properly
/*
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Check if there are any existing service workers first
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      // If there are existing registrations, unregister them first
      if (registrations.length > 0) {
        console.log("Found existing service workers, unregistering...");
        Promise.all(registrations.map(reg => reg.unregister())).then(() => {
          console.log("All existing service workers unregistered");
          // Now register the new one
          registerNewServiceWorker();
        });
      } else {
        // No existing service workers, register new one
        registerNewServiceWorker();
      }
    });
  });
}

function registerNewServiceWorker() {
  navigator.serviceWorker
    .register("/sw.js", {
      updateViaCache: 'none' // Always fetch the service worker from network
    })
    .then((registration) => {
      console.log("✅ Service Worker registered:", registration);
      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is available
              console.log('New service worker available');
              // Optionally show a notification to the user to refresh
              if (confirm('A new version is available. Refresh to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });
    })
    .catch((error) => {
      console.log("❌ Service Worker registration failed:", error);
    });
}
*/
