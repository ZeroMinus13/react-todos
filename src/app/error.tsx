'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center min-h-screen bg-slate-600 p-5 text-white text-2xl'>
      <h2>Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium rounded-lg px-5 py-2.5'
      >
        Try again
      </button>
    </div>
  );
}
