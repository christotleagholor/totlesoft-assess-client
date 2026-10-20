import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds) {
  if (seconds === null || seconds === undefined) return "00:00";
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// Get token and user info from URL (Passed from main site)
export function getSessionFromURL() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const projectId = params.get("projectId");
  const userId = params.get("userId");

  // ✅ If a token is provided in the URL, this is a FRESH handoff from the main site.
  // Wipe any old session data first to prevent stale data conflicts.
  if (token) {
    sessionStorage.clear(); // <-- Clears all old assessment data
    
    sessionStorage.setItem("assess_token", token);
    sessionStorage.setItem("assess_projectId", projectId);
    sessionStorage.setItem("assess_userId", userId);
    
    // Clean URL so it looks professional
    window.history.replaceState({}, document.title, "/sso");
    
    return { token, projectId, userId };
  }

  // Fallback for page refreshes inside the assessment portal
  return {
    token: sessionStorage.getItem("assess_token"),
    projectId: sessionStorage.getItem("assess_projectId"),
    userId: sessionStorage.getItem("assess_userId"),
  };
}