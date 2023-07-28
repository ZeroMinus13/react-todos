'use client';
import { useState, useMemo } from 'react';
import { DeleteButton, CheckboxHandler, SelectPriority, ChangeSelectedTodos } from './ClientSide';
import { type todos } from '../../../database/schema';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { getData } from '../api/actions';
import { creationDate, getDate } from '../libs/help';
import { deleteSingle, serverCheckBox, serverPriority } from '../api/actions';
import Loading from './Loading';
import { clsx } from 'clsx';

async function fetchData() {
  return await getData();
}

function FilteredItems({ todos }: { todos: todos[] }) {
  const [search, setSearch] = useState('');
  const [selectedPriority, setselectedPriority] = useState('');
  const [selectedCheck, setselectedCheck] = useState('');
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchData,
    initialData: todos,
  });

  const { mutate: updateCheckbox } = useMutation({
    mutationFn: ({ id, bool }: { id: number; bool: boolean }) => serverCheckBox(id, bool),
    onMutate: ({ id, bool }) => console.log(id, bool),
    onSuccess: () => {
      setLoadingTodos([]);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const { mutate: updatePriority } = useMutation({
    mutationFn: ({ id, value }: { id: number; value: any }) => serverPriority(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const { mutate: deleteTodo } = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteSingle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const filteredItems = useMemo(() => {
    const lowerSearch = (i: string) => i.toLowerCase().includes(search.toLowerCase());
    return data
      .filter((item) => lowerSearch(item.title) || (item.content && lowerSearch(item.content)))
      .filter((item) => (selectedPriority ? item.priority === selectedPriority : 'true'))
      .filter((item) => (selectedCheck ? item?.check?.toString() == selectedCheck : true));
  }, [data, search, selectedPriority, selectedCheck]);

  return (
    <div className='flex flex-col gap-2 container mx-auto w-full'>
      <input
        type='text'
        placeholder='Search'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='block w-full p-4 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white'
        name='search'
      />

      <span className='text-gray-100 text-center text-2xl'>Total Todos: {filteredItems.length}</span>
      <ChangeSelectedTodos
        priority={selectedPriority}
        setPriority={setselectedPriority}
        check={selectedCheck}
        setCheck={setselectedCheck}
      />

      {filteredItems.length > 0
        ? filteredItems.map((todo: todos) => {
            const isTodoLoading = loadingTodos.includes(todo.id);
            return (
              <div
                key={todo.id}
                className={`flex flex-col gap-2 bg-slate-800 w-full text-gray-100 container mx-auto hover:bg-slate-900 `}
              >
                <button
                  className={clsx(
                    'flex flex-col justify-around items-center p-5 cursor-pointer',
                    todo.check && 'bg-slate-500 opacity-50 line-through'
                  )}
                  onClick={() => {
                    setLoadingTodos((prev) => [...prev, todo.id]);
                    updateCheckbox({ id: todo.id, bool: todo.check! });
                  }}
                  disabled={isTodoLoading}
                >
                  <div className='text-2xl'>{todo.title}</div>
                  {!isTodoLoading ? <div className='text-xl'> {todo.content}</div> : <Loading />}
                </button>
                <div className='md:grid md:grid-cols-4 md:justify-items-center gap-2 container mx-auto flex flex-col items-center bg-slate-950 w-full p-2'>
                  <div>
                    <code className='italic text-sm'>DueDate: {getDate(todo.dueDate!)}</code>
                    <div className='italic text-sm'>Created: {creationDate(todo.createdAt!)}</div>
                  </div>
                  <SelectPriority todo={todo} />
                  <CheckboxHandler todo={todo} updateCheckbox={updateCheckbox} setLoadingTodos={setLoadingTodos} />
                  <DeleteButton id={todo.id} deleteTodo={deleteTodo} />
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
}
export default FilteredItems;
