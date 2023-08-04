'use client';
import { UseMutateFunction } from '@tanstack/react-query/build/lib/types';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { Todo } from '@prisma/client';

export function DeleteButton({ id, deleteTodo }: Deletebutton) {
  return (
    <button
      className='bg-red-500 text-white hover:bg-red-800 p-2 px-5 rounded-lg bold transition-transform hover:scale-110'
      onClick={() => deleteTodo({ id })}
    >
      Delete
    </button>
  );
}

export function CheckboxHandler({ todo, updateCheckbox }: Checkbox) {
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

export function SelectPriority({ todo, updatePriority }: updatePriority) {
  return (
    <select
      name='priority'
      onChange={(e) => updatePriority({ id: todo.id, priority: e.target.value as string })}
      value={todo.priority!}
      className='w-fit p-2 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white cursor-pointer '
    >
      <option value='High'>High</option>
      <option value='Medium'>Medium</option>
      <option value='Low'>Low</option>
    </select>
  );
}

export function ChangeSelectedTodos({
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
    <div className='flex md:flex-row flex-col justify-around justify-items-center items-center text-center gap-2'>
      <div>
        <label htmlFor='priority' className='text-white'>
          Priority{' '}
          <select
            onChange={(e) => setPriority(e.target.value)}
            value={priority}
            id='priority'
            className=' p-2 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white cursor-pointer '
          >
            <option value=''>All</option>
            <option value='High'>High</option>
            <option value='Medium'>Medium</option>
            <option value='Low'>Low</option>
          </select>{' '}
        </label>
      </div>
      <div>
        <label htmlFor='check' className='text-white'>
          Completed{' '}
          <select
            onChange={(e) => setCheck(e.target.value)}
            value={check}
            id='check'
            className='p-2 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white cursor-pointer '
          >
            <option value=''>All</option>
            <option value='true'>Completed</option>
            <option value='false'>Need to Complete</option>
          </select>{' '}
        </label>
      </div>
    </div>
  );
}
export function Todotitle({ todo, updateCheckbox }: Todotitle) {
  const [classNames, setClassNames] = useState('flex flex-col justify-around items-center py-5');

  useEffect(() => {
    setClassNames(
      clsx('flex flex-col justify-around items-center py-5 cursor-pointer', todo.check && 'line-through opacity-50')
    );
  }, [todo.check]);

  return (
    <div className={classNames} onClick={() => updateCheckbox({ id: todo.id, bool: todo.check! })}>
      <p className='text-2xl'>{todo.title}</p>
      <p className='sm:text-xl '> {todo.content}</p>
    </div>
  );
}

type TSMutate<T> = UseMutateFunction<void, unknown, T, unknown>;

type TSMutate2<T> = UseMutateFunction<void, unknown, T, { previousTodos: unknown }>;

type Checkbox = {
  todo: any;
  updateCheckbox: TSMutate2<{ id: number; bool: boolean }>;
};

type Deletebutton = {
  id: number;
  deleteTodo: TSMutate<{ id: number }>;
};

type updatePriority = {
  todo: any;
  updatePriority: TSMutate<{ id: number; priority: string }>;
};

type Todotitle = {
  todo: Todo;
  updateCheckbox: TSMutate2<{ id: number; bool: boolean }>;
};
