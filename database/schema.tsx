import { InferModel } from 'drizzle-orm';
import { serial, varchar, timestamp, boolean, mysqlTable, mysqlEnum, date } from 'drizzle-orm/mysql-core';

const todoSchema = mysqlTable('todos', {
  id: serial('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 20 }).notNull(),
  content: varchar('content', { length: 200 }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
  dueDate: date('dueDate'),
  check: boolean('check'),
  priority: mysqlEnum('priority', ['High', 'Medium', 'Low']),
});

export type todos = InferModel<typeof todoSchema>;

export default todoSchema;
