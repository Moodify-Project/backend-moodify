import { Prisma, PrismaClient } from "@prisma/client";

export class BaseRepository {
    public static _prisma: PrismaClient;

    constructor() {
        BaseRepository._prisma = new PrismaClient();
    }

    getAllArticleIdFromDB = async () => {
        return await BaseRepository._prisma.$queryRaw`SELECT COUNT(A.articleId) AS bookmarkedCount, B.id, 
        B.title, B.description, B.url, B.urlToImage, B.publishedAt, B.content FROM article B LEFT JOIN 
        userbookmarkarticle A ON A.articleId = B.id GROUP BY B.id ORDER BY bookmarkedCount DESC`
    }
}