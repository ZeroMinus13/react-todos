'use server';
import { eq } from 'drizzle-orm';
import db from '../../../database/db';
import todoSchema, { type todos } from '../../../database/schema';

async function createPost(data: FormData) {
  const title = (data.get('title') as string).trim();
  const content = (data.get('content') as string).trim();
  let check = data.get('check');
  const priority = data.get('priority') as todos['priority'];
  const dueDate = data.get('dueDate') as todos['dueDate'];

  if (!title || !content) return;
  await db.insert(todoSchema).values({ title, content, check: check == 'on' ? true : false, priority, dueDate });
}

async function getData() {
  let data = await db.select().from(todoSchema);
  return data;
}

async function deleteSingle(id: number) {
  await db.delete(todoSchema).where(eq(todoSchema.id, id));
}

async function serverCheckBox(id: number, bool: boolean): Promise<void> {
  await db.update(todoSchema).set({ check: !bool }).where(eq(todoSchema.id, id));
}

async function serverPriority(id: number, priority: todos['priority']) {
  await db
    .update(todoSchema)
    .set({ priority: priority ?? 'Medium' })
    .where(eq(todoSchema.id, id));
}

export { createPost, getData, deleteSingle, serverCheckBox, serverPriority };
