import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-slate-600 p-5 text-white text-2xl'>
      <h2 className='text-3xl'>Not Found 404!</h2>
      <p>Could not find requested resource</p>
      <p className='mt-5 visited:bg-sky-200'>
        View{' '}
        <Link href='/' className='text-blue-400 hover:underline'>
          Main Page
        </Link>
      </p>
    </div>
  );
}
