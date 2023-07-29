'use client';
import { useState, useMemo } from 'react';
import { DeleteButton, CheckboxHandler, SelectPriority, ChangeSelectedTodos } from './ClientSide';
import { type todos } from '../../../database/schema';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { getData } from '../api/actions';
import { deleteSingle, serverCheckBox, serverPriority } from '../api/actions';
import { clsx } from 'clsx';

async function fetchData() {
  return await getData();
}

function FilteredItems({ todos }: { todos: todos[] }) {
  const [search, setSearch] = useState('');
  const [selectedPriority, setselectedPriority] = useState('');
  const [selectedCheck, setselectedCheck] = useState('');

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchData,
    initialData: todos,
  });

  const { mutate: updateCheckbox } = useMutation({
    mutationFn: ({ id, bool }: { id: number; bool: boolean }) => serverCheckBox(id, bool),
    onMutate: async ({ id, bool }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData(['todos']);
      queryClient.setQueryData<todos[] | undefined>(['todos'], (oldData) => {
        return (oldData ?? []).map((todo) => (todo.id === id ? { ...todo, check: !bool } : todo));
      });
      return { previousTodos };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const { mutate: updatePriority } = useMutation({
    mutationFn: ({ id, priority }: { id: number; priority: todos['priority'] }) => serverPriority(id, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onMutate: async ({ id, priority }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData(['todos']);
      queryClient.setQueryData<todos[] | undefined>(['todos'], (oldData) => {
        return (oldData ?? []).map((todo) => (todo.id === id ? { ...todo, priority } : todo));
      });
      return { previousTodos };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const { mutate: deleteTodo } = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteSingle(id),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData(['todos']);
      queryClient.setQueryData<todos[] | undefined>(['todos'], (oldData) => {
        return (oldData ?? []).filter((todo) => todo.id !== id);
      });
      return { previousTodos };
    },
    onSettled: () => {
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

  const getDate = (date: Date) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(date);
  const creationDate = (date: Date) => {
    const timeDifference = new Date().getTime() - date.getTime();
    const daysAgo = Math.floor(timeDifference / (1000 * 3600 * 24));
    return `${daysAgo} days ago`;
  };

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
            return (
              <div
                key={todo.id}
                className='flex flex-col gap-2 bg-slate-800 w-full text-gray-100 container mx-auto hover:bg-slate-900 rounded-lg '
              >
                <button
                  className={clsx(
                    'flex flex-col justify-around items-center py-5 cursor-pointer',
                    todo.check && 'bg-slate-500 opacity-50 line-through'
                  )}
                  onClick={() => updateCheckbox({ id: todo.id, bool: todo.check! })}
                >
                  <p className='text-2xl'>{todo.title}</p>
                  <p className='sm:text-xl text-sm'> {todo.content}</p>
                </button>
                <div className='gap-2 flex flex-col sm:flex-row sm:justify-between  bg-slate-950 w-full p-2 rounded-lg'>
                  <div className='flex flex-col  gap-2'>
                    <p className='italic text-sm'>DueDate: {getDate(todo.dueDate!)}</p>
                    <div className='flex gap-5'>
                      <p className='italic text-sm'>Created: {creationDate(todo.createdAt!)}</p>
                      <CheckboxHandler todo={todo} updateCheckbox={updateCheckbox} />
                    </div>
                  </div>
                  <div className='flex items-center justify-around gap-2 '>
                    <SelectPriority todo={todo} updatePriority={updatePriority} />

                    <DeleteButton id={todo.id} deleteTodo={deleteTodo} />
                  </div>
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
}
export default FilteredItems;
