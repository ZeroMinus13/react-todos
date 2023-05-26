import Form from './components/Form';
import ShowForm from './components/Hide';
import React, { use } from 'react';
import db from '../../database/db';
import todoSchema from '../../database/schema';

function Home() {
  const data = use(db.select().from(todoSchema));
  console.log(data);
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
