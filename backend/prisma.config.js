import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env') });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
  migrations: {
    seed: 'node prisma/seed/index.js',
  },
});
