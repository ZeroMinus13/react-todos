'use client';
import { useState, useRef } from 'react';
import { createPost } from '../route/actions';

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
      <button className='p-2 text-red-600 top-10 ml-80 hover:bg-red-200 absolute scale-150'></button>
      <label className='font-bold text-l'>Title</label>
      <input name='title' required />

      <label className='font-bold text-l'>Description</label>
      <input name='content' />

      <label className='font-bold text-l p-5'>Done</label>
      <input name='check' type={'checkbox'} />
      <label htmlFor='dueDate'>Due Date</label>
      <input name='dueDate' type='date' required />

      <label htmlFor='priority'>Priority</label>

      <select name='priority' id='priority'>
        <option value='High'>High</option>
        <option value='Medium'>Medium</option>
        <option value='Low'>Low</option>
      </select>

      <button type='submit' className='block disabled:opacity-40'>
        Submit
      </button>
    </form>
  );
}

export default Form;
