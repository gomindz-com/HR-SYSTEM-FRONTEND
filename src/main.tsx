import { createRoot } from "react-dom/client";
import RootApp from "./App.tsx";
import "./index.css";

// Mount the app
createRoot(document.getElementById("root")!).render(<RootApp />);

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", {
        updateViaCache: "none", // Always fetch the service worker from network
      })
      .then((registration) => {
        console.log("✅ Service Worker registered:", registration);

        // Handle service worker updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New service worker is available
                console.log("New service worker available");
                // Optionally show a notification to the user to refresh
                if (confirm("A new version is available. Refresh to update?")) {
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
  });
}
