import { Prisma, PrismaClient } from "@prisma/client";

export class BaseRepository {
    public static _prisma: PrismaClient;

    constructor() {
        BaseRepository._prisma = new PrismaClient();
    }

    getAllArticleIdFromDB = async () => {
        return await BaseRepository._prisma.$queryRaw`select COUNT(*) as bookmarkedCount, B.id, B.title, 
        B.description, B.url, B.urlToImage, B.publishedAt, B.content from userbookmarkarticle A JOIN 
        article B ON A.articleId = B.id GROUP BY articleId`
    }
}