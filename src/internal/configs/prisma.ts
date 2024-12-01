import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient(
// {
//     datasources: {
//         db: {
//             url: String(process.env.MYSQL_URL),
//         },
//     },
//   }
);
  