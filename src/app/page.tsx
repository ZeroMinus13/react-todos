import Form from './components/Form';
import TodosList from './components/TodosList';
import Loading from './loading';
import { Suspense } from 'react';
import { getData } from './api/actions';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundry';
async function Home() {
  const users = await getData();

  return (
    <main className='flex min-h-screen flex-col items-center bg-slate-600 p-5'>
      <ErrorBoundary>
        <Navbar />
        <Form defaultShow={false} />
        <Suspense fallback={<Loading />}>
          <TodosList users={users} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
export default Home;
