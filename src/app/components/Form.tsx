'use client';
function Form() {
  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    console.log();
  }
  return (
    <form className='p-10 flex flex-col items-center justify-center w-52 '>
      <button className='p-2 text-red-600 top-10 ml-80 hover:bg-red-200 absolute scale-150'></button>
      <label className='font-bold text-l'>Title</label>
      <input name='title' onChange={(e) => handleChange(e)} />

      <label className='font-bold text-l'>Description</label>
      <input name='details' onChange={(e) => handleChange(e)} />

      <label className='font-bold text-l'>Due Date</label>
      <input name='date' onChange={(e) => handleChange(e)} type={'date'} />

      <label className='font-bold text-l p-5'>Done</label>
      <input name='check' onChange={(e) => handleChange(e)} type={'checkbox'} />

      <button className='block disabled:opacity-40'>Submit</button>
    </form>
  );
}

export default Form;
