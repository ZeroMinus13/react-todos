import Form from './components/Form';
import TodosList from './components/TodosList';
import Loading from './loading';
import { Suspense } from 'react';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundry';

function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center bg-slate-600 p-5'>
      <ErrorBoundary>
        <Navbar />
        <Form defaultShow={false} />
        <Suspense fallback={<Loading />}>
          <TodosList />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
export default Home;
