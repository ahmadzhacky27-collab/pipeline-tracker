// import { PrismaClient } from '@prisma/client';

// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export default prisma;

import { PrismaClient } from '../src/generated/prisma/index.js'; // Sesuaikan path relatifnya dari file Anda

const prisma = new PrismaClient();
export default prisma;