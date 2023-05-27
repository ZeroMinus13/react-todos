'use server';
import { eq } from 'drizzle-orm';
import db from '../../../database/db';
import todoSchema, { type todos } from '../../../database/schema';
import { revalidatePath } from 'next/cache';

async function createPost(data: FormData) {
  const title = data.get('title') as string;
  const content = data.get('content') as string;
  let check = data.get('check');
  const priority = data.get('priority') as todos['priority'];
  const dueDate = data.get('dueDate') as todos['dueDate'];

  if (!title || !content) return;
  console.log('date', dueDate, 'Check', check);
  await db.insert(todoSchema).values({ title, content, check: check == 'on' ? true : false, priority, dueDate });
  revalidatePath('/');
}

async function getData() {
  return await db.select().from(todoSchema);
}

async function deleteSingle(id: number) {
  await db.delete(todoSchema).where(eq(todoSchema.id, id));
  revalidatePath('/');
}

async function updateCheckbox(id: number, bool: boolean) {
  await db.update(todoSchema).set({ check: !bool }).where(eq(todoSchema.id, id));
  revalidatePath('/');
}

async function updatePriority(id: number, value: todos['priority']) {
  await db.update(todoSchema).set({ priority: value }).where(eq(todoSchema.id, id));
  revalidatePath('/');
}

export { createPost, getData, deleteSingle, updateCheckbox, updatePriority };
