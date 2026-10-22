import dotenv from 'dotenv';
dotenv.config(); // Memuat file .env secara eksplisit

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  seed: 'node prisma/seed.js',
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env('DATABASE_URL')
  },
});