import { Prisma } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import { Article } from "../../../types/interfaces/interface.common";

export class ArticleRepository extends BaseRepository {
    findAllArticleBookmarkedByUser = async (articleIdCollection: string[]): Promise<Article[]> => {
        return await ArticleRepository._prisma.article.findMany({
            where: {
                id: {
                    in: articleIdCollection
                },
            },
        });
    }

    findArticleById = async (articleId: string): Promise<Article> => {
        try {
            return await ArticleRepository._prisma.article.findFirstOrThrow({
                where: {
                    id: articleId,
                },
            });
        } catch (error) {
            throw new Error("Article not found");
        }
    };
    
}