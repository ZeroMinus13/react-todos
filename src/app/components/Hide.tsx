'use client';
import { useState } from 'react';

function ShowForm({ children }: { children: React.ReactNode }) {
  const [isHidden, setIsHidden] = useState(false);
  return (
    <div className='mr-9 '>
      <button
        onClick={() => setIsHidden(!isHidden)}
        className='px-5 py-2 bg-sky-500 flex justify-center items-center rounded-md'
      >
        {isHidden ? '➕ Add a task' : '➕ Hide'}
      </button>
      {!!isHidden && children}
    </div>
  );
}

export default ShowForm;
