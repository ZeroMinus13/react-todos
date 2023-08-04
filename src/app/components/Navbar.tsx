'use client';
import { useSession, signOut, signIn } from 'next-auth/react';
import Image from 'next/image';
import clsx from 'clsx';

export default function Navbar() {
  const { data: session } = useSession();
  let btnCss =
    'block text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium rounded-lg px-5 py-2.5 mb-2';
  return (
    <nav className='sm:w-1/2 flex border-b-2 border-blue-500'>
      {!!session?.user ? (
        <div className='flex w-screen justify-between '>
          {session?.user?.image && (
            <div className='flex items-center gap-2'>
              <Image
                src={session.user.image}
                alt={session.user?.name ?? 'User Image.'}
                width={40}
                height={40}
                className='inline rounded-full'
              />
              <p className='font-bold text-white tracking-wider'>{session.user.name}</p>
            </div>
          )}
          <button className={clsx(btnCss, 'bg-red-500/80 text-gray-100')} onClick={() => signOut()}>
            Sign out &#187;
          </button>
        </div>
      ) : (
        <div className='w-screen flex justify-end'>
          <button className={clsx(btnCss)} onClick={() => signIn()}>
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
}
