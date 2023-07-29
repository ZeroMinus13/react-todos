'use client';
import { UseMutateFunction } from '@tanstack/react-query/build/lib/types';
import { type todos } from '../../../database/schema';

function DeleteButton({ id, deleteTodo }: Deletebutton) {
  return (
    <button
      className='bg-red-500 text-white hover:bg-red-800 sm:w-40 p-2 px-3 rounded-lg bold transition-transform hover:scale-110'
      onClick={() => deleteTodo({ id })}
    >
      Delete
    </button>
  );
}

function CheckboxHandler({ todo, updateCheckbox }: Checkbox) {
  return (
    <input
      type='checkbox'
      checked={todo.check!}
      onChange={() => updateCheckbox({ id: todo.id, bool: todo.check! })}
      name='check'
      className='w-5 h-5 cursor-pointer'
    />
  );
}

function SelectPriority({ todo, updatePriority }: updatePriority) {
  return (
    <select
      name='priority'
      onChange={(e) => updatePriority({ id: todo.id, priority: e.target.value as todos['priority'] })}
      value={todo.priority!}
      className='w-fit p-3 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white cursor-pointer '
    >
      <option value='High'>High</option>
      <option value='Medium'>Medium</option>
      <option value='Low'>Low</option>
    </select>
  );
}

function ChangeSelectedTodos({
  priority,
  setPriority,
  check,
  setCheck,
}: {
  priority: string;
  setPriority: (priority: string) => void;
  check: string;
  setCheck: (check: string) => void;
}) {
  return (
    <div className='flex md:flex-row flex-col justify-around justify-items-center items-center'>
      <div>
        <label htmlFor='priority' className='text-white'>
          Select Priority :{' '}
        </label>
        <select
          onChange={(e) => setPriority(e.target.value)}
          value={priority}
          id='priority'
          className='block  p-2 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white cursor-pointer '
        >
          <option value=''>All</option>
          <option value='High'>High</option>
          <option value='Medium'>Medium</option>
          <option value='Low'>Low</option>
        </select>
      </div>
      <div>
        <label htmlFor='check' className='text-white'>
          Select Completed :{' '}
        </label>
        <select
          onChange={(e) => setCheck(e.target.value)}
          value={check}
          id='check'
          className='block p-2 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white cursor-pointer '
        >
          <option value=''>All</option>
          <option value='true'>Completed</option>
          <option value='false'>Need to Complete</option>
        </select>
      </div>
    </div>
  );
}
type TSMutate<T> = UseMutateFunction<void, unknown, T, unknown>;

type TSMutate2<T> = UseMutateFunction<void, unknown, T, { previousTodos: unknown }>;

type Checkbox = {
  todo: todos;
  updateCheckbox: TSMutate2<{ id: number; bool: boolean }>;
};

type Deletebutton = {
  id: number;
  deleteTodo: TSMutate<{ id: number }>;
};

type updatePriority = {
  todo: todos;
  updatePriority: TSMutate<{ id: number; priority: todos['priority'] }>;
};
export { DeleteButton, CheckboxHandler, SelectPriority, ChangeSelectedTodos };
