'use client';
import { type todos } from '../../../database/schema';
import { deleteSingle, updateCheckbox, updatePriority } from '../api/actions';

function DeleteButton({ id }: { id: number }) {
  return (
    <button
      className='bg-red-500 text-white hover:bg-red-800 w-40 p-1 bold transition-transform hover:scale-110'
      onClick={() => deleteSingle(id)}
    >
      Delete
    </button>
  );
}

function CheckboxHandler({ todo }: { todo: todos }) {
  return (
    <input
      type='checkbox'
      checked={todo.check!}
      onChange={() => updateCheckbox(todo.id, todo.check!)}
      name='check'
      className='w-5 h-5 cursor-pointer'
    />
  );
}

function SelectPriority({ todo }: { todo: todos }) {
  return (
    <select
      name='priority'
      onChange={(e) => updatePriority(todo.id, e.target.value as todos['priority'])}
      value={todo.priority!}
      className='block  p-2 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white cursor-pointer '
    >
      <option value='High'>High</option>
      <option value='Medium'>Medium</option>
      <option value='Low'>Low</option>
    </select>
  );
}

export { DeleteButton, CheckboxHandler, SelectPriority };
