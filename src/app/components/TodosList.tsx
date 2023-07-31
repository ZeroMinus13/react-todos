'use client';
import { useState } from 'react';
import { DeleteButton, CheckboxHandler, SelectPriority, ChangeSelectedTodos, Todotitle } from './ClientSide';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { getData } from '../api/actions';
import { deleteSingle, serverCheckBox, serverPriority } from '../api/actions';
import { type Todo, type User, UserPayload } from '@prisma/client';
import Image from 'next/image';

async function fetchData() {
  const users = await getData();
  return users;
}
type UserWithPosts = UserPayload<{ include: { todo: true } }>;
type UserWithPosts2 = User & { todo: Todo[] };

function FilteredItems({ users }: { users: UserWithPosts2 }) {
  const [search, setSearch] = useState('');
  const [selectedPriority, setselectedPriority] = useState('');
  const [selectedCheck, setselectedCheck] = useState('');
  const queryClient = useQueryClient();

  const { data, isError, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchData,
    initialData: users,
  });

  const { mutate: updateCheckbox } = useMutation({
    mutationFn: ({ id, bool }: { id: number; bool: boolean }) => serverCheckBox(id, bool),

    onMutate: async ({ id, bool }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData(['todos']);
      queryClient.setQueryData<Todo[]>(['todos'], (oldData) => {
        return (oldData ?? []).map((todo) => (todo.id === id ? { ...todo, check: !bool } : todo));
      });
      return { previousTodos };
    },

    onError: (error, variables, context) => {
      queryClient.setQueryData(['todos'], context?.previousTodos);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const { mutate: updatePriority } = useMutation({
    mutationFn: ({ id, priority }: { id: number; priority: string }) => serverPriority(id, priority),

    onMutate: async ({ id, priority }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData(['todos']);
      queryClient.setQueryData<Todo[]>(['todos'], (oldData) => {
        return (oldData ?? []).map((todo) => (todo.id === id ? { ...todo, priority } : todo));
      });
      return { previousTodos };
    },

    onError: (error, variables, context) => {
      queryClient.setQueryData(['todos'], context?.previousTodos);
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

      queryClient.setQueryData<Todo[]>(['todos'], (oldData) => {
        return (oldData ?? []).filter((todo) => todo.id !== id);
      });
      return { previousTodos };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['todos'], context?.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const lowerSearch = (i: string) => i.toLowerCase().includes(search.toLowerCase());
  const filteredItems = (data ?? [])
    .flatMap((user) => user.todo)
    .filter((item) => lowerSearch(item.title) || lowerSearch(item.content))
    .filter((item) => !selectedPriority || item.priority === selectedPriority)
    .filter((item) => !selectedCheck || item?.check?.toString() === selectedCheck)
    .map((todo) => ({ user: data?.find((user) => user.todo.includes(todo)), todo }));

  const getDate = (date: Date) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(date);
  const creationDate = (date: Date) => {
    const timeDifference = new Date().getTime() - date.getTime();
    const daysAgo = Math.floor(timeDifference / (1000 * 3600 * 24));
    return `${daysAgo} days ago`;
  };

  if (isError) {
    return <p>{(error as unknown as Error).toString()}</p>;
  }

  return (
    <div className='flex flex-col gap-2 container mx-auto w-full'>
      <input
        type='text'
        placeholder='Search'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='block w-full p-4 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white'
      />

      <span className='text-gray-100 text-center text-2xl'>Total Todos: {filteredItems.length}</span>
      <ChangeSelectedTodos
        priority={selectedPriority}
        setPriority={setselectedPriority}
        check={selectedCheck}
        setCheck={setselectedCheck}
      />

      {filteredItems.map(({ user, todo }) => {
        return (
          <div
            key={todo.id}
            className='flex flex-col gap-2 bg-slate-800 w-full text-gray-100 container mx-auto hover:bg-slate-900 rounded-lg '
          >
            <Todotitle todo={todo} updateCheckbox={updateCheckbox} />
            <div className='gap-2 flex flex-col sm:flex-row sm:justify-between bg-slate-950 w-full p-2 rounded-lg'>
              <div className='flex flex-col gap-2'>
                <p className='italic text-sm'>DueDate: {getDate(todo.dueDate)}</p>
                <div className='space-x-4'>
                  {user.image && (
                    <Image
                      src={user?.image}
                      alt={user?.name ?? 'User Image'}
                      width={40}
                      height={40}
                      className='rounded-full w-10 h-10 inline'
                    />
                  )}
                  <span className=''>{user.name}</span>
                </div>
                <div className='flex gap-5'>
                  <p className='italic text-sm'>Created: {creationDate(todo.createdAt)}</p>
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
      })}
    </div>
  );
}
export default FilteredItems;
