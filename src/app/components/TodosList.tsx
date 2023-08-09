'use client';
import { useState } from 'react';
import { DeleteButton, CheckboxHandler, SelectPriority, ChangeSelectedTodos, Todotitle } from './ClientSide';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { getData } from '../api/actions';
import { deleteSingle, serverCheckBox, serverPriority } from '../api/actions';
import { Prisma, type User, type Todo } from '@prisma/client';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Loading from './Loading';

type UserWithPosts = Prisma.UserGetPayload<{ include: { todo: true } }> | undefined;

function FilteredItems() {
  const [search, setSearch] = useState('');
  const [selectedPriority, setselectedPriority] = useState('');
  const [selectedCheck, setselectedCheck] = useState('');
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: () => getData(),
  });

  const updateCheckbox = useMutation({
    mutationFn: ({ id, bool }: { id: number; bool: boolean }) => serverCheckBox(id, bool),

    onMutate: async ({ id, bool }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData(['todos']);
      queryClient.setQueryData<UserWithPosts>(['todos'], (oldData) => {
        if (!oldData) return oldData;
        const updatedTodos = oldData.todo.map((item) => (item.id === id ? { ...item, check: !bool } : item));
        return { ...oldData, todo: updatedTodos };
      });
      return { previousTodos };
    },

    onError: (error, variables, context) => queryClient.setQueryData(['todos'], context?.previousTodos),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const updatePriority = useMutation({
    mutationFn: ({ id, priority }: { id: number; priority: string }) => serverPriority(id, priority),

    onMutate: async ({ id, priority }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData(['todos']);
      queryClient.setQueryData<UserWithPosts>(['todos'], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          todo: oldData.todo.map((item) => (item.id === id ? { ...item, priority } : item)),
        };
      });
      return { previousTodos };
    },

    onError: (error, variables, context) => queryClient.setQueryData(['todos'], context?.previousTodos),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const deleteTodo = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteSingle(id),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData(['todos']);
      queryClient.setQueryData<UserWithPosts>(['todos'], (oldData) => {
        if (!oldData) return oldData;
        const updatedTodos = oldData.todo.filter((item) => item.id !== id);
        return { ...oldData, todo: updatedTodos };
      });

      return { previousTodos };
    },
    onError: (error, variables, context) => queryClient.setQueryData(['todos'], context?.previousTodos),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  if (!session) {
    return <p className='text-red-400 text-center text-xl'>Please Log in to make changes.</p>;
  }
  if (!data || isLoading) {
    return <Loading />;
  }

  if (isError && error instanceof Error) {
    return <div>{error.message}</div>;
  }

  const lowerSearch = (i: string) => i.toLowerCase().includes(search.toLowerCase());

  const filteredTodos = data.todo
    .filter((item) => lowerSearch(item.title) || lowerSearch(item.content))
    .filter((item) => !selectedPriority || item.priority === selectedPriority)
    .filter((item) => !selectedCheck || item?.check?.toString() === selectedCheck);

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
        placeholder='Search...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='block w-full p-4 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white'
      />

      <span className='text-gray-100 text-center text-2xl'>Total Todos: {filteredTodos.length}</span>
      <ChangeSelectedTodos
        priority={selectedPriority}
        setPriority={setselectedPriority}
        check={selectedCheck}
        setCheck={setselectedCheck}
      />

      {filteredTodos.map((todo) => {
        return (
          <div
            key={todo.id}
            className='flex flex-col gap-2 bg-slate-800 w-full text-gray-100 container mx-auto hover:bg-slate-900 rounded-lg '
          >
            <Todotitle todo={todo} updateCheckbox={updateCheckbox.mutate} />
            <div className='gap-2 flex flex-col sm:flex-row sm:justify-between bg-slate-950 w-full p-2 rounded-lg'>
              <div className={'flex flex-col gap-2'}>
                <div>
                  {data?.image && (
                    <Image
                      src={data?.image}
                      alt={data?.name ?? 'User Image'}
                      width={40}
                      height={40}
                      className='rounded-full w-10 h-10 inline mr-2'
                    />
                  )}
                  <span className='hidden sm:inline'>{data?.name}</span>
                  <p className='italic text-sm hidden sm:block'>DueDate: {getDate(todo.dueDate)}</p>
                </div>
                <div className='flex gap-5'>
                  <p className='italic text-sm'>Created: {creationDate(todo.createdAt)}</p>
                  {session && <CheckboxHandler todo={todo} updateCheckbox={updateCheckbox.mutate} />}
                </div>
              </div>
              {session && (
                <div className='flex sm:flex-col items-center justify-around gap-2'>
                  <SelectPriority todo={todo} updatePriority={updatePriority.mutate} />{' '}
                  <DeleteButton id={todo.id} deleteTodo={deleteTodo.mutate} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default FilteredItems;
