import Form from './components/Form';
import React from 'react';
import TodosList from './components/TodosList';
import Loading from './loading';
import { Suspense } from 'react';
import { getData } from './api/actions';

async function Home() {
  const todos = await getData();

  return (
    <main className='flex min-h-screen flex-col items-center bg-slate-600 p-5'>
      <Form defaultShow={false} />
      <Suspense fallback={<Loading />}>
        <TodosList todos={todos} />
      </Suspense>
    </main>
  );
}
export default Home;
