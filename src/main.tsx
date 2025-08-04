import { createRoot } from "react-dom/client";
import RootApp from "./App.tsx";
import "./index.css";

// Mount the app
createRoot(document.getElementById("root")!).render(<RootApp />);

// Register service worker for PWA with update handling
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
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
                // New content is available, reload the page
                window.location.reload();
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
