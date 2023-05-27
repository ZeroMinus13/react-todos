'use client';
import { type todos as todotype } from '../../../database/schema';
import { getData, deleteSingle } from '../route/actions';
import { useEffect, useState } from 'react';
import { revalidatePath } from 'next/cache';
function TodosList() {
  const [todos, setTodos] = useState<todotype[]>([]);
  const [check, setCheck] = useState(false);
  useEffect(() => {
    async function fetchData() {
      const data = await getData();
      setTodos(data);
    }

    fetchData();
  }, []);
  const getDate = (date: Date) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(date);

  async function deletesingle(id: number) {
    await deleteSingle(id);
  }

  return (
    <ul className='flex flex-col gap-2 w-full'>
      {todos.map((todo) => (
        <li key={todo.id} className='flex flex-col gap-2 bg-yellow-900 w-full p-5'>
          <div className='flex flex-col justify-around items-center'>
            <div>{todo.title}</div>
            <div> {todo.content}</div>
          </div>
          <div className='grid grid-cols-4 gap-2'>
            <div> {getDate(todo.dueDate!)}</div>
            <div> {todo.priority}</div>
            <input type='checkbox' className='w-5' checked={todo.check || false} onChange={() => setCheck(!check)} />
            <button className='bg-red-500 text-white' onClick={() => deletesingle(todo.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TodosList;
