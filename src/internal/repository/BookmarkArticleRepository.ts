import { BaseRepository } from "./BaseRepository";

export class UserBookmarkArticleRepository extends BaseRepository {
    bookmarkTheArticle = async (emailUser: string, uuidArticle: string): Promise<any> => {
        return await UserBookmarkArticleRepository._prisma.userBookmarkArticle.create({
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
}