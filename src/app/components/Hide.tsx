'use client';
import { useState } from 'react';

function ShowForm({ children }: { children: React.ReactNode }) {
  const [isHidden, setIsHidden] = useState(true);
  return (
    <div className='flex flex-row'>
      {!!isHidden && children}
      <button onClick={() => setIsHidden(!isHidden)} className='p-2 bg-sky-500'>
        {isHidden ? 'Show' : 'Hide'} Content
      </button>
    </div>
  );
}

export default ShowForm;
