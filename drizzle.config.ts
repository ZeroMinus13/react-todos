import type { Config } from 'drizzle-kit';
const dotenv = require('dotenv');
dotenv.config();

export default {
  schema: './database/schema.tsx',
  out: './drizzle',
  // host: process.env.DATABASE_HOST,
  // user: process.env.DATABASE_USERNAME,
  // password: process.env.DATABASE_PASSWORD,
  connectionString: process.env.DATABASE_URL,
} satisfies Config;
