import { Prisma } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import { Article } from "../../../types/interfaces/interface.common";

export class ArticleRepository extends BaseRepository {
    findAllArticleBookmarkedByUser = async (articleIdCollection: string[]): Promise<Article[]>  => {
        return await ArticleRepository._prisma.article.findMany({
            where: {
                id: {
                    in: articleIdCollection
                },
            },
        });
    }
}