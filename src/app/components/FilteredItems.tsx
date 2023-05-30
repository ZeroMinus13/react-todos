'use client';
import { useState, useMemo } from 'react';
import { DeleteButton, CheckboxHandler, SelectPriority } from './ClientSide';
import { type todos } from '../../../database/schema';
import { updateCheckbox } from '../api/actions';

function FilteredItems({ todos }: { todos: todos[] }) {
  const [search, setSearch] = useState('');

  const getDate = (date: Date) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(date);

  const filteredItems = useMemo((): todos[] => {
    return todos.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.content && item.content.toLowerCase().includes(search.toLowerCase()))
    );
  }, [todos, search]);

  return (
    <div className='flex flex-col gap-2 container mx-auto w-full'>
      <input
        type='text'
        placeholder='Search'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='block w-full p-4 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white'
      />
      {filteredItems.length > 0
        ? filteredItems.map((todo) => (
            <li
              key={todo.id}
              className={`flex flex-col gap-2 bg-slate-800 w-full text-gray-100 container mx-auto hover:bg-slate-900 `}
              onClick={() => updateCheckbox(todo.id, todo.check!)}
            >
              <div
                className={`flex flex-col justify-around items-center p-5 cursor-pointer ${
                  todo.check ? 'bg-slate-500 line-through' : ''
                }`}
              >
                <div className='text-2xl'>{todo.title}</div>
                <div className='text-xl'> {todo.content}</div>
              </div>
              <div className='md:grid md:grid-cols-4 md:justify-items-center gap-2 container mx-auto flex flex-col items-center bg-slate-950 w-full p-2'>
                <div className='italic text-sm'> {getDate(todo.dueDate!)}</div>
                <SelectPriority todo={todo} />
                <CheckboxHandler todo={todo} />
                <DeleteButton id={todo.id} />
              </div>
            </li>
          ))
        : null}
    </div>
  );
}
export default FilteredItems;
