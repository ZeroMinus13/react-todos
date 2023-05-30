'use client';
import { useState, useRef } from 'react';
import { createPost } from '../api/actions';

function Form({ defaultShow }: { defaultShow: boolean }) {
  const [show, setShow] = useState(defaultShow);
  const formRef = useRef<HTMLFormElement>(null);
  const formCSS =
    'block w-full p-2 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white';

  function handleForm(data: FormData) {
    createPost(data);
    formRef?.current?.reset();
    setShow(false);
  }

  return (
    <>
      <button
        onClick={() => setShow(!show)}
        className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium rounded-lg px-5 py-2.5'
        type='button'
      >
        {show ? '➕ Hide' : '➕ Add a Task'}
      </button>
      {!!show && (
        <form
          action={handleForm}
          ref={formRef}
          className='bg-black bg-opacity-70 w-5/6 backdrop-blur-sm rounded drop-shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-300 p-10'
        >
          <button
            type='button'
            className='p-2 text-red-600 hover:text-red-500 scale-150 fixed top-3 right-6'
            onClick={() => setShow(false)}
          >
            X
          </button>

          <div className='flex flex-col items-center p-5 gap-2 w-6/6'>
            <label className='font-bold text-2xl ' htmlFor='title'>
              Title
            </label>
            <input name='title' id='title' required maxLength={20} className={`${formCSS}`} />

            <label className='font-bold text-2xl' htmlFor='content'>
              Description
            </label>
            <input name='content' id='content' required maxLength={200} className={`${formCSS}`} />

            <span className='flex items-center'>
              <label className='font-bold text-xl p-5' htmlFor='check'>
                Completed
              </label>
              <input name='check' type={'checkbox'} id='check' className='w-4 h-4' />
            </span>

            <label htmlFor='dueDate' className='font-bold text-2xl'>
              Due Date
            </label>
            <input
              name='dueDate'
              type='date'
              id='dueDate'
              required
              className='bg-gray-700 text-white p-2'
              defaultValue={new Date().toISOString().split('T')[0]}
            />

            <label htmlFor='priority' className='font-bold text-2xl'>
              Priority
            </label>
            <select name='priority' id='priority' className='bg-gray-700 text-white p-2 w-40' defaultValue={'Medium'}>
              <option value='High'>High</option>
              <option value='Medium'>Medium</option>
              <option value='Low'>Low</option>
            </select>

            <button
              type='submit'
              className='text-white bg-sky-700 hover:bg-sky-600 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium rounded-lg px-5 py-2.5'
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default Form;
