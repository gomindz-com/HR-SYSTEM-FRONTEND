import { createRoot } from "react-dom/client";
import RootApp from "./App.tsx";
import "./index.css";

// Mount the app
createRoot(document.getElementById("root")!).render(<RootApp />);

// Track update notification state
let updateNotificationShown = false;

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
                navigator.serviceWorker.controller &&
                !updateNotificationShown
              ) {
                // New service worker is available
                console.log("New service worker available");
                updateNotificationShown = true;

                // Create mobile-friendly update notification
                showUpdateNotification();
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

// Mobile-friendly update notification
function showUpdateNotification() {
  // Check if notification already exists
  if (document.getElementById("update-notification")) {
    return;
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.id = "update-notification";
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #3b82f6;
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      max-width: 90vw;
      text-align: center;
      display: flex;
      align-items: center;
      gap: 12px;
    ">
      <span>🔄 New version available</span>
      <button onclick="handleUpdate()" style="
        background: white;
        color: #3b82f6;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        font-size: 13px;
        white-space: nowrap;
      ">Update Now</button>
      <button onclick="handleDismiss()" style="
        background: transparent;
        color: white;
        border: 1px solid rgba(255,255,255,0.3);
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        white-space: nowrap;
      ">Later</button>
    </div>
  `;

  // Add to page
  document.body.appendChild(notification);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 10000);
}

// Handle update button click
function handleUpdate() {
  const notification = document.getElementById("update-notification");
  if (notification) {
    notification.remove();
  }
  window.location.reload();
}

// Handle dismiss button click
function handleDismiss() {
  const notification = document.getElementById("update-notification");
  if (notification) {
    notification.remove();
  }
  // Reset the flag after a delay so it can show again for future updates
  setTimeout(() => {
    updateNotificationShown = false;
  }, 30000); // 30 seconds delay
}

// Make functions globally available for onclick handlers
(window as any).handleUpdate = handleUpdate;
(window as any).handleDismiss = handleDismiss;
