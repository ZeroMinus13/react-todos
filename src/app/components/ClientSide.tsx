'use client';
import { type todos } from '../../../database/schema';
import { deleteSingle, updateCheckbox, updatePriority } from '../api/actions';

function DeleteButton({ id }: { id: number }) {
  return (
    <button className='bg-sky-500 text-white hover:bg-red-700' onClick={() => deleteSingle(id)}>
      Delete
    </button>
  );
}

function CheckboxHandler({ todo }: { todo: todos }) {
  return (
    <input type='checkbox' checked={todo.check!} onChange={() => updateCheckbox(todo.id, todo.check!)} name='check' />
  );
}

function SelectPriority({ todo }: { todo: todos }) {
  return (
    <select
      name='priority'
      onChange={(e) => updatePriority(todo.id, e.target.value as todos['priority'])}
      value={todo.priority!}
    >
      <option value='High'>High</option>
      <option value='Medium'>Medium</option>
      <option value='Low'>Low</option>
    </select>
  );
}

export { DeleteButton, CheckboxHandler, SelectPriority };
