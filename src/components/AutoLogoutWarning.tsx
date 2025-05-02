import React, { useState, useEffect } from "react";

interface AutoLogoutWarningProps {
  remainingTime: number;
  onStayActive: () => void;
}

const AutoLogoutWarning: React.FC<AutoLogoutWarningProps> = ({
  remainingTime,
  onStayActive,
}) => {
  const [countdown, setCountdown] = useState(Math.ceil(remainingTime / 1000));

  useEffect(() => {
    // Reset countdown when remainingTime changes
    setCountdown(Math.ceil(remainingTime / 1000));

    // Set up interval to update countdown every second
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Add event listener for ESC key
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onStayActive();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    // Cleanup interval and event listener on unmount or when remainingTime changes
    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [remainingTime, onStayActive]);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black bg-opacity-50' />

      {/* Modal */}
      <div className='relative w-[420px] p-8 bg-white rounded-2xl shadow-2xl border border-gray-200'>
        <div className='text-center'>
          <div className='text-xl font-semibold text-gray-800 mb-2'>
            Session Timeout Warning
          </div>

          <div className='text-gray-600 mb-6'>Your session will expire in</div>

          <div className='text-4xl font-bold text-red-600 mb-6 animate-pulse'>
            {countdown}s
          </div>

          <div className='text-sm text-gray-500'>
            Press ESC to continue your session
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoLogoutWarning;
