'use server';
import { prisma } from '../../../prisma/dbConnection';
import { getSession } from './auth/[...nextauth]/route';

const getCurrentUser = async () => {
  const session = await getSession();
  if (!session) return null;
  const currentUser = await prisma.user.findFirst({ where: { email: session?.user?.email } });
  return currentUser;
};

async function createPost(data: FormData) {
  let currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error('Please Log In!');
  }

  const title = (data.get('title') as string).trim();
  const content = (data.get('content') as string).trim();
  const check = data.get('check') === 'on' ? true : false;
  const priority = data.get('priority') as string;
  const dueDateValue = data.get('dueDate') as string;

  if (!title || !content) return;
  let dueDate = new Date(dueDateValue);

  await prisma.todo.create({
    data: { title, content, check, priority, dueDate, author: { connect: { id: currentUser.id } } },
  });
}

async function getData() {
  const usersWithTodos = await prisma.user.findMany({ include: { todo: true } });
  return usersWithTodos;
}

async function deleteSingle(id: number) {
  let currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error('Please Log In!');
  }
  await prisma.todo.delete({ where: { id } });
}

async function serverCheckBox(id: number, bool: boolean): Promise<void> {
  let currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error('Please Log In!');
  }
  await prisma.todo.update({
    data: { check: !bool },
    where: { id: id },
  });
}

async function serverPriority(id: number, priority: string) {
  let currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error('Please Log In!');
  }
  await prisma.todo.update({
    data: { priority: priority },
    where: { id: id },
  });
}

export { createPost, getData, deleteSingle, serverCheckBox, serverPriority };
