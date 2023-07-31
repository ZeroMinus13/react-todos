import Form from './components/Form';
import TodosList from './components/TodosList';
import Loading from './loading';
import { Suspense } from 'react';
import { getData } from './api/actions';
import Navbar from './components/Navbar';

async function Home() {
  const users = await getData();

  return (
    <main className='flex min-h-screen flex-col items-center bg-slate-600 p-5'>
      <Navbar />
      <Form defaultShow={false} />
      <Suspense fallback={<Loading />}>
        <TodosList users={users} />
      </Suspense>
    </main>
  );
}
export default Home;
