import { BaseRepository } from "./BaseRepository";

export class UserBookmarkArticleRepository extends BaseRepository {
    newBookmarkTheArticle = async (emailUser: string, uuidArticle: string, tx?: any): Promise<any> => {
        return await (tx || UserBookmarkArticleRepository._prisma).userBookmarkArticle.create({
            data: {
                emailUser: emailUser,
                articleId: uuidArticle,
            }
        })
    }

    countBookmarkedArticle = async (articleId: string): Promise<any> => {
        return await UserBookmarkArticleRepository._prisma.userBookmarkArticle.count({
            where: {
                articleId: articleId,
            }
        })
    }

    findBookmarkedArticleById = async (email: string, articleId: string, tx?: any) => {
        return await (tx || UserBookmarkArticleRepository._prisma).userBookmarkArticle.findFirst({
            where: {
                emailUser: email,
                articleId: articleId,
              },
        });
    }

    findBookmarkedArticleByUser = async (email: string) => {
        return await UserBookmarkArticleRepository._prisma.userBookmarkArticle.findMany({
            where: {
                emailUser: email
            }
        })
    }

}