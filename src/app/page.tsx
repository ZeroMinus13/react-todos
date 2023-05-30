import Form from './components/Form';
import React from 'react';
import TodosList from './components/TodosList';
import Loading from './loading';
import { Suspense } from 'react';

function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center bg-slate-600 p-5'>
      <Form defaultShow={false} />
      <Suspense fallback={<Loading />}>
        {/* @ts-ignore */}
        <TodosList />
      </Suspense>
    </main>
  );
}
export default Home;
