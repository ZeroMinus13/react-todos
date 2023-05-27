import Form from './components/Form';
import ShowForm from './components/Hide';
import React from 'react';
import TodosList from './components/TodosList';

import { Suspense } from 'react';
function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-12 bg-slate-800 text-sky-300'>
      <h1>Todos</h1>
      <ShowForm>
        <Form />
      </ShowForm>
      <Suspense fallback={<div>Loading...</div>}>
        <TodosList />
      </Suspense>
    </main>
  );
}
export default Home;
