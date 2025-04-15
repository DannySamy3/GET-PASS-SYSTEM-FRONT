import React from "react";

interface AutoLogoutWarningProps {
  remainingTime: number;
  onStayActive: () => void;
}

const AutoLogoutWarning: React.FC<AutoLogoutWarningProps> = ({
  remainingTime,
  onStayActive,
}) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black bg-opacity-50' />

      {/* Modal */}
      <div className='relative w-[420px] p-6 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col items-center gap-4'>
        <div className='text-xl font-semibold text-red-600'>
          Auto-Logout Warning
        </div>

        <div className='text-center text-gray-700 mt-2'>
          <p>You will be logged out due to inactivity in</p>
          <p className='text-2xl font-bold text-red-600 mt-2'>
            {Math.ceil(remainingTime / 1000)} seconds
          </p>
        </div>

        <button
          onClick={onStayActive}
          className='mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          Stay Active
        </button>
      </div>
    </div>
  );
};

export default AutoLogoutWarning;
