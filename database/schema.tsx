import { int, varchar, timestamp, mysqlTable, boolean } from 'drizzle-orm/mysql-core';

const todoSchema = mysqlTable('todos', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 10 }).notNull(),
  content: varchar('content', { length: 100 }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
  check: boolean('check'),
});

export default todoSchema;
