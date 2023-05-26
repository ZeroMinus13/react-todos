'use server';
import db from '../../../database/db';
import todoSchema from '../../../database/schema';

async function createPost(data: FormData) {
  const title = data.get('title') as string;
  const content = data.get('content') as string;
  const check = data.get('check') as unknown as boolean;
  console.log(check);
  if (!title || !content) return;
  await db.insert(todoSchema).values({ title, content, check: check || false });
}

export { createPost };
