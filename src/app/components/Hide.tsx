'use client';
import { useState } from 'react';

function ShowForm({ children }: { children: React.ReactNode }) {
  const [isHidden, setIsHidden] = useState(false);
  return (
    <div className='flex flex-col'>
      {!!isHidden && children}
      <button onClick={() => setIsHidden(!isHidden)}>{isHidden ? 'Show' : 'Hide'} Content</button>
    </div>
  );
}

export default ShowForm;
