import { AppDispatch } from "./store";
import { logout } from "./authenticatorSlice";

let inactivityTimer: NodeJS.Timeout;
let warningTimer: NodeJS.Timeout;
let warningCallback: ((show: boolean, remainingTime: number) => void) | null =
  null;

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
const WARNING_BEFORE_LOGOUT = 30 * 1000; // Show warning 30 seconds before logout

export const setupAutoLogout = (
  dispatch: AppDispatch,
  onShowWarning: (show: boolean, remainingTime: number) => void
) => {
  warningCallback = onShowWarning;

  // Reset both timers on any user activity
  const resetTimers = () => {
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);
    warningCallback?.(false, 0); // Hide warning if shown

    // Set warning timer
    warningTimer = setTimeout(() => {
      warningCallback?.(true, WARNING_BEFORE_LOGOUT);

      // Set final logout timer
      inactivityTimer = setTimeout(() => {
        warningCallback?.(false, 0);
        dispatch(logout());
      }, WARNING_BEFORE_LOGOUT);
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE_LOGOUT);
  };

  // Add event listeners for user activity
  const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
  events.forEach((event) => {
    window.addEventListener(event, resetTimers);
  });

  // Handle app closure
  window.addEventListener("beforeunload", () => {
    dispatch(logout());
  });

  // Start the initial timers
  resetTimers();

  // Cleanup function to remove event listeners
  return () => {
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);
    warningCallback?.(false, 0);
    events.forEach((event) => {
      window.removeEventListener(event, resetTimers);
    });
    warningCallback = null;
  };
};
