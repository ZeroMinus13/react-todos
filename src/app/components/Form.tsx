'use client';
import { useState, useRef } from 'react';
import { createPost } from '../api/actions';

function Form() {
  const [formdata, setformData] = useState({ title: '', content: '', dueDate: '', priority: '', check: false });
  const formRef = useRef(null);
  function handleForm(data: FormData) {
    createPost(data);
  }

  return (
    <form
      action={handleForm}
      ref={formRef}
      className='p-20 w-full flex flex-col items-center justify-center bg-slate-600'
    >
      {/* <button type='button' className='p-2 text-red-600 top-10 ml-80 hover:bg-red-200 absolute scale-150'>
        X
      </button> */}
      <label className='font-bold text-l' htmlFor='title'>
        Title
      </label>
      <input name='title' id='title' required maxLength={20} />

      <label className='font-bold text-l' htmlFor='content'>
        Description
      </label>
      <input name='content' id='content' />
      <div>
        <label className='font-bold text-l p-5' htmlFor='check'>
          Completed
        </label>
        <input name='check' type={'checkbox'} id='check' />
      </div>
      <label htmlFor='dueDate'>Due Date</label>
      <input name='dueDate' type='date' id='dueDate' required />

      <label htmlFor='priority'>Priority</label>

      <select name='priority' id='priority'>
        <option value='High'>High</option>
        <option value='Medium'>Medium</option>
        <option value='Low'>Low</option>
      </select>

      <button type='submit' className='p-2 disabled:opacity-40 bg-sky-900'>
        Submit
      </button>
    </form>
  );
}

export default Form;
