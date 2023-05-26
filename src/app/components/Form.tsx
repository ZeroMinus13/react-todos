'use client';
import { useState } from 'react';
import { createPost } from '../route';

function Form() {
  const [formdata, setformData] = useState({ title: '', content: '', date: '', check: false });

  function handleForm(data: FormData) {
    createPost(data);
  }

  return (
    <form action={handleForm} className='p-20 flex flex-col items-center justify-center w-52 bg-slate-100'>
      <button className='p-2 text-red-600 top-10 ml-80 hover:bg-red-200 absolute scale-150'></button>
      <label className='font-bold text-l'>Title</label>
      <input name='title' defaultValue={formdata.title} />

      <label className='font-bold text-l'>Description</label>
      <input name='content' defaultValue={formdata.content} />

      <label className='font-bold text-l p-5'>Done</label>
      <input
        name='check'
        type={'checkbox'}
        value={formdata.check}
        onChange={() => setformData({ ...formdata, check: !formdata.check })}
      />

      <button type='submit' className='block disabled:opacity-40'>
        Submit
      </button>
    </form>
  );
}

export default Form;
