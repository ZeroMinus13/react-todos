import { getData } from '../api/actions';
import { DeleteButton, CheckboxHandler, SelectPriority } from './ClientSide';

async function TodosList() {
  const getDate = (date: Date) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(date);
  const todos = await getData();

  return (
    <ul className='flex flex-col gap-2 w-full'>
      {todos.map((todo) => (
        <li key={todo.id} className='flex flex-col gap-2 bg-yellow-900 w-full p-5'>
          <div className='flex flex-col justify-around items-center'>
            <div className='text-2xl'>{todo.title}</div>
            <div className='text-xl'> {todo.content}</div>
          </div>
          <div className='grid grid-cols-4 gap-2'>
            <div> {getDate(todo.dueDate!)}</div>
            <SelectPriority todo={todo} />
            <CheckboxHandler todo={todo} />
            <DeleteButton id={todo.id} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TodosList;
