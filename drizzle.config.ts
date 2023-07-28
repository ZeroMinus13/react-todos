import type { Config } from 'drizzle-kit';

export default {
  schema: './database/schema.tsx',
  out: './drizzle',
} satisfies Config;
