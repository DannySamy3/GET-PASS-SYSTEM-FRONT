import { AppDispatch } from "./store";
import { logout } from "./authenticatorSlice";

let warningCallback: ((show: boolean, remainingTime: number) => void) | null =
  null;
let lastActivityTime: number = Date.now();
let isWarningShown: boolean = false;
let inactivityCheckInterval: NodeJS.Timeout | null = null;

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
const WARNING_BEFORE_LOGOUT = 30 * 1000; // Show warning 30 seconds before logout

// Function to reset all auto-logout state
const resetAutoLogoutState = () => {
  lastActivityTime = Date.now();
  isWarningShown = false;
  if (inactivityCheckInterval) {
    clearInterval(inactivityCheckInterval);
    inactivityCheckInterval = null;
  }
  if (warningCallback) {
    warningCallback(false, 0);
  }
};

export const setupAutoLogout = (
  dispatch: AppDispatch,
  onShowWarning: (show: boolean, remainingTime: number) => void
) => {
  // Reset state when setting up auto-logout
  resetAutoLogoutState();
  warningCallback = onShowWarning;

  // Function to update last activity time
  const updateActivityTime = () => {
    lastActivityTime = Date.now();
  };

  // Add event listeners for user activity
  const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
  events.forEach((event) => {
    window.addEventListener(event, updateActivityTime);
  });

  // Check for inactivity periodically
  const checkInactivity = () => {
    const currentTime = Date.now();
    const timeSinceLastActivity = currentTime - lastActivityTime;

    if (
      timeSinceLastActivity >= INACTIVITY_TIMEOUT - WARNING_BEFORE_LOGOUT &&
      !isWarningShown
    ) {
      // Show warning when reaching warning time
      isWarningShown = true;
      warningCallback?.(true, WARNING_BEFORE_LOGOUT);
    } else if (timeSinceLastActivity >= INACTIVITY_TIMEOUT && isWarningShown) {
      // Logout when reaching full timeout
      isWarningShown = false;
      warningCallback?.(false, 0);
      // Dispatch logout without showing toast
      dispatch({ type: "authenticator/logout", payload: { silent: true } });
    }
  };

  // Start checking for inactivity every second
  inactivityCheckInterval = setInterval(checkInactivity, 1000);

  // Cleanup function to remove event listeners
  return () => {
    if (inactivityCheckInterval) {
      clearInterval(inactivityCheckInterval);
      inactivityCheckInterval = null;
    }
    warningCallback?.(false, 0);
    events.forEach((event) => {
      window.removeEventListener(event, updateActivityTime);
    });
    warningCallback = null;
    isWarningShown = false;
  };
};

// Function to manually reset the timers (called by the Stay Active button)
export const resetAutoLogout = () => {
  if (warningCallback) {
    warningCallback(false, 0);
    lastActivityTime = Date.now(); // Reset the last activity time
    isWarningShown = false; // Reset warning state
  }
};
