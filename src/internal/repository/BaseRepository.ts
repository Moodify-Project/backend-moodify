import { Prisma, PrismaClient } from "@prisma/client";

export class BaseRepository {
    public static _prisma: PrismaClient;

    constructor() {
        BaseRepository._prisma = new PrismaClient();
    }
}