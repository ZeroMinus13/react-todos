import Form from './components/Form';
import ShowForm from './components/Hide';
import React from 'react';

function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-12 bg-slate-800 text-sky-300'>
      Todo
      <ShowForm>
        <Form />
      </ShowForm>
    </main>
  );
}
export default Home;
