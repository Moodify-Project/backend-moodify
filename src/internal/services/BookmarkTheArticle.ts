import { prisma } from "../configs/prisma";
import { redisClient } from "../configs/redis";
import { ArticleRepository } from "../repositories/ArticleRepository";
import { UserBookmarkArticleRepository } from "../repositories/BookmarkArticleRepository";

export class BookmarkTheArticle {
    private userBookmarkArticleRepository: UserBookmarkArticleRepository;
    private articleRepository: ArticleRepository | null;

    constructor(userBookmarkArticleRepository: UserBookmarkArticleRepository, articleRepository?: ArticleRepository) {
        this.userBookmarkArticleRepository = userBookmarkArticleRepository;
        this.articleRepository = articleRepository || null;
    }

    execute = async (email: string, articleId: string): Promise<boolean> => {
        return await prisma.$transaction(async (tx) => {
            const bookmarkFound = await this.userBookmarkArticleRepository.findBookmarkedArticleById(email, articleId, tx);

            if (bookmarkFound) {
                throw new Error("User already bookmark the article");
            }

            await this.userBookmarkArticleRepository.newBookmarkTheArticle(email, articleId, tx);

            const client = await redisClient();

            const articles = await client.keys('article-*');
            for (const article of articles) {
              await client.del(article);
            } 

            return true;
        })

    }
}