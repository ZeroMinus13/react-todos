import { getData } from '../api/actions';
import FilteredItems from './FilteredItems';

async function TodosList() {
  const todos = await getData();

  return (
    <div className='flex flex-col w-full p-3 justify-center items-center'>
      <ul className='flex flex-col gap-2 w-full p-3'>
        <FilteredItems todos={todos} />
      </ul>
    </div>
  );
}

export default TodosList;
