// backend/prisma.config.ts

import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  // This is required by Prisma 7 for migrate dev
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
